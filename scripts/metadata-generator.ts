import * as fs from "node:fs/promises";
import * as path from "node:path";
import { createHash } from "node:crypto";

// gray-matter uses CommonJS export = syntax; use require for correct typing.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const grayMatter = require("gray-matter") as typeof import("gray-matter");

type Frontmatter = Record<string, unknown>;

type PostRecord = Frontmatter & {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  autoTags: string[];
  sourcePath: string;
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const OUTPUT_DIR = path.join(process.cwd(), "generated");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "posts.json");
const EMBEDDING_CACHE_FILE = path.join(OUTPUT_DIR, "embedding-cache.json");
const OPENAI_EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_INPUT_MAX_CHARS = 1000;
const TAG_VOCAB = [
  "Algorithm",
  "Graphics",
  "GPU",
  "AI",
  "Systems",
  "Network",
  "Security",
  "Math",
] as const;

type EmbeddingCache = Record<string, number[]>;

let embeddingCache: EmbeddingCache | null = null;
let didUpdateEmbeddingCache = false;
let tagEmbeddingCache: Record<string, number[]> | null = null;

async function getMarkdownFiles(dir: string): Promise<string[]> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const dirent of dirents) {
    const fullPath = path.join(dir, dirent.name);

    if (dirent.isDirectory()) {
      const nested = await getMarkdownFiles(fullPath);
      files.push(...nested);
    } else if (dirent.isFile() && fullPath.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function normalizeTags(tags: unknown): string[] {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean);
  }
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
}

function dedupeTags(tags: string[]): string[] {
  return Array.from(new Set(tags.map((tag) => tag.toLowerCase()))).map(
    (tag) => tag.charAt(0).toUpperCase() + tag.slice(1),
  );
}

function hashEmbeddingInput(input: string): string {
  return createHash("sha1").update(input).digest("hex");
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return -1;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (denom === 0) return -1;
  return dot / denom;
}

function buildExcerpt(markdown: string, maxLength = 180): string {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();

  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength).trimEnd()}...`;
}

function extractAutoTags(input: { title: string; content: string }): string[] {
  const corpus = `${input.title}\n${input.content}`.toLowerCase();
  const tagRules: Array<{ tag: string; keywords: string[] }> = [
    { tag: "Algorithm", keywords: ["algorithm", "dynamic programming", "greedy"] },
    { tag: "Graphics", keywords: ["rendering", "shader", "opengl", "vulkan", "pbr"] },
    { tag: "Gpu", keywords: ["gpu", "cuda", "kernel", "parallel"] },
    { tag: "Security", keywords: ["security", "vulnerability", "exploit", "xss"] },
    { tag: "Network", keywords: ["tcp", "udp", "http", "routing", "congestion"] },
    { tag: "Systems", keywords: ["process", "thread", "memory", "filesystem"] },
    { tag: "Math", keywords: ["matrix", "eigen", "calculus", "probability"] },
  ];

  return tagRules
    .filter((rule) => rule.keywords.some((keyword) => corpus.includes(keyword)))
    .map((rule) => rule.tag);
}

async function ensureEmbeddingCacheLoaded(): Promise<void> {
  if (embeddingCache) return;
  try {
    const raw = await fs.readFile(EMBEDDING_CACHE_FILE, "utf8");
    embeddingCache = JSON.parse(raw) as EmbeddingCache;
  } catch {
    embeddingCache = {};
  }
}

async function writeEmbeddingCacheIfNeeded(): Promise<void> {
  if (!didUpdateEmbeddingCache || !embeddingCache) return;
  await fs.writeFile(
    EMBEDDING_CACHE_FILE,
    JSON.stringify(embeddingCache, null, 2),
    "utf8",
  );
}

async function requestEmbedding(input: string): Promise<number[] | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_EMBEDDING_MODEL,
      input,
    }),
  });

  if (!res.ok) return null;

  const data = (await res.json()) as {
    data?: Array<{ embedding?: number[] }>;
  };
  const embedding = data.data?.[0]?.embedding;
  return Array.isArray(embedding) ? embedding : null;
}

async function getEmbeddingWithCache(input: string): Promise<number[] | null> {
  await ensureEmbeddingCacheLoaded();
  const key = hashEmbeddingInput(input);

  if (embeddingCache && embeddingCache[key]) {
    return embeddingCache[key];
  }

  const embedding = await requestEmbedding(input);
  if (!embedding || !embeddingCache) return null;

  // Cache by deterministic content hash to reduce repeated API cost.
  embeddingCache[key] = embedding;
  didUpdateEmbeddingCache = true;
  return embedding;
}

async function ensureTagEmbeddings(): Promise<Record<string, number[]> | null> {
  if (tagEmbeddingCache) return tagEmbeddingCache;

  const pairs = await Promise.all(
    TAG_VOCAB.map(async (tag) => [tag, await getEmbeddingWithCache(tag)] as const),
  );
  const resolved: Record<string, number[]> = {};
  for (const [tag, embedding] of pairs) {
    if (!embedding) return null;
    resolved[tag] = embedding;
  }
  tagEmbeddingCache = resolved;
  return tagEmbeddingCache;
}

async function extractEmbeddingTags(input: {
  title: string;
  content: string;
}): Promise<string[]> {
  const snippet = input.content.slice(0, EMBEDDING_INPUT_MAX_CHARS);
  const embeddingInput = `${input.title}\n\n${snippet}`;
  const postEmbedding = await getEmbeddingWithCache(embeddingInput);
  if (!postEmbedding) return [];

  const tagEmbeddings = await ensureTagEmbeddings();
  if (!tagEmbeddings) return [];

  // Score vocabulary tags by cosine similarity and pick top semantic matches.
  const ranked = TAG_VOCAB.map((tag) => ({
    tag,
    score: cosineSimilarity(postEmbedding, tagEmbeddings[tag]),
  })).sort((a, b) => b.score - a.score);

  return ranked
    .filter((item) => item.score > 0)
    .slice(0, 3)
    .map((item) => item.tag);
}

async function readPost(filePath: string): Promise<PostRecord> {
  const raw = await fs.readFile(filePath, "utf8");
  const { data, content } = grayMatter(raw) as {
    data: Frontmatter;
    content: string;
  };

  const relative = path.relative(POSTS_DIR, filePath);
  const slug = relative.replace(/\\/g, "/").replace(/\.md$/, "");
  const title =
    typeof data.title === "string" && data.title.trim() ? data.title : slug;
  const frontmatterTags = normalizeTags(data.tags);
  const autoTags = extractAutoTags({ title, content });
  const embeddingTags = await extractEmbeddingTags({ title, content });
  const tags = dedupeTags([...frontmatterTags, ...autoTags, ...embeddingTags]);
  const excerpt =
    typeof data.excerpt === "string" && data.excerpt.trim()
      ? data.excerpt
      : buildExcerpt(content);

  return {
    ...data,
    slug,
    title,
    excerpt,
    autoTags,
    tags,
    sourcePath: relative.replace(/\\/g, "/"),
  };
}

async function ensureOutputDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

async function main() {
  try {
    const exists = await fs
      .access(POSTS_DIR)
      .then(() => true)
      .catch(() => false);

    if (!exists) {
      await fs.mkdir(POSTS_DIR, { recursive: true });
      console.log(`Created posts directory at ${POSTS_DIR}`);
    }

    const files = await getMarkdownFiles(POSTS_DIR);

    const posts = await Promise.all(files.map(readPost));

    await ensureOutputDir(OUTPUT_DIR);

    await fs.writeFile(
      OUTPUT_FILE,
      JSON.stringify(posts, null, 2),
      "utf8",
    );
    await writeEmbeddingCacheIfNeeded();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

void main();
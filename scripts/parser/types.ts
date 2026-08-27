export interface Metadata {
  title: string;
  date?: string;
  tags: string[];
  description?: string;
  category?: string;
  thumbnail?: string;
  draft: boolean;
}

export interface ParsedMarkdown {
  metadata: Metadata;
  content: string;
  sourcePath: string;
}
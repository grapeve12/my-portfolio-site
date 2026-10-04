// app/page.tsx
import ProjectCard from "@/components/ProjectCard";
import ArchiveSection from "@/components/ArchiveSection";
import ProfileCat from "@/components/ProfileCat";
import HeroPhoto from "@/components/HeroPhoto";
import ResumeCta from "@/components/ResumeCta";
import Button from "@/components/ui/Button";
import SectionTitle from "@/components/ui/SectionTitle";
import Divider from "@/components/ui/Divider";

export default function Home() {
  // 이력서용 배포(SITE_MODE=resume)에서는 실제 프로필 사진을,
  // 일상용 배포에서는 픽셀 고양이를 보여준다.
  const isResumeMode = process.env.SITE_MODE === "resume";

  return (
    <main className="min-h-screen bg-[#0b0d0b] text-[#f2f3f1]">
      {/* 전체 컨테이너 */}
      <div className="mx-auto max-w-5xl px-4 pb-16">
        {/* ===== HERO SECTION ===== */}
        <section className="flex flex-col gap-8 py-16 md:flex-row md:items-center">
          {/* 왼쪽: 프로필 이미지 (이력서용 사진 / 픽셀 고양이) */}
          <div className="relative flex flex-col items-center md:w-1/3">
            {isResumeMode ? <HeroPhoto /> : <ProfileCat />}

          </div>

          {/* 오른쪽: 소개 텍스트 */}
          <div className="mt-6 md:mt-0 md:w-2/3">
            <p className="text-sm uppercase tracking-[0.2em] text-[#8fa393]">
              Portfolio
            </p>
            <h1 className="mt-2 text-3xl font-semibold leading-snug md:text-4xl">
              Hi, I&apos;m{" "}
              <span className="text-[#9fd3a8]">SeoIm Choi</span>, a programmer
              working at the intersection of creativity and engineering.
            </h1>
            {/*}
            <p className="mt-4 max-w-xl text-sm text-[#cbd5ce]">
              I build products end-to-end — from web backends and frontends to
              Android apps — and enjoy GPU-focused development with CUDA,
              PyTorch, and OpenGL. I also love structuring what I learn into
              clear, markdown-based documentation.
            </p>
            */}

            {/* 키워드 */}
            {/*
            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              {[
                "AI Inference Pipeline",
                "GPU & Graphics Programming",
                "Technical Documentation",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#4f6f58]/60 px-3 py-1 text-[#d1e4d5]"
                >
                  {tag}
                </span>
              ))}
            </div>
            */}

            {/* CTA 버튼 */}
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <ResumeCta />
              <Button href="/posts" variant="outline">
                Posts (Debug)
              </Button>
              <Button
                href="https://github.com/grapeve12"
                target="_blank"
                rel="noreferrer"
                variant="outline"
              >
                GitHub
              </Button>
            </div>
          </div>
        </section>

        {/* 구분선 */}
        <Divider />

        {/* ===== ABOUT SECTION ===== */}
        {/*
        <section id="about" className="py-12">
          <h2 className="section-title">About Me</h2>

          <div className="mt-6 grid gap-8 md:grid-cols-[1.6fr,1fr]">
            <div>
              <p className="text-sm leading-relaxed text-[#dadfd8]">
                I&apos;m an engineer who enjoys turning abstract ideas into
                concrete systems. From graphics pipelines and GPU kernels to
                full-stack web services and Android apps, I like understanding
                how things work end-to-end and then building them from scratch.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#dadfd8]">
                Recently, I&apos;ve been exploring real-time rendering,
                non-photorealistic rendering, and GPU-accelerated computing.
                Along the way, I document what I learn in markdown to make it
                easier to revisit, refine, and share.
              </p>
            </div>
          </div>
        </section>

        <Divider />
        */}

        {/* ===== SKILLS SECTION ===== */}
        {/*
        <section id="skills" className="py-12">
          <h2 className="section-title">Skills</h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <SkillCard
              title="GPU & Graphics Engineering"
              items={[
                "CUDA/OpenGL development, real-time rendering",
                "Basic ray tracing & GPU performance optimization",
              ]}
            />

            <SkillCard
              title="Rendering & Visual Computing"
              items={[
                "PBR shading, transforms, texture processing",
                "Acceleration structures & shader-based rendering",
              ]}
            />

            <SkillCard
              title="Software Engineering"
              items={[
                "Next.js/React tooling & frontend development",
                "Node.js/Flask backend APIs; Kotlin (CameraX) Android apps",
              ]}
            />

            <SkillCard
              title="Technical Documentation"
              items={[
                "Markdown-based technical writing",
                "Code/math explanations & documentation tooling",
              ]}
            />

          </div>
        </section>

        <Divider />
        */}

        {/* ===== MAIN PROJECTS SECTION ===== */}
        <section id="projects" className="py-12">
          <SectionTitle>Main Projects</SectionTitle>
          <div className="mt-6 space-y-6">
            {/* ===================== 1) 2D Modeling Transformations Using OpenGL API ===================== */}
            {/*
            <ProjectCard
              title="2D Modeling Transformations Using OpenGL API"
              description="Creative 2D modeling and animation using OpenGL affine transformations."
              techBadges={[
                "https://img.shields.io/badge/OpenGL-5586A4?style=for-the-badge&logo=opengl&logoColor=white",
                "https://img.shields.io/badge/C++-00599C?style=for-the-badge&logo=c%2B%2B&logoColor=white",
              ]}
              demoVideo="sg-opengl-2d-affine-transform_demo.webm"
              videoWidth={540}
              videoHeight="auto"
              github="https://github.com/grapeve12/sg-opengl-2d-affine-transform"
            />
            */}

            {/* ===================== 2) Jarvision ===================== */}
            <ProjectCard
              title="Jarvision"
              description="AIoT smart home system controlled by hand motion."
              techBadges={[
                "https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white",
                "https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white",
                "https://img.shields.io/badge/MediaPipe-FE6F61?style=for-the-badge&logo=google&logoColor=white",
                "https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white",
                "https://img.shields.io/badge/NumPy-013243?style=for-the-badge&logo=numpy&logoColor=white",
                "https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white",
                "https://img.shields.io/badge/MQTT-660066?style=for-the-badge&logo=eclipse-mosquitto&logoColor=white",
                "https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black",
                "https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white"
              ]}
              demoVideo="Jarvision_demo.webm"
              videoWidth={540}
              videoHeight="auto"
              github="https://github.com/Jarvision-AIoT/vision-module"
              readmeSummary="MediaPipe-based hand detection, MLP-based hand gesture classification, device control using IR signal, and a live web dashboard."
            />

            {/* ===================== 3) FRIDAI ===================== */}
            <ProjectCard
              title="FRIDAI"
              description="Low-Light Image Restoration Web Service."
              techBadges={[
                "https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white",
                "https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB",
                "https://img.shields.io/badge/TailwindCSS-0EA5E9?style=for-the-badge&logo=tailwindcss&logoColor=white",
                "https://img.shields.io/badge/TypeScript-2F74C0?style=for-the-badge&logo=typescript&logoColor=white",
                "https://img.shields.io/badge/FastAPI-05998B?style=for-the-badge&logo=fastapi&logoColor=white"
              ]}
              demoVideo="FRIDAI_demo.webp"
              videoWidth={540}
              videoHeight="auto"
              github="https://github.com/F-R-I-D-AI/dashboard-ui"
              website="https://fridai.vercel.app/"
              readmeSummary="v0.2.0 (Preview) — A two-stage image restoration service combining Retinexformer low-light enhancement and Real-ESRGAN super-resolution."
            />

            {/* ===================== 4) AI Inference Server ===================== */}
            <ProjectCard
              title="AI Inference Server"
              description="Async job execution server built on Redis Queue, a dedicated Worker, and Pub/Sub-driven SSE for real-time status updates."
              techBadges={[
                "https://img.shields.io/badge/FastAPI-05998B?style=for-the-badge&logo=fastapi&logoColor=white",
                "https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white",
                "https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white",
                "https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white",
              ]}
              github="https://github.com/grapeve12/ai-inference-server"
              website="/lab/inference-demo"
              readmeSummary="Redis List(BLPOP) 기반 Job Queue, 재시도 로직을 갖춘 Worker, Pub/Sub으로 상태 변경을 실시간 SSE로 브로드캐스트하는 백엔드 아키텍처."
            />

          </div>
        </section>


        <Divider />

        {/* ===== TOY PROJECTS SECTION ===== */}
        <section id="projects" className="py-12">
          <SectionTitle>Toy Projects</SectionTitle>

          <div className="mt-6 space-y-6">

            {/* ===================== 1) Obsidian to GitHub Markdown Converter ===================== */}
            <ProjectCard
              title="Obsidian → GitHub Markdown Converter"
              description="Convert and preview Obsidian-flavored Markdown inside a live GitHub-style viewer with LaTeX, code highlighting, and safe HTML rendering."
              techBadges={[
                "https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white",
                "https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white",
                "https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black",
                "https://img.shields.io/badge/MathJax-1A1A1A?style=for-the-badge&logo=latex&logoColor=white",
                "https://img.shields.io/badge/Highlight.js-FFB000?style=for-the-badge&logo=javascript&logoColor=white",
                "https://img.shields.io/badge/Markdown_it-000000?style=for-the-badge&logo=markdown&logoColor=white"
              ]}
              demoVideo="obsidian-to-github-md_demo.webm"
              videoWidth={448}
              videoHeight="auto"
              github="https://github.com/grapeve12/obsidian-to-github-md"
              readmeSummary={`v2.1.0 (Release) — Obsidian-style Markdown is converted and previewed safely with LaTeX & code highlighting.`}
              website="https://grapeve12.github.io/obsidian-to-github-md/"
            />

            {/* ===================== 2) Dual PDF Viewer ===================== */}
            <ProjectCard
              title="Dual PDF Viewer"
              description="Compare two PDF files vertically in your browser — with scroll sync, zoom controls, and precise offset adjustments."
              techBadges={[
                "https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white",
                "https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white",
                "https://img.shields.io/badge/PDF.js-FF0000?style=for-the-badge&logo=mozilla&logoColor=white",
                "https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black",
              ]}
              demoVideo="dual-pdf-viewer_demo.webm"
              videoWidth={448}
              videoHeight="auto"
              github="https://github.com/grapeve12/dual-pdf-viewer"
              readmeSummary={`v1.3.0 (Release) — Side-by-side PDF comparison with synchronized scrolling and advanced controls.`}
              website="https://grapeve12.github.io/dual-pdf-viewer/"
            />

            {/* ===================== 3) Remote Scroll — Gesture Auto Scroller ===================== */}
            <ProjectCard
              title="Remote Scroll — Gesture Auto Scroller"
              description="Scroll any screen without touching it using real-time hand-gesture recognition powered by MediaPipe & CameraX."
              techBadges={[
                "https://img.shields.io/badge/Kotlin-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white",
                "https://img.shields.io/badge/CameraX-4285F4?style=for-the-badge&logo=google&logoColor=white",
                "https://img.shields.io/badge/MediaPipe-00D2FF?style=for-the-badge&logo=google&logoColor=white",
                "https://img.shields.io/badge/Android_Studio-3DDC84?style=for-the-badge&logo=androidstudio&logoColor=white",
                "https://img.shields.io/badge/Material_Design_3-4285F4?style=for-the-badge&logo=materialdesign&logoColor=white",
              ]}
              demoVideo="remote-scroll_demo.webm"
              videoWidth={448}
              videoHeight="auto"
              github="https://github.com/grapeve12/remote-scroll"
              readmeSummary={`v0.1.1 (Release) — Foreground camera + accessibility service enabling gesture-based auto scrolling.`}
            />
          </div>
        </section>


        <Divider />

        {/* ===== ARCHIVE SECTION ===== */}
        {/* <ArchiveSection /> */}

        {/* <Divider /> */}

        {/* ===== CONTACT SECTION ===== */}
        <section id="contact" className="py-12">
          <SectionTitle>Contact</SectionTitle>

          <div className="mt-6 space-y-2 text-sm">
            <p>
              <span className="font-medium text-[#9fd3a8]">Email</span>:{" "}
              <a
                href="seoimchoii@gmail.com"
                className="underline-offset-2 hover:underline"
              >
                seoimchoii@gmail.com
              </a>
            </p>
            <p>
              <span className="font-medium text-[#9fd3a8]">GitHub</span>:{" "}
              <a
                href="https://github.com/grapeve12"
                target="_blank"
                rel="noreferrer"
                className="underline-offset-2 hover:underline"
              >
                https://github.com/grapeve12
              </a>
            </p>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="mt-8 border-t border-[#4f6f58]/40 pt-4 text-xs text-[#9aa69c]">
          <p>
            © {new Date().getFullYear()} SeoIm Choi. Built with Next.js.
            Theme inspired by calm green fields & a black cat.
          </p>
          <p className="mt-2">
            &quot;
            <a
              href="https://skfb.ly/6YPwH"
              target="_blank"
              rel="noreferrer"
              className="underline-offset-2 hover:underline"
            >
              An Animated Cat
            </a>
            &quot; by Evil_Katz is licensed under{" "}
            <a
              href="http://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noreferrer"
              className="underline-offset-2 hover:underline"
            >
              Creative Commons Attribution
            </a>
            .
          </p>
        </footer>
      </div>
    </main>
  );
}

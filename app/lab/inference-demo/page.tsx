// app/lab/inference-demo/page.tsx
import InferenceDemo from "@/components/InferenceDemo";
import SectionTitle from "@/components/ui/SectionTitle";

export default function InferenceDemoPage() {
  return (
    <main className="min-h-screen bg-[#0b0d0b] text-[#f2f3f1]">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <SectionTitle>AI Inference Server — Live Demo</SectionTitle>
        <p className="mt-2 text-sm text-[#8fa393]">
          Redis Queue + Worker + Pub/Sub 기반 비동기 Job 처리 아키텍처를 실시간으로 체험합니다.
        </p>
        <div className="mt-6">
          <InferenceDemo />
        </div>
      </div>
    </main>
  );
}

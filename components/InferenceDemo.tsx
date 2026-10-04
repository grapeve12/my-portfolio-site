// components/InferenceDemo.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

type JobStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";

type Job = {
  id: number;
  status: JobStatus;
  runningStartedAt: number | null;
  elapsedSeconds: number;
};

const STATUS_LABEL: Record<JobStatus, string> = {
  PENDING: "대기 중",
  RUNNING: "처리 중",
  COMPLETED: "완료",
  FAILED: "실패",
  CANCELLED: "취소됨",
};

const STATUS_STYLE: Record<JobStatus, string> = {
  PENDING: "bg-[#4f6f58]/40 text-[#d6e4da]",
  RUNNING: "bg-[#9fd3a8]/20 text-[#9fd3a8] animate-pulse",
  COMPLETED: "bg-[#4f6f58] text-[#f2f3f1]",
  FAILED: "bg-red-900/40 text-red-300",
  CANCELLED: "bg-[#4f6f58]/20 text-[#9aa69c]",
};

const TERMINAL_STATUSES: JobStatus[] = ["COMPLETED", "FAILED", "CANCELLED"];

function formatElapsed(seconds: number): string {
  return `${Math.max(0, Math.floor(seconds))}s`;
}

export default function InferenceDemo() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const eventSourcesRef = useRef<Map<number, EventSource>>(new Map());

  useEffect(() => {
    const sources = eventSourcesRef.current;
    return () => {
      sources.forEach((es) => es.close());
      sources.clear();
    };
  }, []);

  // RUNNING인 Job이 하나라도 있는 동안만 1초 간격으로 경과 시간을 갱신한다.
  useEffect(() => {
    if (!jobs.some((job) => job.status === "RUNNING")) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [jobs]);

  const runJob = async () => {
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/inference/jobs", { method: "POST" });
      const created = await res.json();
      const id: number = created.id;

      setJobs((prev) => [
        { id, status: created.status, runningStartedAt: null, elapsedSeconds: 0 },
        ...prev,
      ]);

      const es = new EventSource(`/api/inference/jobs/${id}/events`);
      eventSourcesRef.current.set(id, es);

      es.onmessage = (e) => {
        const data = JSON.parse(e.data);
        const status = data.status as JobStatus;

        setJobs((prev) =>
          prev.map((job) => {
            if (job.id !== id) return job;

            if (status === "RUNNING" && job.status !== "RUNNING") {
              return { ...job, status, runningStartedAt: Date.now() };
            }
            if (TERMINAL_STATUSES.includes(status) && job.runningStartedAt) {
              return {
                ...job,
                status,
                elapsedSeconds: (Date.now() - job.runningStartedAt) / 1000,
              };
            }
            return { ...job, status };
          }),
        );

        if (TERMINAL_STATUSES.includes(status)) {
          es.close();
          eventSourcesRef.current.delete(id);
        }
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold text-[#e3f2e6]">Live Demo</h3>
      <p className="text-sm text-[#c7d3cb]">
        Redis Queue 기반 비동기 Job 실행을 실시간으로 확인합니다. 버튼을 누르면
        Job이 생성되고, SSE로 상태 전이(PENDING → RUNNING → COMPLETED)가 실시간
        반영됩니다.
      </p>

      <Button size="sm" onClick={runJob} disabled={isSubmitting}>
        {isSubmitting ? "실행 중..." : "Job 실행"}
      </Button>

      {jobs.length > 0 && (
        <ul className="space-y-2">
          {jobs.map((job) => (
            <li key={job.id} className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[job.status]}`}
              >
                {STATUS_LABEL[job.status]}
              </span>

              <span className="text-xs text-[#9aa69c]">Job #{job.id}</span>

              {job.status === "RUNNING" && job.runningStartedAt && (
                <span className="text-xs text-[#9fd3a8]">
                  {formatElapsed((now - job.runningStartedAt) / 1000)}
                </span>
              )}

              {TERMINAL_STATUSES.includes(job.status) && job.elapsedSeconds > 0 && (
                <span className="text-xs text-[#9aa69c]">
                  {formatElapsed(job.elapsedSeconds)}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

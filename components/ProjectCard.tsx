// components/ProjectCard.tsx
"use client";

import { useEffect, useRef, useState } from "react"
import Card from "@/components/ui/Card";

type ProjectProps = {
  title: string;
  description: string;
  techBadges?: string[];
  icon?: boolean;
  demoVideo?: string;
  github?: string;
  readmeSummary?: string;
  website?: string;
  videoWidth?: number | string;
  videoHeight?: number | string;
};

/** "https://github.com/{owner}/{repo}" -> 해당 레포 기본 브랜치의 icon.png raw URL. */
function getRepoIconUrl(githubUrl?: string): string | null {
  if (!githubUrl) return null;
  const match = githubUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/#?]+)/);
  if (!match) return null;
  const [, owner, repo] = match;
  return `https://raw.githubusercontent.com/${owner}/${repo.replace(/\.git$/, "")}/HEAD/icon.png`;
}

function SmartMedia({ src, title, style }: any) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const isVideo = src.endsWith(".mp4") || src.endsWith(".webm")

  // poster 경로 자동 생성
  const baseName = src.replace(/\.(mp4|webm|webp)$/i, "")
const posterSrc = `/projects/thumbs/${baseName}.webp`
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: 0.3,
        rootMargin: "200px" // 미리 로딩
      }
    )

    if (videoRef.current) observer.observe(videoRef.current)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!videoRef.current || !isVideo) return

    if (isVisible) {
      videoRef.current.play().catch(() => {})
    } else {
      videoRef.current.pause()
    }
  }, [isVisible])

  // 이미지
  if (!isVideo) {
    return (
      <img
        src={`/projects/thumbs/${src}`}
        alt={`${title} demo`}
        loading="lazy"
        style={style}
        className="mt-7 rounded-xl border border-[#4f6f58]/40 mx-auto"
      />
    )
  }

  // 비디오
  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="none"
      poster={posterSrc}
      style={style}
      className="mt-4 rounded-xl border border-[#4f6f58]/40 mx-auto"
    >
      {isVisible && (
        <source src={`/projects/${src}`} type="video/mp4" />
      )}
    </video>
  )
}

export default function ProjectCard({
  title,
  description,
  techBadges,
  icon,
  demoVideo,
  github,
  readmeSummary,
  website,
  videoWidth,
  videoHeight,
}: ProjectProps) {

  const mediaStyle = {
    width: videoWidth ?? "100%",
    height: videoHeight ?? "auto",
  };

  const [iconLoaded, setIconLoaded] = useState(false);
  const [iconFailed, setIconFailed] = useState(false);
  const iconUrl = icon !== false ? getRepoIconUrl(github) : null;
  const iconRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // SSR 하이드레이션 전에 이미 끝나버린 load/error를 놓쳤을 경우를 보정한다:
    // 서버가 내려준 HTML에 <img src>가 이미 박혀 있어서, 브라우저가 React의
    // onLoad/onError가 붙기도 전에 작은 아이콘 로드를 끝내버릴 수 있다.
    const el = iconRef.current;
    if (el && el.complete) {
      if (el.naturalWidth > 0) setIconLoaded(true);
      else setIconFailed(true);
    }
  }, [iconUrl]);

  return (
    <Card className="space-y-4">

      {/* 아이콘 */}
      {iconUrl && !iconFailed && (
        <img
          ref={iconRef}
          src={iconUrl}
          alt={`${title} icon`}
          className={`h-14 w-14 object-contain ${iconLoaded ? "" : "hidden"}`}
          onLoad={() => setIconLoaded(true)}
          onError={() => setIconFailed(true)}
        />
      )}

      {/* 타이틀 */}
      <h3 className="text-lg font-semibold text-[#e3f2e6]">{title}</h3>

      {/* 설명 */}
      <p className="text-sm text-[#c7d3cb]">{description}</p>

      {/* README 요약 */}
      {readmeSummary && (
        <p className="rounded-md bg-[#151e18] p-3 text-xs text-[#d0ded4]">
          {readmeSummary}
        </p>
      )}

      {/* 기술 스택 뱃지 */}
      {techBadges && techBadges.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {techBadges.map((badge, i) => (
            <img
              key={i}
              src={badge}
              alt="tech badge"
              className="h-6 rounded-md"
            />
          ))}
        </div>
      )}

      {/* 데모 영상 또는 GIF */}
      {demoVideo && (
        <SmartMedia
          src={demoVideo}
          title={title}
          style={mediaStyle}
        />
      )}

      {/* 프로젝트 링크들 */}
      {(github || website) && (
        <div className="flex items-center gap-4 mt-4">

          {github && (
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#9fd3a8] underline-offset-2 hover:underline"
            >
              GitHub →
            </a>
          )}

          {website && (
            <a
              href={website}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#9fd3a8] underline-offset-2 hover:underline"
            >
              Website →
            </a>
          )}
        </div>
      )}
    </Card>
  );
}

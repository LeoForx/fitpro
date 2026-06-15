"use client";

import { useState, useRef } from "react";
import { useExerciseGif } from "@/hooks/useExerciseGif";
import ExerciseAnimation from "@/components/ExerciseAnimation";
import type { AnimacaoTipo } from "@/types";

interface ExerciseMediaProps {
  imageUrl?: string;
  animacaoUrl?: string;
  animacaoTipo?: AnimacaoTipo;
  thumbnailUrl?: string;
  alt?: string;
  className?: string;
  expanded?: boolean;
  /** Nome do exercício em PT — usado para buscar GIF automaticamente */
  exerciseName?: string;
  /** Grupo muscular — usado para animação local quando não há GIF */
  muscleGroup?: string;
}

function PlaceholderAnimation({ alt, loading }: { alt?: string; loading?: boolean }) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center"
      style={{ background: "#1e161e", borderRadius: 12 }}
      aria-label={alt}
    >
      {loading ? (
        <>
          {/* Skeleton pulse */}
          <div
            style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "rgba(47,254,29,0.07)",
              border: "2px solid rgba(47,254,29,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 4v16M18 4v16M6 8H4a1 1 0 00-1 1v6a1 1 0 001 1h2M18 8h2a1 1 0 011 1v6a1 1 0 01-1 1h-2M6 12h12"
                stroke="rgba(47,254,29,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xs mt-3" style={{ color: "rgba(47,254,29,0.4)" }}>
            Carregando animação...
          </span>
        </>
      ) : (
        <>
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            style={{ overflow: "visible" }}
          >
            <circle cx="60" cy="28" r="12" fill="none" stroke="#2ffe1d" strokeWidth="2.5" />
            <line x1="60" y1="40" x2="60" y2="72" stroke="#2ffe1d" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="60" y1="52" x2="38" y2="62" stroke="#2ffe1d" strokeWidth="2.5" strokeLinecap="round" style={{ transformOrigin: "60px 52px" }}>
              <animateTransform attributeName="transform" type="rotate" values="0 60 52;-20 60 52;0 60 52" dur="1.2s" repeatCount="indefinite" />
            </line>
            <line x1="60" y1="52" x2="82" y2="62" stroke="#2ffe1d" strokeWidth="2.5" strokeLinecap="round" style={{ transformOrigin: "60px 52px" }}>
              <animateTransform attributeName="transform" type="rotate" values="0 60 52;20 60 52;0 60 52" dur="1.2s" repeatCount="indefinite" />
            </line>
            <line x1="60" y1="72" x2="44" y2="96" stroke="#2ffe1d" strokeWidth="2.5" strokeLinecap="round" style={{ transformOrigin: "60px 72px" }}>
              <animateTransform attributeName="transform" type="rotate" values="0 60 72;15 60 72;0 60 72" dur="1.2s" repeatCount="indefinite" />
            </line>
            <line x1="60" y1="72" x2="76" y2="96" stroke="#2ffe1d" strokeWidth="2.5" strokeLinecap="round" style={{ transformOrigin: "60px 72px" }}>
              <animateTransform attributeName="transform" type="rotate" values="0 60 72;-15 60 72;0 60 72" dur="1.2s" repeatCount="indefinite" />
            </line>
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(47,254,29,0.08)" strokeWidth="1" />
          </svg>
          <span className="text-xs mt-3" style={{ color: "rgba(47,254,29,0.5)" }}>
            {alt ?? "Animação do exercício"}
          </span>
        </>
      )}
    </div>
  );
}

export default function ExerciseMedia({
  imageUrl,
  animacaoUrl,
  animacaoTipo = "gif",
  thumbnailUrl,
  alt = "Exercício",
  className = "",
  expanded = false,
  exerciseName,
  muscleGroup,
}: ExerciseMediaProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Busca GIF automaticamente pelo nome quando não há URL manual
  const shouldFetch = !animacaoUrl && !imageUrl && !!exerciseName;
  const { gifUrl, loading } = useExerciseGif(shouldFetch ? exerciseName : undefined);

  const resolvedUrl = animacaoUrl ?? gifUrl ?? undefined;
  const resolvedTipo: AnimacaoTipo = animacaoUrl ? animacaoTipo : "gif";
  const fallbackSrc = thumbnailUrl ?? imageUrl;

  const height = expanded ? "280px" : "200px";

  const renderMedia = () => {
    if (loading && !resolvedUrl) {
      return <ExerciseAnimation exerciseName={exerciseName} muscleGroup={muscleGroup} label={alt} />;
    }

    if (error || !resolvedUrl) {
      if (fallbackSrc) {
        return (
          <img
            src={fallbackSrc}
            alt={alt}
            className="w-full h-full object-contain"
            style={{ borderRadius: 12 }}
            onError={() => setError(true)}
          />
        );
      }
      return <ExerciseAnimation exerciseName={exerciseName} muscleGroup={muscleGroup} label={alt} />;
    }

    switch (resolvedTipo) {
      case "mp4":
        return (
          <>
            {!loaded && <div className="skeleton absolute inset-0" />}
            <video
              ref={videoRef}
              src={resolvedUrl}
              poster={fallbackSrc}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-contain"
              style={{ borderRadius: 12 }}
              onLoadedData={() => setLoaded(true)}
              onError={() => setError(true)}
            />
          </>
        );

      case "gif":
      default:
        return (
          <>
            {!loaded && <div className="skeleton absolute inset-0" />}
            <img
              src={resolvedUrl}
              alt={alt}
              className="w-full h-full object-contain"
              style={{ borderRadius: 12, opacity: loaded ? 1 : 0, transition: "opacity 0.3s" }}
              onLoad={() => setLoaded(true)}
              onError={() => setError(true)}
            />
          </>
        );
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        height,
        background: "#1e161e",
        borderRadius: 12,
        border: "1px solid rgba(47,254,29,0.1)",
        pointerEvents: "none",
      }}
    >
      {renderMedia()}
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import type { AnimacaoTipo } from "@/types";

interface ExerciseMediaProps {
  imageUrl?: string;
  animacaoUrl?: string;
  animacaoTipo?: AnimacaoTipo;
  thumbnailUrl?: string;
  alt?: string;
  className?: string;
  expanded?: boolean;
}

// Placeholder SVG animation for demo
function PlaceholderAnimation({ alt }: { alt?: string }) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center"
      style={{ background: "#1e161e", borderRadius: 12 }}
      aria-label={alt}
    >
      {/* Animated stick figure doing exercise */}
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        style={{ overflow: "visible" }}
      >
        {/* Body */}
        <circle cx="60" cy="28" r="12" fill="none" stroke="#2ffe1d" strokeWidth="2.5" />
        {/* Torso */}
        <line x1="60" y1="40" x2="60" y2="72" stroke="#2ffe1d" strokeWidth="2.5" strokeLinecap="round" />
        {/* Arms animated */}
        <line
          x1="60" y1="52" x2="38" y2="62"
          stroke="#2ffe1d" strokeWidth="2.5" strokeLinecap="round"
          style={{ transformOrigin: "60px 52px" }}
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 60 52;-20 60 52;0 60 52"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </line>
        <line
          x1="60" y1="52" x2="82" y2="62"
          stroke="#2ffe1d" strokeWidth="2.5" strokeLinecap="round"
          style={{ transformOrigin: "60px 52px" }}
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 60 52;20 60 52;0 60 52"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </line>
        {/* Legs */}
        <line
          x1="60" y1="72" x2="44" y2="96"
          stroke="#2ffe1d" strokeWidth="2.5" strokeLinecap="round"
          style={{ transformOrigin: "60px 72px" }}
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 60 72;15 60 72;0 60 72"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </line>
        <line
          x1="60" y1="72" x2="76" y2="96"
          stroke="#2ffe1d" strokeWidth="2.5" strokeLinecap="round"
          style={{ transformOrigin: "60px 72px" }}
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 60 72;-15 60 72;0 60 72"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </line>
        {/* Glow effect */}
        <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(47,254,29,0.08)" strokeWidth="1" />
      </svg>
      <span className="text-xs mt-3" style={{ color: "rgba(47,254,29,0.5)" }}>
        {alt ?? "Animação do exercício"}
      </span>
    </div>
  );
}

export default function ExerciseMedia({
  imageUrl,
  animacaoUrl,
  animacaoTipo = "lottie",
  thumbnailUrl,
  alt = "Exercício",
  className = "",
  expanded = false,
}: ExerciseMediaProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = true; // Always render — iOS Safari IntersectionObserver can silently fail

  const fallbackSrc = thumbnailUrl ?? imageUrl;

  const height = expanded ? "280px" : "200px";

  const renderMedia = () => {
    if (!inView) return <div className="skeleton w-full h-full" />;

    if (error || (!animacaoUrl && !imageUrl && !thumbnailUrl)) {
      return <PlaceholderAnimation alt={alt} />;
    }

    if (!animacaoUrl) {
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
      return <PlaceholderAnimation alt={alt} />;
    }

    switch (animacaoTipo) {
      case "mp4":
        return (
          <>
            {!loaded && <div className="skeleton absolute inset-0" />}
            <video
              ref={videoRef}
              src={animacaoUrl}
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
        return (
          <>
            {!loaded && <div className="skeleton absolute inset-0" />}
            <img
              src={animacaoUrl}
              alt={alt}
              className="w-full h-full object-contain"
              style={{ borderRadius: 12 }}
              onLoad={() => setLoaded(true)}
              onError={() => setError(true)}
            />
          </>
        );

      default:
        // lottie or sprite — show placeholder with note
        return <PlaceholderAnimation alt={alt} />;
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

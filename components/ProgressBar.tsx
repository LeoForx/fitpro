"use client";

import { useEffect, useRef, useState } from "react";

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  showPercent?: boolean;
  height?: number;
  completed?: boolean;
  animate?: boolean;
  color?: string;
}

export default function ProgressBar({
  value,
  label,
  showPercent = false,
  height = 6,
  completed = false,
  animate = true,
  color,
}: ProgressBarProps) {
  const [displayed, setDisplayed] = useState(animate ? 0 : value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!animate) {
      setDisplayed(value);
      return;
    }
    const duration = 500;
    const start = performance.now();
    const from = displayed;
    const to = Math.min(100, Math.max(0, value));

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;
      setDisplayed(from + (to - from) * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const pct = Math.min(100, Math.max(0, displayed));

  return (
    <div>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <span className="text-xs text-white/60 font-medium">{label}</span>
          )}
          {showPercent && (
            <span
              className="text-xs font-semibold"
              style={{ color: color ?? "#2ffe1d" }}
            >
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <div
        className="progress-bar"
        style={{ height }}
        role="progressbar"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`progress-bar-fill ${completed || value >= 100 ? "completed" : ""}`}
          style={{
            width: `${pct}%`,
            background: color
              ? color
              : "linear-gradient(90deg, #1dfe52, #2ffe1d)",
          }}
        />
      </div>
    </div>
  );
}

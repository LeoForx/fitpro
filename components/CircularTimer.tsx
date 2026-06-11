"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface CircularTimerProps {
  totalSeconds: number;
  onComplete?: () => void;
  size?: number;
  strokeWidth?: number;
  autoStart?: boolean;
  onAdjust?: (delta: number) => void;
}

function playBeep(frequency: number, duration: number, volume = 0.25) {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
    osc.onended = () => ctx.close();
  } catch {
    // AudioContext not available — ignore
  }
}

function playDone() {
  // Three rising tones: 523 → 659 → 784 Hz (C5-E5-G5)
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    [[523, 0], [659, 0.18], [784, 0.36]].forEach(([freq, delay]) => {
      const osc = ctx.createOscillator();
      osc.connect(gain);
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.35);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.35);
    });
    setTimeout(() => ctx.close(), 1000);
  } catch {
    // ignore
  }
}

export default function CircularTimer({
  totalSeconds,
  onComplete,
  size = 120,
  strokeWidth = 8,
  autoStart = true,
  onAdjust,
}: CircularTimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [running,   setRunning]   = useState(autoStart);
  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedRef = useRef(false);
  const beepedRef    = useRef<Set<number>>(new Set());

  const radius       = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress     = remaining / totalSeconds;
  const dashOffset   = circumference * (1 - progress);

  const start = useCallback(() => setRunning(true),  []);
  const pause = useCallback(() => setRunning(false), []);
  const reset = useCallback(() => {
    setRunning(false);
    setRemaining(totalSeconds);
    completedRef.current = false;
    beepedRef.current.clear();
  }, [totalSeconds]);

  useEffect(() => {
    setRemaining(totalSeconds);
    completedRef.current = false;
    beepedRef.current.clear();
  }, [totalSeconds]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;

        // Countdown beeps: 3, 2, 1
        if (next > 0 && next <= 3 && !beepedRef.current.has(next)) {
          beepedRef.current.add(next);
          playBeep(440, 0.08);
        }

        if (next <= 0) {
          clearInterval(intervalRef.current!);
          setRunning(false);
          if (!completedRef.current) {
            completedRef.current = true;
            playDone();
            if ("vibrate" in navigator) navigator.vibrate([100, 50, 100]);
            onComplete?.();
          }
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, onComplete]);

  const minutes     = Math.floor(remaining / 60);
  const seconds     = remaining % 60;
  const isAlmostDone = remaining <= 5 && remaining > 0;
  const isDone       = remaining === 0;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Adjust buttons */}
      {onAdjust && (
        <div className="flex gap-3">
          <button
            className="btn-press px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{ background: "#1a1a1a", color: "#ffffff70", border: "1px solid #2b2b2b" }}
            onClick={() => onAdjust(-15)}
          >
            −15s
          </button>
          <button
            className="btn-press px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{ background: "#1a1a1a", color: "#ffffff70", border: "1px solid #2b2b2b" }}
            onClick={() => onAdjust(+15)}
          >
            +15s
          </button>
        </div>
      )}

      <div
        className="relative"
        style={{
          width: size, height: size,
          animation: isAlmostDone ? "pulseGlow 0.6s ease-in-out infinite" : "none",
        }}
      >
        <svg
          width={size}
          height={size}
          style={{ transform: "rotate(-90deg)" }}
          aria-label={`Timer: ${minutes}:${seconds.toString().padStart(2, "0")}`}
        >
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#1a1a1a" strokeWidth={strokeWidth} />
          <circle
            cx={cx} cy={cy} r={radius}
            fill="none"
            stroke={isDone ? "#1a1a1a" : isAlmostDone ? "#ff4d4d" : "#2ffe1d"}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              transition: "stroke-dashoffset 0.9s linear, stroke 0.3s ease",
              filter: isDone ? "none" : `drop-shadow(0 0 ${isAlmostDone ? 10 : 6}px ${isAlmostDone ? "rgba(255,77,77,0.7)" : "rgba(47,254,29,0.5)"})`,
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ pointerEvents: "none" }}>
          <span
            className="font-bold tabular-nums"
            style={{
              fontSize: size * 0.22,
              color: isDone ? "#666" : isAlmostDone ? "#ff4d4d" : "#fff",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
          {isDone && <span className="text-xs mt-0.5" style={{ color: "#ffffff40" }}>concluído</span>}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {running ? (
          <button
            className="btn-press px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{ background: "#1e161e", color: "#fff", border: "1px solid rgba(47,254,29,0.2)" }}
            onClick={pause}
          >
            Pausar
          </button>
        ) : remaining > 0 ? (
          <button
            className="btn-press px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{ background: "#2ffe1d", color: "#000" }}
            onClick={start}
          >
            {remaining === totalSeconds ? "Iniciar" : "Retomar"}
          </button>
        ) : null}
        {remaining < totalSeconds && (
          <button
            className="btn-press px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{ background: "#1a1a1a", color: "#ffffff60", border: "1px solid #2b2b2b" }}
            onClick={reset}
          >
            Resetar
          </button>
        )}
      </div>
    </div>
  );
}

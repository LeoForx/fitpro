"use client";

import Link from "next/link";
import { useAppStore, getLevelInfo, LEVEL_THRESHOLDS } from "@/store/useAppStore";

export default function XpCard() {
  const { xp, progressoSemanal, metaSemanal } = useAppStore();
  const level = getLevelInfo(xp);
  const nextLevel = LEVEL_THRESHOLDS.find((l) => l.min > xp);

  const xpInLevel = xp - level.min;
  const xpNeeded  = nextLevel ? nextLevel.min - level.min : 1;
  const pct       = nextLevel ? Math.min(100, Math.round((xpInLevel / xpNeeded) * 100)) : 100;

  const challengeDone = progressoSemanal >= metaSemanal;

  return (
    <div
      className="card p-4 mb-5"
      style={{ border: `1px solid ${level.color}22`, background: `linear-gradient(135deg, #1e161e 0%, #0a0a0a 100%)` }}
    >
      {/* Level row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm"
            style={{ background: `${level.color}18`, border: `1.5px solid ${level.color}55`, color: level.color }}
          >
            {level.level}
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: level.color }}>{level.name}</p>
            <p className="text-xs" style={{ color: "#ffffff40" }}>{xp} XP total</p>
          </div>
        </div>
        <Link
          href="/historico"
          className="btn-press flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.05)", color: "#ffffff60", border: "1px solid #2b2b2b", textDecoration: "none" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7 16l4-4 4 4 4-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Histórico
        </Link>
      </div>

      {/* XP bar */}
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-xs" style={{ color: "#ffffff40" }}>Progresso para {nextLevel?.name ?? "Máximo"}</span>
          <span className="text-xs font-semibold" style={{ color: level.color }}>{pct}%</span>
        </div>
        <div style={{ height: 6, background: "#1a1a1a", borderRadius: 999, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${level.color}99, ${level.color})`,
            borderRadius: 999,
            transition: "width 0.8s cubic-bezier(.22,.9,.4,1)",
            boxShadow: `0 0 8px ${level.color}55`,
          }} />
        </div>
        {nextLevel && (
          <p className="text-xs mt-1" style={{ color: "#ffffff30" }}>
            {nextLevel.min - xp} XP para {nextLevel.name}
          </p>
        )}
      </div>

      {/* Weekly challenge */}
      <div
        className="flex items-center justify-between p-3 rounded-xl"
        style={{ background: challengeDone ? "rgba(47,254,29,0.06)" : "#1a1a1a", border: `1px solid ${challengeDone ? "rgba(47,254,29,0.2)" : "#2b2b2b"}` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{challengeDone ? "✅" : "🎯"}</span>
          <div>
            <p className="text-xs font-semibold" style={{ color: challengeDone ? "#2ffe1d" : "#fff" }}>
              Desafio da semana
            </p>
            <p className="text-xs" style={{ color: "#ffffff40" }}>
              {progressoSemanal}/{metaSemanal} treinos — {challengeDone ? "Concluído! +100 XP" : `${metaSemanal - progressoSemanal} restante${metaSemanal - progressoSemanal !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
          style={{ background: challengeDone ? "rgba(47,254,29,0.15)" : "#222", color: challengeDone ? "#2ffe1d" : "#ffffff40", border: `1px solid ${challengeDone ? "rgba(47,254,29,0.3)" : "#2b2b2b"}` }}
        >
          {progressoSemanal}/{metaSemanal}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useAppStore } from "@/store/useAppStore";
import type { AppModule } from "@/types";

interface BadgeStats {
  treinosCompletos: number;
  streak: number;
  progressoSemanal: number;
  metaSemanal: number;
  modules: AppModule[];
}

interface BadgeDef {
  id: string;
  nome: string;
  desc: string;
  color: string;
  icon: React.ReactNode;
  unlocked: (s: BadgeStats) => boolean;
}

const BADGES: BadgeDef[] = [
  {
    id: "first_workout",
    nome: "Primeira Suada",
    desc: "Completar 1 treino",
    color: "#2ffe1d",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M6 4v16M18 4v16M6 8H4a1 1 0 00-1 1v6a1 1 0 001 1h2M18 8h2a1 1 0 011 1v6a1 1 0 01-1 1h-2M6 12h12"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    unlocked: (s) => s.treinosCompletos >= 1,
  },
  {
    id: "routine",
    nome: "Na Rotina",
    desc: "5 treinos completos",
    color: "#2ffe1d",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 14l2.5 2.5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    unlocked: (s) => s.treinosCompletos >= 5,
  },
  {
    id: "dedicated",
    nome: "Dedicado",
    desc: "10 treinos completos",
    color: "#2ffe1d",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    ),
    unlocked: (s) => s.treinosCompletos >= 10,
  },
  {
    id: "athlete",
    nome: "Atleta",
    desc: "25 treinos completos",
    color: "#facc15",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M8 21h8M12 17v4M7 4h10l-1 9H8L7 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 4H5l1 6M17 4h2l-1 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    unlocked: (s) => s.treinosCompletos >= 25,
  },
  {
    id: "legend",
    nome: "Lenda",
    desc: "50 treinos completos",
    color: "#a78bfa",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"
          stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    ),
    unlocked: (s) => s.treinosCompletos >= 50,
  },
  {
    id: "consistent",
    nome: "Consistente",
    desc: "Streak de 3 dias",
    color: "#fb923c",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M13 2C13 2 10 6 10 9.5c0 1.5.6 2.8 1.5 3.8C10.5 12 9 10.5 9 8 6 10 5 14 8 17c1.3 1.5 3 2.5 5 2.5s3.7-1 5-2.5c3-3 2-7.5-1-9-.2 2.5-1.5 4-3 5C16 10.5 13 2 13 2z"
          stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
    unlocked: (s) => s.streak >= 3,
  },
  {
    id: "week_fire",
    nome: "Semana de Fogo",
    desc: "Streak de 7 dias",
    color: "#fb923c",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C9 6 8 9 9 12c-2-1-3-3-3-5C3 10 2 15 6 18c1.5 2 3.5 3 6 3s4.5-1 6-3c4-3 3-8 0-10-.5 3-2 5-4 6 2-4 0-12-2-12z"
          stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M12 22v-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0"/>
      </svg>
    ),
    unlocked: (s) => s.streak >= 7,
  },
  {
    id: "unstoppable",
    nome: "Imparável",
    desc: "Streak de 14 dias",
    color: "#f43f5e",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    unlocked: (s) => s.streak >= 14,
  },
  {
    id: "goal_hit",
    nome: "Meta Batida",
    desc: "Bater a meta semanal",
    color: "#60a5fa",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
      </svg>
    ),
    unlocked: (s) => s.progressoSemanal >= s.metaSemanal,
  },
  {
    id: "module_complete",
    nome: "Estudioso",
    desc: "Completar um módulo",
    color: "#34d399",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    unlocked: (s) => s.modules.some((m) => m.aulas.length > 0 && m.aulas.every((a) => a.concluida)),
  },
  {
    id: "all_modules",
    nome: "Mestre",
    desc: "Completar todos os módulos",
    color: "#f59e0b",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    unlocked: (s) => s.modules.length > 0 && s.modules.every((m) => m.aulas.every((a) => a.concluida)),
  },
];

export default function BadgeSection() {
  const { treinosCompletos, streak, progressoSemanal, metaSemanal, modules } = useAppStore();
  const stats: BadgeStats = { treinosCompletos, streak, progressoSemanal, metaSemanal, modules };

  const earned = BADGES.filter((b) => b.unlocked(stats)).length;

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-base">Conquistas</h2>
        <span className="text-xs font-semibold" style={{ color: "#2ffe1d" }}>
          {earned}/{BADGES.length} badges
        </span>
      </div>

      <div
        className="flex gap-3 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        {BADGES.map((badge) => {
          const isUnlocked = badge.unlocked(stats);
          return (
            <div
              key={badge.id}
              className="flex-shrink-0 flex flex-col items-center gap-2"
              style={{ width: 72 }}
            >
              {/* Icon circle */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: isUnlocked ? `rgba(${hexToRgb(badge.color)}, 0.12)` : "#1a1a1a",
                  border: `1.5px solid ${isUnlocked ? badge.color + "60" : "#2b2b2b"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isUnlocked ? badge.color : "#444",
                  boxShadow: isUnlocked ? `0 0 12px ${badge.color}25` : "none",
                  position: "relative",
                  transition: "all 0.3s ease",
                }}
              >
                {badge.icon}
                {!isUnlocked && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.55)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="11" width="18" height="11" rx="2" stroke="#555" strokeWidth="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4" stroke="#555" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Label */}
              <p
                className="text-center font-semibold"
                style={{
                  fontSize: 10,
                  lineHeight: 1.3,
                  color: isUnlocked ? "#fff" : "#444",
                  maxWidth: 72,
                }}
              >
                {badge.nome}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

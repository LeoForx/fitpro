"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore, getLevelInfo, LEVEL_THRESHOLDS } from "@/store/useAppStore";
import PageWrapper from "@/components/PageWrapper";
import type { WorkoutHistoryEntry } from "@/types";

function getWeekLabel(weeksAgo: number): string {
  if (weeksAgo === 0) return "Esta";
  if (weeksAgo === 1) return "Ant.";
  const d = new Date();
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7) - weeksAgo * 7);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

function getWeeklyData(history: WorkoutHistoryEntry[], numWeeks = 8) {
  const now = new Date();
  return Array.from({ length: numWeeks }, (_, i) => {
    const weeksAgo = numWeeks - 1 - i;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7) - weeksAgo * 7);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    const count = history.filter((e) => e.date >= weekStart.getTime() && e.date < weekEnd.getTime()).length;
    return { label: getWeekLabel(weeksAgo), count, isCurrent: weeksAgo === 0 };
  });
}

function WorkoutBarChart({ history }: { history: WorkoutHistoryEntry[] }) {
  const weeks = getWeeklyData(history);
  const maxCount = Math.max(...weeks.map((w) => w.count), 1);
  const chartH = 100;
  const barW = 28;
  const gap = 8;
  const totalW = weeks.length * (barW + gap) - gap;

  return (
    <div style={{ overflowX: "auto", paddingBottom: 4 }}>
      <svg width={totalW} height={chartH + 28} style={{ display: "block" }}>
        {weeks.map((week, i) => {
          const barH = Math.max(4, Math.round((week.count / maxCount) * chartH));
          const x = i * (barW + gap);
          const y = chartH - barH;
          const color = week.isCurrent ? "#2ffe1d" : "#2b2b2b";
          const textColor = week.isCurrent ? "#2ffe1d" : "#ffffff40";

          return (
            <g key={i}>
              {/* Background bar */}
              <rect x={x} y={0} width={barW} height={chartH} rx={6} fill="#1a1a1a" />
              {/* Value bar */}
              <rect x={x} y={y} width={barW} height={barH} rx={6} fill={color}
                style={{ filter: week.isCurrent ? "drop-shadow(0 0 6px rgba(47,254,29,0.4))" : "none" }}
              />
              {/* Count label */}
              {week.count > 0 && (
                <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize={10} fontWeight="700" fill={textColor}>
                  {week.count}
                </text>
              )}
              {/* Week label */}
              <text x={x + barW / 2} y={chartH + 18} textAnchor="middle" fontSize={9} fill={textColor} fontWeight={week.isCurrent ? "700" : "400"}>
                {week.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function StatBox({ label, value, sub, color = "#fff" }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="card p-4 flex flex-col items-center justify-center gap-1 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#ffffff40", letterSpacing: "0.08em" }}>{label}</p>
      <p className="text-2xl font-black" style={{ color }}>{value}</p>
      {sub && <p className="text-xs" style={{ color: "#ffffff40" }}>{sub}</p>}
    </div>
  );
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "2-digit" });
}

export default function HistoricoPage() {
  const router = useRouter();
  const { workoutHistory, xp, streak, treinosCompletos, modules } = useAppStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const level = getLevelInfo(xp);
  const nextLevel = LEVEL_THRESHOLDS.find((l) => l.min > xp);
  const xpInLevel = xp - level.min;
  const xpNeeded  = nextLevel ? nextLevel.min - level.min : 1;
  const pct       = nextLevel ? Math.min(100, Math.round((xpInLevel / xpNeeded) * 100)) : 100;

  const totalMinutes = workoutHistory.reduce((s, e) => s + e.durationMin, 0);
  const totalCal     = workoutHistory.reduce((s, e) => s + e.calories, 0);
  const modulesCompletos = modules.filter((m) => m.aulas.every((a) => a.concluida)).length;

  return (
    <PageWrapper>
      <div className="px-4 pt-6 pb-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            className="btn-press w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "#1e161e", border: "1px solid #2b2b2b" }}
            onClick={() => router.back()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="#ffffff80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold">Histórico</h1>
            <p className="text-xs" style={{ color: "#ffffff40" }}>Sua evolução ao longo do tempo</p>
          </div>
        </div>

        {/* Level card */}
        <div
          className="card p-4 mb-5"
          style={{ border: `1px solid ${level.color}33`, background: "linear-gradient(135deg, #1e161e 0%, #0a0a0a 100%)" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg"
              style={{ background: `${level.color}18`, border: `2px solid ${level.color}55`, color: level.color }}
            >
              {level.level}
            </div>
            <div>
              <p className="font-black text-lg" style={{ color: level.color }}>{level.name}</p>
              <p className="text-sm" style={{ color: "#ffffff50" }}>{xp} XP acumulados</p>
            </div>
          </div>
          <div style={{ height: 8, background: "#1a1a1a", borderRadius: 999, overflow: "hidden", marginBottom: 6 }}>
            <div style={{
              height: "100%", width: `${pct}%`,
              background: `linear-gradient(90deg, ${level.color}88, ${level.color})`,
              borderRadius: 999,
              boxShadow: `0 0 10px ${level.color}55`,
              transition: "width 1s cubic-bezier(.22,.9,.4,1)",
            }} />
          </div>
          {nextLevel ? (
            <p className="text-xs" style={{ color: "#ffffff30" }}>
              {nextLevel.min - xp} XP para {nextLevel.name}
            </p>
          ) : (
            <p className="text-xs" style={{ color: level.color }}>Nível máximo atingido!</p>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <StatBox label="Treinos" value={treinosCompletos} sub="completos" color="#2ffe1d" />
          <StatBox label="Streak" value={streak} sub="dias seguidos" color="#fb923c" />
          <StatBox label="Tempo total" value={totalMinutes >= 60 ? `${Math.floor(totalMinutes / 60)}h${totalMinutes % 60 > 0 ? `${totalMinutes % 60}m` : ""}` : `${totalMinutes}m`} sub="de treino" color="#60a5fa" />
          <StatBox label="Calorias" value={totalCal > 0 ? `~${totalCal.toLocaleString("pt-BR")}` : "—"} sub="kcal queimadas" color="#f87171" />
        </div>

        {/* XP breakdown */}
        <div className="card p-4 mb-5">
          <h2 className="font-bold text-sm mb-3">Como você ganhou XP</h2>
          {[
            { label: "Treinos completos", value: workoutHistory.length * 50, desc: `${workoutHistory.length} × 50 XP` },
            { label: "Aulas do método", value: modules.reduce((s, m) => s + m.aulas.filter(a => a.concluida).length, 0) * 10, desc: `${modules.reduce((s, m) => s + m.aulas.filter(a => a.concluida).length, 0)} × 10 XP` },
            { label: "Bônus de streak", value: Math.min(streak * 5, 100), desc: `${streak} dias × 5 XP (máx. 100)` },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid #1e1e1e" }}>
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs" style={{ color: "#ffffff40" }}>{item.desc}</p>
              </div>
              <span className="font-bold text-sm" style={{ color: "#2ffe1d" }}>{item.value} XP</span>
            </div>
          ))}
          <div className="flex justify-between pt-2">
            <span className="font-bold text-sm">Total</span>
            <span className="font-black" style={{ color: "#2ffe1d" }}>{xp} XP</span>
          </div>
        </div>

        {/* Weekly chart */}
        <div className="card p-4 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm">Treinos por semana</h2>
            <span className="text-xs" style={{ color: "#ffffff40" }}>últimas 8 semanas</span>
          </div>
          {mounted && workoutHistory.length > 0 ? (
            <WorkoutBarChart history={workoutHistory} />
          ) : (
            <p className="text-xs text-center py-6" style={{ color: "#ffffff30" }}>Nenhum treino registrado ainda</p>
          )}
        </div>

        {/* Recent workouts */}
        {mounted && workoutHistory.length > 0 && (
          <div className="card p-4">
            <h2 className="font-bold text-sm mb-3">Últimos treinos</h2>
            <div className="flex flex-col gap-2">
              {workoutHistory.slice(0, 10).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid #1a1a1a" }}>
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-sm font-semibold truncate">{entry.workoutNome}</p>
                    <p className="text-xs" style={{ color: "#ffffff40" }}>
                      {entry.totalExercicios} exercícios · {entry.durationMin} min
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-semibold" style={{ color: "#2ffe1d" }}>~{entry.calories} kcal</p>
                    <p className="text-xs" style={{ color: "#ffffff40" }}>{formatDate(entry.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

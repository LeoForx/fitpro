"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import PageWrapper from "@/components/PageWrapper";
import BadgeSection from "@/components/BadgeSection";
import NotificationSettings, { scheduleReminder } from "@/components/NotificationSettings";
import ProfileSheet from "@/components/ProfileSheet";
import XpCard from "@/components/XpCard";
import { useAppStore } from "@/store/useAppStore";


function GaugeCircular({ value, max }: { value: number; max: number }) {
  const pct = value / max;
  const size = 96;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setDisplayed(pct), 200);
    return () => clearTimeout(t);
  }, [pct]);

  const dash = circumference * displayed;
  const gap = circumference - dash;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1a1a1a" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#2ffe1d" strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${gap}`}
          style={{ transition: "stroke-dasharray 0.8s cubic-bezier(.22,.9,.4,1)", filter: "drop-shadow(0 0 6px rgba(47,254,29,0.5))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold" style={{ color: "#2ffe1d" }}>{value}</span>
        <span className="text-xs" style={{ color: "#ffffff60" }}>/{max}</span>
      </div>
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function HomePage() {
  const router = useRouter();
  const { streak, metaSemanal, progressoSemanal, treinosCompletos, userProfile, workoutHistory, modules, toggleAula } = useAppStore();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const lastWorkout = workoutHistory[0] ?? null;
  const [checked, setChecked] = useState(false);
  const [showNotifSettings, setShowNotifSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("fitpro_onboarded")) {
      router.replace("/onboarding");
    } else {
      setChecked(true);
      // Re-schedule any existing reminder on app open
      const raw = localStorage.getItem("fitpro_reminder");
      if (raw) {
        try { scheduleReminder(JSON.parse(raw)); } catch { /* ignore */ }
      }
    }
  }, [router]);

  if (!checked) return null;

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
  const nome = userProfile?.nome ?? "";
  const iniciais = nome
    ? nome.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "FP";

  return (
    <>
    <PageWrapper>
    <motion.div className="px-4 pt-6 pb-4" variants={containerVariants} initial="visible" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm" style={{ color: "#ffffff60" }}>{saudacao}{nome ? `, ${nome}` : " 👋"}</p>
          <h1 className="text-2xl font-bold mt-0.5">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn-press w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "#1e161e", border: "1px solid rgba(47,254,29,0.15)" }}
            onClick={() => setShowNotifSettings(true)}
            aria-label="Lembretes"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#ffffff80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            className="btn-press w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
            style={{ background: "rgba(47,254,29,0.12)", color: "#2ffe1d", border: "1.5px solid rgba(47,254,29,0.3)" }}
            onClick={() => setShowProfile(true)}
            aria-label="Editar perfil"
          >
            {iniciais}
          </button>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-6">
        <div className="card flex flex-col items-center justify-center p-3 gap-2">
          <GaugeCircular value={progressoSemanal} max={metaSemanal} />
          <span className="text-xs font-medium" style={{ color: "#ffffff80" }}>Meta sem.</span>
        </div>
        <div className="card flex flex-col items-center justify-center p-3 gap-1">
          <div className="text-2xl">🔥</div>
          <span className="text-xl font-bold" style={{ color: "#2ffe1d" }}>{streak}</span>
          <span className="text-xs" style={{ color: "#ffffff60" }}>dias streak</span>
        </div>
        <div className="card flex flex-col items-center justify-center p-3 gap-1">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M6 4v16M18 4v16M6 8H4a1 1 0 00-1 1v6a1 1 0 001 1h2M18 8h2a1 1 0 011 1v6a1 1 0 01-1 1h-2M6 12h12" stroke="#2ffe1d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-xl font-bold">{treinosCompletos}</span>
          <span className="text-xs" style={{ color: "#ffffff60" }}>treinos</span>
        </div>
      </motion.div>

      {/* XP & Level */}
      <motion.div variants={itemVariants}>
        <XpCard />
      </motion.div>

      {/* Progresso semanal */}
      <motion.div variants={itemVariants} className="card p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-sm">Progresso Semanal</span>
          <span className="text-xs" style={{ color: "#2ffe1d" }}>{progressoSemanal}/{metaSemanal} dias</span>
        </div>
        <ProgressBar value={(progressoSemanal / metaSemanal) * 100} showPercent />
        <div className="flex justify-between mt-3">
          {(() => {
            // Days of week: Seg=1, Ter=2, Qua=3, Qui=4, Sex=5, Sáb=6, Dom=0 (JS)
            const JS_DAY = [1, 2, 3, 4, 5, 6, 0];
            const now = new Date();
            const dow = now.getDay();
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - ((dow + 6) % 7));
            startOfWeek.setHours(0, 0, 0, 0);
            const workedDays = new Set(
              workoutHistory
                .filter((e) => e.date >= startOfWeek.getTime())
                .map((e) => new Date(e.date).getDay())
            );
            return ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((dia, i) => {
              const done = workedDays.has(JS_DAY[i]);
              return (
                <div key={dia} className="flex flex-col items-center gap-1">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{
                      background: done ? "rgba(47,254,29,0.15)" : "#1a1a1a",
                      border: done ? "1.5px solid rgba(47,254,29,0.5)" : "1.5px solid #2b2b2b",
                    }}
                  >
                    {done && (
                      <svg width="10" height="10" viewBox="0 0 10 10">
                        <path d="M2 5l2.5 2.5 3.5-4" stroke="#2ffe1d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-[9px]" style={{ color: done ? "#2ffe1d" : "#666" }}>{dia}</span>
                </div>
              );
            });
          })()}
        </div>
      </motion.div>

      {/* Treino de hoje */}
      <motion.div variants={itemVariants} className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base">
            {lastWorkout ? "Último treino" : "Começar treino"}
          </h2>
          <Link href="/treino" className="text-xs font-semibold" style={{ color: "#2ffe1d" }}>Ver todos</Link>
        </div>
        <Link href="/treino">
          <div
            className="card p-4 flex items-center gap-4 btn-press"
            style={{ background: "linear-gradient(135deg, #1e161e 0%, #0d1a0d 100%)" }}
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(47,254,29,0.1)", border: "1px solid rgba(47,254,29,0.2)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M6 4v16M18 4v16M6 8H4a1 1 0 00-1 1v6a1 1 0 001 1h2M18 8h2a1 1 0 011 1v6a1 1 0 01-1 1h-2M6 12h12" stroke="#2ffe1d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              {lastWorkout ? (
                <>
                  <p className="font-bold text-sm truncate">{lastWorkout.workoutNome}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#ffffff60" }}>
                    {lastWorkout.totalExercicios} exercícios · {lastWorkout.durationMin} min · ~{lastWorkout.calories} kcal
                  </p>
                  <p className="text-xs mt-1 font-semibold" style={{ color: "#2ffe1d" }}>
                    {new Date(lastWorkout.date).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "short" })}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-bold text-sm">Nenhum treino ainda</p>
                  <p className="text-xs mt-0.5" style={{ color: "#ffffff60" }}>Toque para escolher seu primeiro treino</p>
                  <p className="text-xs mt-1 font-semibold" style={{ color: "#2ffe1d" }}>Vamos começar! 💪</p>
                </>
              )}
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#2ffe1d" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Conquistas */}
      <motion.div variants={itemVariants}>
        <BadgeSection />
      </motion.div>

      {/* Módulos */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base">Método</h2>
          <span className="text-xs font-semibold" style={{ color: "#2ffe1d" }}>
            {modules.filter((m) => m.aulas.every((a) => a.concluida)).length}/{modules.length} módulos
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {modules.map((mod, idx) => {
            const total = mod.aulas.length;
            const done = mod.aulas.filter((a) => a.concluida).length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            const concluido = done === total;
            const isExpanded = expandedModule === mod.id;

            return (
              <motion.div key={mod.id} variants={itemVariants} className={`card p-4 ${concluido ? "glow-completed" : ""}`}>
                {/* Header */}
                <button
                  className="w-full btn-press"
                  style={{ background: "none", border: "none", padding: 0, textAlign: "left" }}
                  onClick={() => setExpandedModule(isExpanded ? null : mod.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background: concluido ? "rgba(47,254,29,0.15)" : "#1a1a1a",
                          color: concluido ? "#2ffe1d" : "#ffffff60",
                          border: concluido ? "1.5px solid rgba(47,254,29,0.4)" : "1.5px solid #2b2b2b",
                        }}
                      >
                        {concluido ? "✓" : idx + 1}
                      </div>
                      <span className="font-semibold text-sm">{mod.nome}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {concluido && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: "rgba(47,254,29,0.1)", color: "#2ffe1d", border: "1px solid rgba(47,254,29,0.3)" }}
                        >
                          Badge ✦
                        </span>
                      )}
                      <svg
                        width="14" height="14" viewBox="0 0 24 24" fill="none"
                        style={{ color: "#ffffff40", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s" }}
                      >
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <ProgressBar value={pct} showPercent completed={concluido} height={5} />
                  <p className="text-xs mt-1.5" style={{ color: "#ffffff50" }}>
                    {done}/{total} aulas
                  </p>
                </button>

                {/* Aulas list */}
                {isExpanded && (
                  <div className="mt-3 flex flex-col gap-1" style={{ borderTop: "1px solid #1e1e1e", paddingTop: 12 }}>
                    {mod.aulas.map((aula) => (
                      <button
                        key={aula.id}
                        className="btn-press w-full flex items-center gap-3"
                        style={{ background: "none", border: "none", padding: "6px 0", textAlign: "left" }}
                        onClick={() => toggleAula(mod.id, aula.id)}
                      >
                        <div
                          className="flex-shrink-0 flex items-center justify-center"
                          style={{
                            width: 20, height: 20, borderRadius: 6,
                            background: aula.concluida ? "rgba(47,254,29,0.15)" : "#1a1a1a",
                            border: `1.5px solid ${aula.concluida ? "rgba(47,254,29,0.5)" : "#2b2b2b"}`,
                            transition: "all 0.18s",
                          }}
                        >
                          {aula.concluida && (
                            <svg width="10" height="10" viewBox="0 0 10 10">
                              <path d="M2 5l2.5 2.5 3.5-4" stroke="#2ffe1d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate" style={{ color: aula.concluida ? "#ffffff60" : "#fff", textDecoration: aula.concluida ? "line-through" : "none" }}>
                            {aula.titulo}
                          </p>
                        </div>
                        <span className="text-xs flex-shrink-0" style={{ color: "#ffffff30" }}>{aula.duracao}</span>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
    </PageWrapper>

    <NotificationSettings
      open={showNotifSettings}
      onClose={() => setShowNotifSettings(false)}
    />
    <ProfileSheet
      open={showProfile}
      onClose={() => setShowProfile(false)}
    />
    </>
  );
}

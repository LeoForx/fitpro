"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ExerciseMedia from "@/components/ExerciseMedia";
import CircularTimer from "@/components/CircularTimer";
import AnimatedCheck from "@/components/AnimatedCheck";
import ProgressBar from "@/components/ProgressBar";
import { useAppStore, getLevelInfo, LEVEL_THRESHOLDS } from "@/store/useAppStore";
import type { Exercise } from "@/types";

// ——— Confetti ———
const COLORS = ["#2ffe1d", "#facc15", "#60a5fa", "#fb923c", "#f0abfc", "#ffffff", "#f43f5e"];
const PIECES = Array.from({ length: 40 }, (_, i) => ({
  l: (i * 2.5 + Math.sin(i) * 8 + 100) % 100,
  s: 6 + (i % 5),
  d: (i * 0.08) % 1.8,
  dur: 2.5 + (i % 6) * 0.15,
  c: COLORS[i % COLORS.length],
  r: i % 2 === 0 ? "50%" : i % 3 === 0 ? "3px" : "2px",
}));

function Confetti() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {PIECES.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: -12,
            left: `${p.l}%`,
            width: p.s,
            height: p.s,
            borderRadius: p.r,
            background: p.c,
            animation: `confettiFall ${p.dur}s ${p.d}s ease-in forwards`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

const BADGE_MILESTONES: Record<number, string> = {
  1: "Primeira Suada",
  5: "Na Rotina",
  10: "Dedicado",
  25: "Atleta",
  50: "Lenda",
};

const DEFAULT_WORKOUT = {
  id: "a",
  nome: "Treino A — Peito & Tríceps",
  exercicios: [
    { id: "e1", nome: "Supino Reto", grupo_muscular: "Peito", descricao_curta: "Exercício composto para desenvolvimento do peitoral. Mantenha os cotovelos em 45°.", series: 4, reps: "8-12", descanso_segundos: 90 },
    { id: "e2", nome: "Crucifixo", grupo_muscular: "Peito", descricao_curta: "Isolamento do peitoral. Movimento em arco, cuidado com a amplitude.", series: 3, reps: "10-15", descanso_segundos: 60 },
    { id: "e3", nome: "Supino Inclinado", grupo_muscular: "Peito", descricao_curta: "Ênfase na parte superior do peitoral. Banco a 30-45°.", series: 3, reps: "8-12", descanso_segundos: 90 },
    { id: "e4", nome: "Tríceps Pulley", grupo_muscular: "Tríceps", descricao_curta: "Extensão do cotovelo na polia. Cotovelo fixo ao lado do tronco.", series: 3, reps: "12-15", descanso_segundos: 60 },
    { id: "e5", nome: "Tríceps Francês", grupo_muscular: "Tríceps", descricao_curta: "Extensão do tríceps acima da cabeça com halteres.", series: 3, reps: "10-12", descanso_segundos: 60 },
    { id: "e6", nome: "Fundos", grupo_muscular: "Tríceps", descricao_curta: "Mergulho nas paralelas. Mantenha o tronco ereto para foco no tríceps.", series: 3, reps: "max", descanso_segundos: 90 },
  ] as Exercise[],
};

type Phase = "exercise" | "rest";

export default function ExecucaoPage() {
  const router = useRouter();
  const {
    currentWorkout, currentExerciseIndex, series,
    workoutStartedAt, treinosCompletos, xp, streak, modules,
    setCurrentWorkout, setCurrentExerciseIndex,
    concluirSerie, addWorkoutHistory,
  } = useAppStore();
  const prevXpRef = useRef(xp);

  const workout = currentWorkout ?? DEFAULT_WORKOUT;
  const exercicios = workout.exercicios;
  const exercise = exercicios[currentExerciseIndex];
  const totalExercicios = exercicios.length;
  const workoutProgress = (currentExerciseIndex / totalExercicios) * 100;

  const [phase, setPhase] = useState<Phase>("exercise");
  const [currentSerie, setCurrentSerie] = useState(1);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [restSeconds, setRestSeconds] = useState<number | null>(null);

  const handleRestAdjust = (delta: number) =>
    setRestSeconds((prev) => Math.max(5, (prev ?? exercise.descanso_segundos ?? 60) + delta));

  const seriesKey = `${exercise.id}-${currentSerie}`;
  const seriesConcluidas = series.filter((s) => s.exerciseId === exercise.id).length;

  useEffect(() => {
    if (!currentWorkout) setCurrentWorkout(DEFAULT_WORKOUT);
  }, [currentWorkout, setCurrentWorkout]);

  const handleConcluirSerie = () => {
    concluirSerie(exercise.id, currentSerie);
    setLastChecked(seriesKey);
    const totalSeries = exercise.series ?? 3;
    if (currentSerie < totalSeries) {
      setTimeout(() => { setCurrentSerie((s) => s + 1); setPhase("rest"); }, 600);
    } else {
      setTimeout(() => {
        if (currentExerciseIndex < totalExercicios - 1) {
          setCurrentExerciseIndex(currentExerciseIndex + 1);
          setCurrentSerie(1);
          setPhase("exercise");
          setLastChecked(null);
        } else {
          const durMin = workoutStartedAt
            ? Math.max(Math.round((Date.now() - workoutStartedAt) / 60000), 1)
            : series.length * 2;
          prevXpRef.current = xp;
          addWorkoutHistory({
            id: `h_${Date.now()}`,
            workoutId: workout.id,
            workoutNome: workout.nome,
            date: Date.now(),
            durationMin: durMin,
            totalExercicios: totalExercicios,
            totalSeries: series.length + 1,
            calories: Math.max(Math.round(durMin * 6), 100),
          });
          setShowCelebration(true);
        }
      }, 800);
    }
  };

  const handleSkip = () => {
    if (currentExerciseIndex < totalExercicios - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSerie(1);
      setPhase("exercise");
      setLastChecked(null);
    }
  };

  // Celebration screen — shown only after workout finishes
  if (showCelebration) {
    const durationMin = workoutStartedAt
      ? Math.max(Math.round((Date.now() - workoutStartedAt) / 60000), 1)
      : series.length * 2;
    const calories = Math.max(Math.round(durationMin * 6), 100);
    const newBadgeName = BADGE_MILESTONES[treinosCompletos] ?? null;

    const xpGanho = xp - prevXpRef.current;
    const level = getLevelInfo(xp);
    const prevLevel = getLevelInfo(prevXpRef.current);
    const leveledUp = level.level > prevLevel.level;
    const nextLevel = LEVEL_THRESHOLDS.find((l) => l.min > xp);
    const xpInLevel = xp - level.min;
    const xpNeeded = nextLevel ? nextLevel.min - level.min : 1;
    const levelPct = nextLevel ? Math.min(100, Math.round((xpInLevel / xpNeeded) * 100)) : 100;

    const handleShare = async () => {
      const text = `Concluí meu treino no FitPro!\n${totalExercicios} exercícios · ${durationMin} min · ~${calories} kcal · +${xpGanho} XP`;
      try {
        if (navigator.share) {
          await navigator.share({ title: "FitPro — Treino Concluído!", text });
        } else {
          await navigator.clipboard.writeText(text);
        }
      } catch { /* cancelled */ }
    };

    const stagger = (i: number) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" } } });

    return (
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "#000",
          display: "flex", flexDirection: "column",
          alignItems: "center",
          padding: "0 20px",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Confetti />

        <div style={{ width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 48, gap: 0, zIndex: 1 }}>

          {/* Check icon */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0, transition: { type: "spring", stiffness: 300, damping: 18 } }}
            style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "rgba(47,254,29,0.12)",
              border: "2px solid #2ffe1d",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 20,
              boxShadow: "0 0 40px rgba(47,254,29,0.35)",
            }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M4 12l5 5 11-11" stroke="#2ffe1d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>

          {/* Title */}
          <motion.div {...stagger(1)} style={{ textAlign: "center", marginBottom: 8 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 4 }}>Treino Concluido!</h1>
            <p style={{ fontSize: 15, color: "#ffffff60" }}>{workout.nome}</p>
          </motion.div>

          {/* XP earned */}
          <motion.div
            {...stagger(2)}
            style={{
              margin: "16px 0",
              padding: "14px 28px",
              background: "rgba(47,254,29,0.08)",
              border: "1.5px solid rgba(47,254,29,0.35)",
              borderRadius: 16,
              textAlign: "center",
              boxShadow: "0 0 24px rgba(47,254,29,0.15)",
            }}
          >
            <motion.p
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { delay: 0.3, type: "spring", stiffness: 260, damping: 16 } }}
              style={{ fontSize: 36, fontWeight: 900, color: "#2ffe1d", lineHeight: 1 }}
            >
              +{xpGanho > 0 ? xpGanho : 50} XP
            </motion.p>
            <p style={{ fontSize: 12, color: "#ffffff50", marginTop: 4 }}>ganhos neste treino</p>
          </motion.div>

          {/* Level up banner */}
          {leveledUp && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { delay: 0.45, type: "spring", stiffness: 280 } }}
              style={{
                width: "100%", padding: "12px 16px", marginBottom: 12,
                background: `${level.color}15`,
                border: `1.5px solid ${level.color}50`,
                borderRadius: 14,
                display: "flex", alignItems: "center", gap: 12,
              }}
            >
              <span style={{ fontSize: 28 }}>🎉</span>
              <div>
                <p style={{ fontSize: 11, color: "#ffffff50", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Level up!</p>
                <p style={{ fontSize: 15, fontWeight: 800, color: level.color }}>{level.name}</p>
              </div>
            </motion.div>
          )}

          {/* Level progress */}
          <motion.div {...stagger(3)} style={{ width: "100%", marginBottom: 12 }}>
            <div style={{
              padding: "14px 16px",
              background: "#1e161e",
              border: `1px solid ${level.color}25`,
              borderRadius: 14,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: `${level.color}18`, border: `1.5px solid ${level.color}50`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 800, color: level.color,
                  }}>
                    {level.level}
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 14, color: level.color }}>{level.name}</span>
                </div>
                <span style={{ fontSize: 12, color: "#ffffff40" }}>{xp} XP</span>
              </div>
              <div style={{ height: 6, background: "#0e0e0e", borderRadius: 999, overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelPct}%`, transition: { delay: 0.5, duration: 0.9, ease: [0.22, 0.9, 0.4, 1] } }}
                  style={{
                    height: "100%",
                    background: `linear-gradient(90deg, ${level.color}88, ${level.color})`,
                    borderRadius: 999,
                    boxShadow: `0 0 8px ${level.color}55`,
                  }}
                />
              </div>
              {nextLevel && (
                <p style={{ fontSize: 11, color: "#ffffff30", marginTop: 6 }}>
                  {nextLevel.min - xp} XP para {nextLevel.name}
                </p>
              )}
            </div>
          </motion.div>

          {/* Stats grid */}
          <motion.div {...stagger(4)} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%", marginBottom: 12 }}>
            {[
              { icon: "⏱", label: "Duracao", value: `${durationMin} min` },
              { icon: "💪", label: "Exercicios", value: `${totalExercicios}` },
              { icon: "🔁", label: "Series", value: `${series.length}` },
              { icon: "🔥", label: "Calorias", value: `~${calories} kcal` },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: "#111",
                  border: "1px solid #1e1e1e",
                  borderRadius: 14, padding: "12px 8px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                }}
              >
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <p style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{s.value}</p>
                <p style={{ fontSize: 10, color: "#ffffff40", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* New badge */}
          {newBadgeName && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.55 } }}
              style={{
                width: "100%",
                background: "rgba(47,254,29,0.07)",
                border: "1px solid rgba(47,254,29,0.25)",
                borderRadius: 12, padding: "10px 14px",
                marginBottom: 12,
                display: "flex", alignItems: "center", gap: 10,
              }}
            >
              <span style={{ fontSize: 22 }}>🏅</span>
              <div>
                <p style={{ fontSize: 10, color: "#ffffff40", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Nova conquista</p>
                <p style={{ fontSize: 13, color: "#2ffe1d", fontWeight: 700 }}>{newBadgeName}</p>
              </div>
            </motion.div>
          )}

          {/* Buttons */}
          <motion.div {...stagger(5)} style={{ display: "flex", gap: 10, width: "100%", paddingBottom: 8 }}>
            <button
              className="btn-press"
              onClick={handleShare}
              style={{
                flex: 1, padding: "14px 0", borderRadius: 14, fontWeight: 700, fontSize: 14,
                background: "#1e161e", color: "#fff",
                border: "1px solid rgba(47,254,29,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Compartilhar
            </button>
            <button
              className="btn-press"
              onClick={() => router.push("/")}
              style={{
                flex: 1, padding: "14px 0", borderRadius: 14, fontWeight: 700, fontSize: 14,
                background: "#2ffe1d", color: "#000", border: "none",
              }}
            >
              Dashboard
            </button>
          </motion.div>

        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ height: "100%", minHeight: "100%" }}>
      {/* Top progress */}
      <div className="px-4 pt-4 pb-2 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <button
            className="btn-press flex items-center gap-1.5 text-sm"
            style={{ color: "#ffffff60" }}
            onClick={() => router.back()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sair
          </button>
          <span className="text-sm font-semibold" style={{ color: "#ffffff80" }}>
            {currentExerciseIndex + 1}/{totalExercicios}
          </span>
        </div>
        <ProgressBar value={workoutProgress} showPercent height={8} />
        <p className="text-xs mt-1.5 text-center font-medium truncate" style={{ color: "#ffffff60" }}>
          {workout.nome}
        </p>
      </div>

      {/* Main content — no AnimatePresence, no opacity:0 initial */}
      <div className="flex-1 px-4 flex flex-col gap-4">
        {phase === "rest" ? (
          <div className="flex flex-col items-center justify-center flex-1 py-6 gap-4">
            <div className="text-center">
              <h2 className="text-xl font-bold">Descanso</h2>
              <p className="text-sm mt-1" style={{ color: "#ffffff60" }}>
                Série {currentSerie - 1}/{exercise.series} concluída
              </p>
            </div>

            <CircularTimer
              key={restSeconds ?? exercise.descanso_segundos ?? 60}
              totalSeconds={restSeconds ?? exercise.descanso_segundos ?? 60}
              onComplete={() => { setPhase("exercise"); setRestSeconds(null); }}
              size={148}
              strokeWidth={10}
              onAdjust={handleRestAdjust}
            />

            <button
              className="btn-press px-6 py-2.5 rounded-full text-sm font-semibold"
              style={{ background: "#1e161e", color: "#2ffe1d", border: "1px solid rgba(47,254,29,0.3)" }}
              onClick={() => { setPhase("exercise"); setRestSeconds(null); }}
            >
              Pular descanso
            </button>

            {/* Próximo exercício */}
            {currentExerciseIndex + 1 < totalExercicios && (
              <div
                className="w-full card p-3 flex items-center gap-3"
                style={{ background: "#111", border: "1px solid #1e1e1e" }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{ background: "#1a1a1a", color: "#ffffff40", border: "1px solid #2b2b2b" }}
                >
                  {currentExerciseIndex + 2}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: "#ffffff60" }}>
                    Próximo exercício
                  </p>
                  <p className="text-sm font-bold truncate">
                    {exercicios[currentExerciseIndex + 1].nome}
                  </p>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: "rgba(47,254,29,0.08)", color: "#2ffe1d", border: "1px solid rgba(47,254,29,0.2)" }}
                >
                  {exercicios[currentExerciseIndex + 1].grupo_muscular}
                </span>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Exercise info */}
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: "rgba(47,254,29,0.1)", color: "#2ffe1d", border: "1px solid rgba(47,254,29,0.25)" }}
                >
                  {exercise.grupo_muscular}
                </span>
                <span className="text-xs" style={{ color: "#ffffff40" }}>
                  Série {currentSerie}/{exercise.series ?? 3}
                </span>
              </div>
              <h2 className="text-2xl font-bold">{exercise.nome}</h2>
              <p className="text-sm mt-1" style={{ color: "#ffffff70", lineHeight: 1.5 }}>
                {exercise.descricao_curta}
              </p>
            </div>

            {/* Media */}
            <div className="relative">
              <ExerciseMedia
                alt={exercise.nome}
                exerciseName={exercise.nome}
                muscleGroup={exercise.grupo_muscular}
                animacaoUrl={exercise.animacao_url}
                animacaoTipo={exercise.animacao_tipo}
                imageUrl={exercise.image_url}
                thumbnailUrl={exercise.thumbnail_url}
                expanded={expanded}
              />
              <button
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center btn-press"
                style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
                onClick={() => setExpanded((e) => !e)}
                aria-label="Expandir mídia"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Series tracker */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm">Séries</span>
                <span className="text-xs" style={{ color: "#2ffe1d" }}>{seriesConcluidas}/{exercise.series ?? 3} concluídas</span>
              </div>
              <div className="flex gap-2 mb-4">
                {Array.from({ length: exercise.series ?? 3 }, (_, i) => {
                  const isConcluida = series.some((s) => s.exerciseId === exercise.id && s.serieIndex === i + 1);
                  const isCurrent = i + 1 === currentSerie;
                  return (
                    <div
                      key={i}
                      className="flex-1 h-8 rounded-xl flex items-center justify-center text-xs font-bold"
                      style={{
                        background: isConcluida ? "rgba(47,254,29,0.15)" : isCurrent ? "rgba(47,254,29,0.05)" : "#1a1a1a",
                        border: isConcluida ? "1.5px solid rgba(47,254,29,0.5)" : isCurrent ? "1.5px solid rgba(47,254,29,0.25)" : "1.5px solid #2b2b2b",
                        color: isConcluida ? "#2ffe1d" : isCurrent ? "#fff" : "#666",
                      }}
                    >
                      {isConcluida ? "✓" : i + 1}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 text-sm mb-4" style={{ color: "#ffffff70" }}>
                <div className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M6 4v16M18 4v16M6 8H4a1 1 0 00-1 1v6a1 1 0 001 1h2M18 8h2a1 1 0 011 1v6a1 1 0 01-1 1h-2M6 12h12" stroke="#2ffe1d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-semibold" style={{ color: "#fff" }}>{exercise.reps}</span>
                  <span>reps</span>
                </div>
                <span style={{ color: "#2b2b2b" }}>|</span>
                <div className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="#2ffe1d" strokeWidth="2"/>
                    <path d="M12 7v5l3 3" stroke="#2ffe1d" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>{exercise.descanso_segundos ?? 60}s descanso</span>
                </div>
              </div>

              <button
                className="btn-press w-full py-3.5 rounded-2xl font-bold text-base flex items-center justify-center gap-2"
                style={{ background: "#2ffe1d", color: "#000" }}
                onClick={handleConcluirSerie}
              >
                <AnimatedCheck visible={lastChecked === seriesKey} size={22} />
                {lastChecked === seriesKey ? "Concluído!" : `Concluir Série ${currentSerie}`}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Bottom nav dots */}
      <div className="px-4 pt-3 flex items-center justify-between flex-shrink-0">
        <button
          className="btn-press flex items-center gap-1.5 text-sm py-2 px-3 rounded-xl"
          style={{ color: "#ffffff50", background: "#1a1a1a" }}
          onClick={handleSkip}
          disabled={currentExerciseIndex >= totalExercicios - 1}
        >
          Pular
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="flex gap-1.5">
          {exercicios.map((_, i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: i === currentExerciseIndex ? 20 : 6,
                height: 6,
                background: i <= currentExerciseIndex ? "#2ffe1d" : "#2b2b2b",
                opacity: i === currentExerciseIndex ? 1 : 0.6,
                transition: "width 0.3s ease",
              }}
            />
          ))}
        </div>

        <button
          className="btn-press flex items-center gap-1.5 text-sm py-2 px-3 rounded-xl"
          style={{ color: "#ffffff50", background: "#1a1a1a" }}
          onClick={() => {
            if (currentExerciseIndex > 0) {
              setCurrentExerciseIndex(currentExerciseIndex - 1);
              setCurrentSerie(1);
              setPhase("exercise");
            }
          }}
          disabled={currentExerciseIndex === 0}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Voltar
        </button>
      </div>
    </div>
  );
}

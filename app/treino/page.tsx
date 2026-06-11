"use client";

import { useState } from "react";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import ExerciseMedia from "@/components/ExerciseMedia";
import PageWrapper from "@/components/PageWrapper";
import { useAppStore } from "@/store/useAppStore";
import type { Workout } from "@/types";

const MOCK_WORKOUTS: Workout[] = [
  {
    id: "a",
    nome: "Treino A — Peito & Tríceps",
    descricao: "Foco em desenvolvimento do peitoral e tríceps com exercícios compostos e isolados.",
    duracao_minutos: 45,
    nivel: "intermediario",
    thumbnail_url: "",
    exercicios: [
      { id: "e1", nome: "Supino Reto", grupo_muscular: "Peito", descricao_curta: "Exercício composto para peitoral", series: 4, reps: "8-12", descanso_segundos: 90 },
      { id: "e2", nome: "Crucifixo", grupo_muscular: "Peito", descricao_curta: "Isolamento do peitoral", series: 3, reps: "10-15", descanso_segundos: 60 },
      { id: "e3", nome: "Supino Inclinado", grupo_muscular: "Peito", descricao_curta: "Ênfase na parte superior do peitoral", series: 3, reps: "8-12", descanso_segundos: 90 },
      { id: "e4", nome: "Tríceps Pulley", grupo_muscular: "Tríceps", descricao_curta: "Isolamento do tríceps na polia", series: 3, reps: "12-15", descanso_segundos: 60 },
      { id: "e5", nome: "Tríceps Francês", grupo_muscular: "Tríceps", descricao_curta: "Extensão do tríceps com halteres", series: 3, reps: "10-12", descanso_segundos: 60 },
      { id: "e6", nome: "Fundos", grupo_muscular: "Tríceps", descricao_curta: "Movimento composto para tríceps", series: 3, reps: "max", descanso_segundos: 90 },
    ],
  },
  {
    id: "b",
    nome: "Treino B — Costas & Bíceps",
    descricao: "Treino completo para costas com ênfase em largura e espessura, finalizando com bíceps.",
    duracao_minutos: 50,
    nivel: "intermediario",
    thumbnail_url: "",
    exercicios: [
      { id: "e7", nome: "Puxada Frontal", grupo_muscular: "Costas", descricao_curta: "Puxada na polia alta para largura", series: 4, reps: "8-12", descanso_segundos: 90 },
      { id: "e8", nome: "Remada Curvada", grupo_muscular: "Costas", descricao_curta: "Exercício composto para espessura", series: 4, reps: "8-10", descanso_segundos: 90 },
      { id: "e9", nome: "Remada Unilateral", grupo_muscular: "Costas", descricao_curta: "Remada com haltere unilateral", series: 3, reps: "10-12", descanso_segundos: 60 },
      { id: "e10", nome: "Rosca Direta", grupo_muscular: "Bíceps", descricao_curta: "Isolamento do bíceps com barra", series: 3, reps: "10-12", descanso_segundos: 60 },
      { id: "e11", nome: "Rosca Martelo", grupo_muscular: "Bíceps", descricao_curta: "Trabalha bíceps e braquial", series: 3, reps: "12-15", descanso_segundos: 60 },
    ],
  },
  {
    id: "c",
    nome: "Treino C — Pernas",
    descricao: "Treino completo de membros inferiores com foco em quadríceps, posterior e glúteos.",
    duracao_minutos: 60,
    nivel: "avancado",
    thumbnail_url: "",
    exercicios: [
      { id: "e12", nome: "Agachamento", grupo_muscular: "Pernas", descricao_curta: "Rei dos exercícios para pernas", series: 5, reps: "6-10", descanso_segundos: 120 },
      { id: "e13", nome: "Leg Press", grupo_muscular: "Pernas", descricao_curta: "Prensa para quadríceps", series: 4, reps: "10-15", descanso_segundos: 90 },
      { id: "e14", nome: "Cadeira Extensora", grupo_muscular: "Pernas", descricao_curta: "Isolamento do quadríceps", series: 3, reps: "12-15", descanso_segundos: 60 },
      { id: "e15", nome: "Mesa Flexora", grupo_muscular: "Pernas", descricao_curta: "Isolamento do posterior de coxa", series: 3, reps: "12-15", descanso_segundos: 60 },
      { id: "e16", nome: "Panturrilha em Pé", grupo_muscular: "Pernas", descricao_curta: "Exercício para panturrilha", series: 4, reps: "15-20", descanso_segundos: 45 },
    ],
  },
];

const NIVEL_LABELS: Record<string, { label: string; color: string }> = {
  iniciante: { label: "Iniciante", color: "#4ade80" },
  intermediario: { label: "Intermediário", color: "#facc15" },
  avancado: { label: "Avançado", color: "#f87171" },
};

const GRUPOS_MUSCULARES = ["Todos", "Peito", "Costas", "Pernas", "Ombros", "Bíceps", "Tríceps", "Abdômen"];

function formatDate(ts: number) {
  const d = new Date(ts);
  const hoje = new Date();
  const ontem = new Date(); ontem.setDate(hoje.getDate() - 1);
  if (d.toDateString() === hoje.toDateString()) return "Hoje";
  if (d.toDateString() === ontem.toDateString()) return "Ontem";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export default function TreinoPage() {
  const { setCurrentWorkout, userProfile, workoutHistory } = useAppStore();
  const [showHistory, setShowHistory] = useState(false);
  const [selectedGrupo, setSelectedGrupo] = useState("Todos");
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genStatus, setGenStatus] = useState("");
  const [generatedWorkouts, setGeneratedWorkouts] = useState<Workout[]>([]);
  const [genError, setGenError] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);

  const allWorkouts = [...generatedWorkouts, ...MOCK_WORKOUTS];
  const filtered = selectedGrupo === "Todos"
    ? allWorkouts
    : allWorkouts.filter((w) =>
        w.exercicios.some((e) => e.grupo_muscular === selectedGrupo)
      );

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenProgress(5);
    setGenStatus("Analisando seu perfil...");
    setGenError("");

    const profile = userProfile ?? { objetivo: "hipertrofia", nivel: "intermediario", metaSemanal: 4, nome: "" };

    try {
      const response = await fetch("/api/generate-workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objetivo: profile.objetivo,
          nivel: profile.nivel,
          metaSemanal: profile.metaSemanal,
          nome: profile.nome,
          grupoMuscular: selectedMuscle,
          faixaEtaria: profile.faixaEtaria,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error ?? "Erro ao gerar treino");
      }

      if (!response.body) throw new Error("Sem resposta do servidor");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      setGenProgress(15);
      setGenStatus("Gerando treino personalizado...");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        const progress = Math.min(15 + Math.floor((fullText.length / 1800) * 75), 88);
        setGenProgress(progress);
      }

      fullText += decoder.decode();

      setGenProgress(95);
      setGenStatus("Finalizando...");

      const workout = JSON.parse(fullText) as Workout;
      workout.id = `ai_${Date.now()}`;
      workout.thumbnail_url = "";

      setGeneratedWorkouts((prev) => [workout, ...prev]);
      setGenProgress(100);
      setGenStatus("Treino gerado!");

      setTimeout(() => {
        setIsGenerating(false);
        setGenProgress(0);
        setGenStatus("");
      }, 1800);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setGenError(msg);
      setIsGenerating(false);
      setGenProgress(0);
      setGenStatus("");
    }
  };

  return (
    <PageWrapper>
    <div className="px-4 pt-6 pb-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Treinos</h1>
        <p className="text-sm mt-1" style={{ color: "#ffffff60" }}>Escolha ou gere um treino personalizado</p>
      </div>

      {/* Generate button */}
      <div className="mb-5">
        {/* Muscle group selector */}
        <div className="card p-4 mb-3">
          <p className="text-xs font-semibold mb-3" style={{ color: "#ffffff50", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Qual grupo muscular treinar?
          </p>
          <div className="flex flex-wrap gap-2">
            {["Peito", "Costas", "Pernas", "Ombros", "Bíceps", "Tríceps", "Abdômen", "Full Body"].map((g) => {
              const active = selectedMuscle === g;
              return (
                <button
                  key={g}
                  className="btn-press px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    background: active ? "rgba(47,254,29,0.15)" : "#1a1a1a",
                    border: `1px solid ${active ? "rgba(47,254,29,0.5)" : "#2b2b2b"}`,
                    color: active ? "#2ffe1d" : "#ffffff70",
                  }}
                  onClick={() => setSelectedMuscle(active ? null : g)}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </div>

        <button
          className="btn-press w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
          style={{ background: isGenerating ? "#1a1a1a" : "#2ffe1d", color: isGenerating ? "#2ffe1d" : "#000" }}
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          {isGenerating ? "Gerando treino..." : selectedMuscle ? `Gerar Treino — ${selectedMuscle}` : "Gerar Treino com IA"}
        </button>

        {isGenerating && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs" style={{ color: "#ffffff60" }}>{genStatus}</span>
              <span className="text-xs font-semibold" style={{ color: "#2ffe1d" }}>{genProgress}%</span>
            </div>
            <ProgressBar value={genProgress} height={8} />
          </div>
        )}

        {genError && (
          <p className="mt-2 text-xs text-center" style={{ color: "#f87171" }}>{genError}</p>
        )}
      </div>

      {/* Filter chips */}
      <div
        className="flex gap-2 overflow-x-auto pb-2 mb-5"
        style={{ scrollbarWidth: "none" }}
      >
        {GRUPOS_MUSCULARES.map((g) => (
          <button
            key={g}
            className="chip btn-press flex-shrink-0"
            style={{
              background: selectedGrupo === g ? "rgba(47,254,29,0.12)" : "#1e161e",
              borderColor: selectedGrupo === g ? "rgba(47,254,29,0.5)" : "rgba(47,254,29,0.15)",
              color: selectedGrupo === g ? "#2ffe1d" : "#fff",
            }}
            onClick={() => setSelectedGrupo(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Workout list */}
      <div className="flex flex-col gap-4">
        {filtered.map((workout, idx) => {
          const nivel = NIVEL_LABELS[workout.nivel ?? "iniciante"];
          const isAI = workout.id.startsWith("ai_");
          return (
            <div
              key={workout.id}
              className="card p-0 overflow-hidden"
              style={isAI ? { border: "1px solid rgba(47,254,29,0.25)", boxShadow: "0 0 16px rgba(47,254,29,0.08)" } : undefined}
            >
              {/* Thumbnail area */}
              <div style={{ height: 100, background: isAI ? "linear-gradient(135deg, #0d1a0d, #0a1a0a)" : "linear-gradient(135deg, #1e161e, #0d1a0d)", position: "relative", overflow: "hidden" }}>
                <ExerciseMedia alt={workout.nome} className="w-full" />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  {isAI && (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: "rgba(47,254,29,0.15)", color: "#2ffe1d", border: "1px solid rgba(47,254,29,0.4)" }}
                    >
                      ✦ IA
                    </span>
                  )}
                  <div style={{ flex: 1 }} />
                  <div
                    className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: "rgba(0,0,0,0.6)", color: nivel.color, border: `1px solid ${nivel.color}40` }}
                  >
                    {nivel.label}
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-sm mb-1">{workout.nome}</h3>
                <p className="text-xs mb-3" style={{ color: "#ffffff60", lineHeight: 1.5 }}>{workout.descricao}</p>

                <div className="flex items-center gap-3 mb-3 text-xs" style={{ color: "#ffffff50" }}>
                  <span>⏱ {workout.duracao_minutos} min</span>
                  <span>💪 {workout.exercicios.length} exercícios</span>
                </div>

                {/* Exercise pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {[...new Set(workout.exercicios.map((e) => e.grupo_muscular))].map((g) => (
                    <span
                      key={g}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "#1a1a1a", color: "#ffffff70", border: "1px solid #2b2b2b" }}
                    >
                      {g}
                    </span>
                  ))}
                </div>

                <Link
                  href="/treino/execucao"
                  onClick={() => setCurrentWorkout(workout)}
                >
                  <button
                    className="btn-press w-full py-3 rounded-xl font-bold text-sm"
                    style={{ background: "#2ffe1d", color: "#000" }}
                  >
                    Iniciar Treino
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>

      {/* Histórico */}
      {workoutHistory.length > 0 && (
        <div className="px-4 pb-6 mt-2">
          <button
            className="btn-press w-full flex items-center justify-between py-3"
            onClick={() => setShowHistory((v) => !v)}
          >
            <span className="font-bold text-base">Histórico</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold" style={{ color: "#2ffe1d" }}>
                {workoutHistory.length} treino{workoutHistory.length !== 1 ? "s" : ""}
              </span>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                style={{ transform: showHistory ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
              >
                <path d="M6 9l6 6 6-6" stroke="#ffffff60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>

          {showHistory && (
            <div className="flex flex-col gap-3 mt-2">
              {workoutHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="card p-4 flex items-center gap-3"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(47,254,29,0.08)", border: "1px solid rgba(47,254,29,0.15)" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M6 4v16M18 4v16M6 8H4a1 1 0 00-1 1v6a1 1 0 001 1h2M18 8h2a1 1 0 011 1v6a1 1 0 01-1 1h-2M6 12h12" stroke="#2ffe1d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{entry.workoutNome}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#ffffff50" }}>
                      {entry.totalExercicios} exercícios · {entry.totalSeries} séries · {entry.durationMin} min · ~{entry.calories} kcal
                    </p>
                  </div>
                  <span className="text-xs font-semibold flex-shrink-0" style={{ color: "#ffffff40" }}>
                    {formatDate(entry.date)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
}

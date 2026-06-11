"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ProgressBar from "@/components/ProgressBar";
import PageWrapper from "@/components/PageWrapper";
import { useAppStore } from "@/store/useAppStore";
import type { Meal } from "@/types";

const MOCK_MEALS: Meal[] = [
  {
    id: "m1",
    nome: "Café da Manhã",
    horario: "07:00",
    itens: [
      { id: "f1", nome: "Ovos mexidos", quantidade: "3 unidades", calorias: 210, proteina: 18, carboidrato: 2, gordura: 14, consumido: false },
      { id: "f2", nome: "Pão integral", quantidade: "2 fatias", calorias: 140, proteina: 6, carboidrato: 28, gordura: 2, consumido: false },
      { id: "f3", nome: "Banana", quantidade: "1 unidade", calorias: 90, proteina: 1, carboidrato: 22, gordura: 0, consumido: false },
    ],
  },
  {
    id: "m2",
    nome: "Almoço",
    horario: "12:00",
    itens: [
      { id: "f4", nome: "Frango grelhado", quantidade: "200g", calorias: 330, proteina: 62, carboidrato: 0, gordura: 8, consumido: false },
      { id: "f5", nome: "Arroz integral", quantidade: "100g cozido", calorias: 120, proteina: 3, carboidrato: 26, gordura: 1, consumido: false },
      { id: "f6", nome: "Brócolis", quantidade: "100g", calorias: 34, proteina: 3, carboidrato: 6, gordura: 0, consumido: false },
      { id: "f7", nome: "Azeite", quantidade: "1 colher", calorias: 90, proteina: 0, carboidrato: 0, gordura: 10, consumido: false },
    ],
  },
  {
    id: "m3",
    nome: "Pré-Treino",
    horario: "16:00",
    itens: [
      { id: "f8", nome: "Whey Protein", quantidade: "1 scoop (30g)", calorias: 120, proteina: 24, carboidrato: 3, gordura: 2, consumido: false },
      { id: "f9", nome: "Banana", quantidade: "1 unidade", calorias: 90, proteina: 1, carboidrato: 22, gordura: 0, consumido: false },
    ],
  },
  {
    id: "m4",
    nome: "Jantar",
    horario: "20:00",
    itens: [
      { id: "f10", nome: "Salmão", quantidade: "150g", calorias: 280, proteina: 42, carboidrato: 0, gordura: 12, consumido: false },
      { id: "f11", nome: "Batata doce", quantidade: "150g", calorias: 130, proteina: 2, carboidrato: 30, gordura: 0, consumido: false },
      { id: "f12", nome: "Salada verde", quantidade: "à vontade", calorias: 20, proteina: 1, carboidrato: 3, gordura: 0, consumido: false },
    ],
  },
];

const METAS_ALIMENTARES = [
  { id: "emagrecer", label: "Emagrecer", icon: "🔥" },
  { id: "manter",   label: "Manter peso", icon: "⚖️" },
  { id: "ganhar",   label: "Ganhar massa", icon: "💪" },
];

const RESTRICOES = ["Vegetariano", "Sem lactose", "Sem glúten", "Sem carne vermelha"];

const ALERGENOS = ["Amendoim", "Frutos do mar", "Leite", "Ovos", "Soja", "Trigo", "Castanhas", "Peixe"];

function MacroBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs" style={{ color: "#ffffff70" }}>{label}</span>
        <span className="text-xs font-semibold" style={{ color }}>
          {value}g <span style={{ color: "#ffffff40" }}>/ {max}g</span>
        </span>
      </div>
      <ProgressBar value={pct} height={5} color={color} />
    </div>
  );
}

function MealCard({ meal }: { meal: Meal }) {
  const { toggleFoodConsumed } = useAppStore();
  const totalCal  = meal.itens.reduce((s, f) => s + f.calorias, 0);
  const totalProt = meal.itens.reduce((s, f) => s + f.proteina, 0);
  const totalCarb = meal.itens.reduce((s, f) => s + f.carboidrato, 0);
  const totalGord = meal.itens.reduce((s, f) => s + f.gordura, 0);

  return (
    <div className="card p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold text-sm">{meal.nome}</h3>
          <p className="text-xs" style={{ color: "#ffffff50" }}>{meal.horario}</p>
        </div>
        <div className="text-right">
          <span className="font-bold text-sm" style={{ color: "#2ffe1d" }}>{totalCal}</span>
          <span className="text-xs ml-0.5" style={{ color: "#ffffff60" }}>kcal</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <MacroBar label="Proteína"    value={totalProt} max={60} color="#2ffe1d" />
        <MacroBar label="Carboidrato" value={totalCarb} max={80} color="#facc15" />
        <MacroBar label="Gordura"     value={totalGord} max={30} color="#f87171" />
      </div>

      <div className="flex flex-col gap-2">
        {meal.itens.map((food) => (
          <motion.button
            key={food.id}
            className="btn-press flex items-center gap-3 w-full text-left"
            onClick={() => toggleFoodConsumed(meal.id, food.id)}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
              style={{
                background: food.consumido ? "rgba(47,254,29,0.1)" : "#1a1a1a",
                border: food.consumido ? "1.5px solid rgba(47,254,29,0.3)" : "1.5px solid #2b2b2b",
              }}
            >
              {food.consumido ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M4 12l5 5 11-11" stroke="#2ffe1d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <span style={{ fontSize: 16 }}>🍽</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{ color: food.consumido ? "#ffffff60" : "#fff", textDecoration: food.consumido ? "line-through" : "none" }}>
                {food.nome}
              </p>
              <p className="text-xs" style={{ color: "#ffffff40" }}>{food.quantidade}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-semibold" style={{ color: food.consumido ? "#ffffff40" : "#fff" }}>{food.calorias} kcal</p>
              <p className="text-xs" style={{ color: "#ffffff30" }}>P{food.proteina}g</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default function DietaPage() {
  const { meals, setMeals, userProfile } = useAppStore();

  const [metaAlimentar, setMetaAlimentar]   = useState<string | null>(null);
  const [restricoesSel, setRestricoesSel]   = useState<string[]>([]);
  const [alergiasSel, setAlergiasSel]       = useState<string[]>([]);
  const [alergiasCustom, setAlergiasCustom] = useState("");
  const [isGenerating, setIsGenerating]     = useState(false);
  const [genProgress, setGenProgress]     = useState(0);
  const [genStatus, setGenStatus]         = useState("");
  const [genError, setGenError]           = useState("");
  const [isAI, setIsAI]                   = useState(false);

  const activeMeals = meals.length > 0 ? meals : MOCK_MEALS;

  const totalCal     = activeMeals.flatMap((m) => m.itens).reduce((s, f) => s + f.calorias, 0);
  const consumidoCal = activeMeals.flatMap((m) => m.itens).filter((f) => f.consumido).reduce((s, f) => s + f.calorias, 0);
  const totalProt    = activeMeals.flatMap((m) => m.itens).reduce((s, f) => s + f.proteina, 0);
  const totalCarb    = activeMeals.flatMap((m) => m.itens).reduce((s, f) => s + f.carboidrato, 0);
  const totalGord    = activeMeals.flatMap((m) => m.itens).reduce((s, f) => s + f.gordura, 0);
  const dietaProgress = totalCal > 0 ? (consumidoCal / totalCal) * 100 : 0;

  const toggleRestricao = (r: string) =>
    setRestricoesSel((prev) => prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]);

  const toggleAlergia = (a: string) =>
    setAlergiasSel((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenProgress(5);
    setGenStatus("Analisando seu perfil...");
    setGenError("");

    const profile = userProfile ?? { objetivo: "hipertrofia", nivel: "intermediario", metaSemanal: 4, nome: "" };

    try {
      const response = await fetch("/api/generate-diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objetivo: profile.objetivo,
          nivel: profile.nivel,
          nome: profile.nome,
          metaAlimentar: metaAlimentar ?? "manter",
          restricoes: restricoesSel,
          alergias: [
            ...alergiasSel,
            ...alergiasCustom.split(",").map((s) => s.trim()).filter(Boolean),
          ],
          faixaEtaria: profile.faixaEtaria,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error ?? "Erro ao gerar dieta");
      }

      if (!response.body) throw new Error("Sem resposta do servidor");

      const reader  = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText  = "";

      setGenProgress(15);
      setGenStatus("Montando seu plano alimentar...");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        const progress = Math.min(15 + Math.floor((fullText.length / 2400) * 75), 88);
        setGenProgress(progress);
      }

      fullText += decoder.decode();

      setGenProgress(95);
      setGenStatus("Finalizando...");

      const generated = JSON.parse(fullText) as Meal[];
      // Ensure unique IDs
      generated.forEach((m, mi) => {
        m.id = `ai_m${mi + 1}_${Date.now()}`;
        m.itens.forEach((f, fi) => { f.id = `ai_f${mi}_${fi}_${Date.now()}`; f.consumido = false; });
      });

      setMeals(generated);
      setIsAI(true);
      setGenProgress(100);
      setGenStatus("Dieta gerada!");

      setTimeout(() => { setIsGenerating(false); setGenProgress(0); setGenStatus(""); }, 1500);
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
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold">Dieta</h1>
          <p className="text-sm mt-0.5" style={{ color: "#ffffff60" }}>
            {isAI ? "Plano gerado por IA ✦" : "Plano alimentar de hoje"}
          </p>
        </div>
        {isAI && (
          <span className="text-xs px-2 py-1 rounded-full font-bold" style={{ background: "rgba(47,254,29,0.12)", color: "#2ffe1d", border: "1px solid rgba(47,254,29,0.3)" }}>
            ✦ IA
          </span>
        )}
      </div>

      {/* Daily summary */}
      <div className="card p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-sm">Calorias do Dia</span>
          <div>
            <span className="font-bold text-xl" style={{ color: "#2ffe1d" }}>{consumidoCal}</span>
            <span className="text-sm ml-1" style={{ color: "#ffffff60" }}>/ {totalCal} kcal</span>
          </div>
        </div>
        <ProgressBar value={dietaProgress} showPercent height={10} />
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: "Proteína", value: totalProt, color: "#2ffe1d" },
            { label: "Carbo",    value: totalCarb, color: "#facc15" },
            { label: "Gordura",  value: totalGord, color: "#f87171" },
          ].map((macro) => (
            <div key={macro.label} className="flex flex-col items-center">
              <span className="text-lg font-bold" style={{ color: macro.color }}>{macro.value}g</span>
              <span className="text-xs" style={{ color: "#ffffff50" }}>{macro.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Meals */}
      <div>
        {activeMeals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>

      {/* IA Generator */}
      <div className="card p-4 mt-2">
        <p className="font-bold text-sm mb-4">Gerar Nova Dieta com IA</p>

        {/* Meta alimentar */}
        <p className="text-xs font-semibold mb-2" style={{ color: "#ffffff50", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Objetivo alimentar
        </p>
        <div className="flex gap-2 mb-4">
          {METAS_ALIMENTARES.map((m) => {
            const active = metaAlimentar === m.id;
            return (
              <button
                key={m.id}
                className="btn-press flex-1 py-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1"
                style={{
                  background: active ? "rgba(47,254,29,0.12)" : "#1a1a1a",
                  border: `1px solid ${active ? "rgba(47,254,29,0.4)" : "#2b2b2b"}`,
                  color: active ? "#2ffe1d" : "#ffffff70",
                }}
                onClick={() => setMetaAlimentar(active ? null : m.id)}
              >
                <span style={{ fontSize: 16 }}>{m.icon}</span>
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Restrições */}
        <p className="text-xs font-semibold mb-2" style={{ color: "#ffffff50", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Restrições alimentares
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {RESTRICOES.map((r) => {
            const active = restricoesSel.includes(r);
            return (
              <button
                key={r}
                className="btn-press px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: active ? "rgba(47,254,29,0.12)" : "#1a1a1a",
                  border: `1px solid ${active ? "rgba(47,254,29,0.4)" : "#2b2b2b"}`,
                  color: active ? "#2ffe1d" : "#ffffff60",
                }}
                onClick={() => toggleRestricao(r)}
              >
                {active ? "✓ " : ""}{r}
              </button>
            );
          })}
        </div>

        {/* Alergias */}
        <p className="text-xs font-semibold mb-2" style={{ color: "#f87171", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          ⚠️ Alergias alimentares
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {ALERGENOS.map((a) => {
            const active = alergiasSel.includes(a);
            return (
              <button
                key={a}
                className="btn-press px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: active ? "rgba(248,113,113,0.12)" : "#1a1a1a",
                  border: `1px solid ${active ? "rgba(248,113,113,0.5)" : "#2b2b2b"}`,
                  color: active ? "#f87171" : "#ffffff60",
                }}
                onClick={() => toggleAlergia(a)}
              >
                {active ? "✕ " : ""}{a}
              </button>
            );
          })}
        </div>
        <input
          type="text"
          placeholder="Outras alergias (separadas por vírgula)"
          value={alergiasCustom}
          onChange={(e) => setAlergiasCustom(e.target.value)}
          style={{
            width: "100%", background: "#141414",
            border: "1px solid #2b2b2b", borderRadius: 12,
            padding: "10px 14px", fontSize: 13, color: "#fff",
            outline: "none", marginBottom: 16,
          }}
        />

        {/* Progress */}
        {isGenerating && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs" style={{ color: "#ffffff60" }}>{genStatus}</span>
              <span className="text-xs font-semibold" style={{ color: "#2ffe1d" }}>{genProgress}%</span>
            </div>
            <ProgressBar value={genProgress} height={8} />
          </div>
        )}

        {genError && (
          <p className="mb-3 text-xs text-center" style={{ color: "#f87171" }}>{genError}</p>
        )}

        <button
          className="btn-press w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
          style={{
            background: isGenerating ? "#1a1a1a" : "#2ffe1d",
            color: isGenerating ? "#2ffe1d" : "#000",
          }}
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          {isGenerating ? "Gerando dieta..." : "Gerar Dieta com IA"}
        </button>
      </div>
    </div>
    </PageWrapper>
  );
}

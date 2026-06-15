"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import type { UserProfile } from "@/types";

const GREEN = "#2ffe1d";

const OBJETIVOS: { value: UserProfile["objetivo"]; label: string; desc: string; icon: string }[] = [
  { value: "hipertrofia",     label: "Ganhar Massa",    desc: "Aumentar músculos e força",      icon: "💪" },
  { value: "emagrecimento",   label: "Emagrecer",       desc: "Queimar gordura e definir",       icon: "🔥" },
  { value: "condicionamento", label: "Condicionamento", desc: "Melhorar saúde e resistência",    icon: "🏃" },
];

const NIVEIS: { value: UserProfile["nivel"]; label: string; desc: string }[] = [
  { value: "iniciante",     label: "Iniciante",     desc: "Menos de 6 meses de treino" },
  { value: "intermediario", label: "Intermediário", desc: "6 meses a 2 anos de treino" },
  { value: "avancado",      label: "Avançado",      desc: "Mais de 2 anos de treino" },
];

const METAS = [2, 3, 4, 5, 6];

const slide = {
  initial: (dir: number) => ({ x: dir * 60, opacity: 0 }),
  animate: { x: 0, opacity: 1, transition: { duration: 0.32, ease: "easeOut" as const } },
  exit:    (dir: number) => ({ x: dir * -60, opacity: 0, transition: { duration: 0.22, ease: "easeIn" as const } }),
};

interface Props {
  onDone: () => void;
}

export default function OnboardingScreen({ onDone }: Props) {
  const { setUserProfile } = useAppStore();

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [nome, setNome] = useState("");
  const [objetivo, setObjetivo] = useState<UserProfile["objetivo"] | null>(null);
  const [nivel, setNivel] = useState<UserProfile["nivel"] | null>(null);
  const [meta, setMeta] = useState(4);

  const TOTAL_STEPS = 5; // 0=boas-vindas, 1=nome, 2=objetivo, 3=nivel, 4=meta

  function next() {
    setDir(1);
    setStep((s) => s + 1);
  }

  function back() {
    setDir(-1);
    setStep((s) => s - 1);
  }

  function finish() {
    const profile: UserProfile = {
      nome: nome.trim() || "Atleta",
      objetivo: objetivo ?? "hipertrofia",
      nivel: nivel ?? "iniciante",
      metaSemanal: meta,
    };
    setUserProfile(profile);
    try { localStorage.setItem("fitpro_onboarded", "1"); } catch { /* ignore */ }
    onDone();
  }

  const canNext = [
    true,
    nome.trim().length > 0,
    objetivo !== null,
    nivel !== null,
    true,
  ][step] ?? true;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "#000",
        display: "flex", flexDirection: "column",
        maxWidth: 480, marginLeft: "auto", marginRight: "auto",
      }}
    >
      {/* Progress dots */}
      {step > 0 && step < TOTAL_STEPS && (
        <div style={{ display: "flex", gap: 6, justifyContent: "center", paddingTop: 20, paddingBottom: 4 }}>
          {Array.from({ length: TOTAL_STEPS - 1 }, (_, i) => (
            <div
              key={i}
              style={{
                width: i === step - 1 ? 20 : 6,
                height: 6,
                borderRadius: 999,
                background: i < step ? GREEN : "#2b2b2b",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>
      )}

      {/* Step content */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <AnimatePresence mode="wait" custom={dir}>
          {step === 0 && (
            <motion.div key="welcome" custom={dir} variants={slide} initial="initial" animate="animate" exit="exit"
              style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px" }}
            >
              {/* Logo */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, transition: { delay: 0.1, duration: 0.5, ease: [0.22, 0.9, 0.4, 1] } }}
                style={{
                  width: 100, height: 100, borderRadius: 28,
                  background: "rgba(47,254,29,0.1)",
                  border: `2px solid rgba(47,254,29,0.35)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 28,
                  boxShadow: "0 0 40px rgba(47,254,29,0.2)",
                }}
              >
                <svg viewBox="0 0 512 512" width="58" height="58">
                  <rect x="72" y="176" width="64" height="160" rx="16" fill={GREEN}/>
                  <rect x="136" y="228" width="56" height="56" rx="12" fill={GREEN}/>
                  <rect x="192" y="240" width="128" height="32" rx="16" fill={GREEN}/>
                  <rect x="320" y="228" width="56" height="56" rx="12" fill={GREEN}/>
                  <rect x="376" y="176" width="64" height="160" rx="16" fill={GREEN}/>
                </svg>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.4 } }}
                style={{ fontSize: 32, fontWeight: 900, color: "#fff", textAlign: "center", marginBottom: 12, lineHeight: 1.15 }}
              >
                Bem-vindo ao<br /><span style={{ color: GREEN }}>FitPro</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.38, duration: 0.4 } }}
                style={{ color: "#ffffff60", textAlign: "center", fontSize: 15, lineHeight: 1.6, marginBottom: 48 }}
              >
                Seu coach pessoal de treinos e dieta. Vamos configurar tudo para o seu perfil em menos de 1 minuto.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.35 } }}
                onClick={next}
                style={{
                  width: "100%", padding: "16px 0",
                  background: GREEN, color: "#000",
                  border: "none", borderRadius: 16,
                  fontSize: 16, fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: `0 0 24px rgba(47,254,29,0.4)`,
                }}
              >
                Vamos comecar!
              </motion.button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="nome" custom={dir} variants={slide} initial="initial" animate="animate" exit="exit"
              style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: "24px 24px 32px" }}
            >
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <p style={{ color: "#ffffff50", fontSize: 13, fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Passo 1 de 4</p>
                <h2 style={{ fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 8 }}>Como voce se chama?</h2>
                <p style={{ color: "#ffffff50", fontSize: 14, marginBottom: 32 }}>Vamos personalizar sua experiencia</p>

                <input
                  autoFocus
                  type="text"
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && nome.trim() && next()}
                  style={{
                    width: "100%", padding: "16px 18px",
                    background: "#1e161e", border: `1.5px solid ${nome.trim() ? "rgba(47,254,29,0.5)" : "#2b2b2b"}`,
                    borderRadius: 14, color: "#fff", fontSize: 18, fontWeight: 700,
                    outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                />
              </div>
              <BottomButtons onBack={back} onNext={next} canNext={canNext} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="objetivo" custom={dir} variants={slide} initial="initial" animate="animate" exit="exit"
              style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: "24px 24px 32px" }}
            >
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <p style={{ color: "#ffffff50", fontSize: 13, fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Passo 2 de 4</p>
                <h2 style={{ fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 8 }}>Qual e seu objetivo?</h2>
                <p style={{ color: "#ffffff50", fontSize: 14, marginBottom: 28 }}>Isso vai definir seus treinos e dieta</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {OBJETIVOS.map((o) => {
                    const sel = objetivo === o.value;
                    return (
                      <button
                        key={o.value}
                        onClick={() => setObjetivo(o.value)}
                        style={{
                          display: "flex", alignItems: "center", gap: 16,
                          padding: "16px 18px",
                          background: sel ? "rgba(47,254,29,0.08)" : "#1e161e",
                          border: `1.5px solid ${sel ? "rgba(47,254,29,0.5)" : "#2b2b2b"}`,
                          borderRadius: 14, cursor: "pointer", textAlign: "left",
                          transition: "all 0.18s",
                        }}
                      >
                        <span style={{ fontSize: 28 }}>{o.icon}</span>
                        <div>
                          <p style={{ color: sel ? GREEN : "#fff", fontWeight: 700, fontSize: 16, margin: 0 }}>{o.label}</p>
                          <p style={{ color: "#ffffff50", fontSize: 13, margin: 0 }}>{o.desc}</p>
                        </div>
                        {sel && (
                          <div style={{ marginLeft: "auto", width: 22, height: 22, borderRadius: 999, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              <BottomButtons onBack={back} onNext={next} canNext={canNext} />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="nivel" custom={dir} variants={slide} initial="initial" animate="animate" exit="exit"
              style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: "24px 24px 32px" }}
            >
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <p style={{ color: "#ffffff50", fontSize: 13, fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Passo 3 de 4</p>
                <h2 style={{ fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 8 }}>Qual e sua experiencia?</h2>
                <p style={{ color: "#ffffff50", fontSize: 14, marginBottom: 28 }}>Vamos adaptar a intensidade para voce</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {NIVEIS.map((n) => {
                    const sel = nivel === n.value;
                    return (
                      <button
                        key={n.value}
                        onClick={() => setNivel(n.value)}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "16px 18px",
                          background: sel ? "rgba(47,254,29,0.08)" : "#1e161e",
                          border: `1.5px solid ${sel ? "rgba(47,254,29,0.5)" : "#2b2b2b"}`,
                          borderRadius: 14, cursor: "pointer", textAlign: "left",
                          transition: "all 0.18s",
                        }}
                      >
                        <div>
                          <p style={{ color: sel ? GREEN : "#fff", fontWeight: 700, fontSize: 16, margin: 0 }}>{n.label}</p>
                          <p style={{ color: "#ffffff50", fontSize: 13, margin: 0 }}>{n.desc}</p>
                        </div>
                        <div style={{
                          width: 22, height: 22, borderRadius: 999,
                          background: sel ? GREEN : "#2b2b2b",
                          border: sel ? "none" : "2px solid #3a3a3a",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.18s",
                        }}>
                          {sel && <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <BottomButtons onBack={back} onNext={next} canNext={canNext} />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="meta" custom={dir} variants={slide} initial="initial" animate="animate" exit="exit"
              style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: "24px 24px 32px" }}
            >
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <p style={{ color: "#ffffff50", fontSize: 13, fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Passo 4 de 4</p>
                <h2 style={{ fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 8 }}>Meta semanal</h2>
                <p style={{ color: "#ffffff50", fontSize: 14, marginBottom: 36 }}>Quantos dias por semana voce quer treinar?</p>

                <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 32 }}>
                  {METAS.map((d) => {
                    const sel = meta === d;
                    return (
                      <button
                        key={d}
                        onClick={() => setMeta(d)}
                        style={{
                          width: 52, height: 64,
                          background: sel ? GREEN : "#1e161e",
                          border: `1.5px solid ${sel ? GREEN : "#2b2b2b"}`,
                          borderRadius: 14, cursor: "pointer",
                          color: sel ? "#000" : "#ffffff80",
                          fontWeight: 800, fontSize: 20,
                          transition: "all 0.18s",
                          boxShadow: sel ? `0 0 18px rgba(47,254,29,0.4)` : "none",
                        }}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
                <p style={{ textAlign: "center", color: "#ffffff40", fontSize: 13 }}>
                  {meta === 2 ? "Manutencao leve" : meta === 3 ? "Padrao recomendado" : meta <= 4 ? "Otimo para resultados" : meta === 5 ? "Dedicado" : "Atleta de alta performance"}
                </p>

                {/* Preview card */}
                <div style={{
                  marginTop: 32, padding: "18px 20px",
                  background: "rgba(47,254,29,0.05)",
                  border: "1px solid rgba(47,254,29,0.2)",
                  borderRadius: 16,
                }}>
                  <p style={{ color: "#ffffff40", fontSize: 12, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Resumo do perfil</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <Row label="Nome" value={nome.trim() || "Atleta"} />
                    <Row label="Objetivo" value={OBJETIVOS.find(o => o.value === objetivo)?.label ?? "—"} />
                    <Row label="Nivel" value={NIVEIS.find(n => n.value === nivel)?.label ?? "—"} />
                    <Row label="Meta" value={`${meta}x por semana`} />
                  </div>
                </div>
              </div>
              <BottomButtons onBack={back} onNext={finish} canNext={true} nextLabel="Comecar!" isLast />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ color: "#ffffff50", fontSize: 13 }}>{label}</span>
      <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function BottomButtons({
  onBack, onNext, canNext, nextLabel = "Continuar", isLast = false,
}: {
  onBack: () => void;
  onNext: () => void;
  canNext: boolean;
  nextLabel?: string;
  isLast?: boolean;
}) {
  return (
    <div style={{ display: "flex", gap: 12, paddingTop: 16 }}>
      <button
        onClick={onBack}
        style={{
          width: 52, height: 52, borderRadius: 14,
          background: "#1e161e", border: "1px solid #2b2b2b",
          color: "#ffffff80", cursor: "pointer", fontSize: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button
        onClick={onNext}
        disabled={!canNext}
        style={{
          flex: 1, height: 52, borderRadius: 14,
          background: canNext ? (isLast ? GREEN : "#fff") : "#2b2b2b",
          border: "none",
          color: canNext ? "#000" : "#ffffff30",
          fontWeight: 800, fontSize: 16,
          cursor: canNext ? "pointer" : "not-allowed",
          transition: "all 0.2s",
          boxShadow: canNext && isLast ? "0 0 24px rgba(47,254,29,0.4)" : "none",
        }}
      >
        {nextLabel}
      </button>
    </div>
  );
}

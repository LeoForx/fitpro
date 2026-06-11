"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import type { UserProfile } from "@/types";

type Objetivo = UserProfile["objetivo"];
type Nivel = UserProfile["nivel"];
type FaixaEtaria = NonNullable<UserProfile["faixaEtaria"]>;

const OBJETIVOS: { id: Objetivo; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    id: "hipertrofia",
    label: "Hipertrofia",
    desc: "Ganhar massa muscular e força",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M6.5 9h1m0 6h-1M16.5 9h1m0 6h-1M8 12h8M4.5 9.5h3v5h-3zM16.5 9.5h3v5h-3z"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "emagrecimento",
    label: "Emagrecimento",
    desc: "Perder gordura e definir o corpo",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M12 2c0 0-2.5 3.5-2.5 6.5 0 1.3.5 2.5 1.3 3.3C9.8 10.5 8 9 8 6.5 5 8.5 4 13 7 16c1.3 1.5 3 2.5 5 2.5s3.7-1 5-2.5c3-3 2-7.5-1-9-.2 2.5-1.3 3.8-3 5C15 9.5 12 2 12 2z"
          stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "condicionamento",
    label: "Condicionamento",
    desc: "Melhorar saúde e resistência",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <polyline points="2,12 6,12 9,5 12,19 15,9 18,12 22,12"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

const NIVEIS: { id: Nivel; label: string; desc: string; bars: number }[] = [
  { id: "iniciante",    label: "Iniciante",     desc: "Menos de 1 ano de treino",  bars: 1 },
  { id: "intermediario",label: "Intermediário", desc: "De 1 a 3 anos de treino",   bars: 2 },
  { id: "avancado",     label: "Avançado",      desc: "Mais de 3 anos de treino",  bars: 3 },
];

const METAS = [2, 3, 4, 5, 6];

const FAIXAS_ETARIAS: { id: FaixaEtaria; label: string; desc: string }[] = [
  { id: "16-25", label: "16 – 25 anos", desc: "Alta recuperação, ótimo para volume" },
  { id: "26-35", label: "26 – 35 anos", desc: "Pico de desempenho, treino intenso" },
  { id: "36-45", label: "36 – 45 anos", desc: "Equilíbrio entre intensidade e recuperação" },
  { id: "46-55", label: "46 – 55 anos", desc: "Foco em mobilidade e cargas moderadas" },
  { id: "56+",   label: "56+ anos",     desc: "Preservação muscular e saúde articular" },
];

const OBJETIVO_LABELS: Record<Objetivo, string> = {
  hipertrofia: "Hipertrofia",
  emagrecimento: "Emagrecimento",
  condicionamento: "Condicionamento",
};

const NIVEL_LABELS: Record<Nivel, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

// ——— MAIN ———

export default function OnboardingPage() {
  const router = useRouter();
  const { setUserProfile } = useAppStore();

  const [step, setStep] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const [nome, setNome] = useState("");
  const [faixaEtaria, setFaixaEtaria] = useState<FaixaEtaria | null>(null);
  const [objetivo, setObjetivo] = useState<Objetivo | null>(null);
  const [nivel, setNivel] = useState<Nivel | null>(null);
  const [meta, setMeta] = useState(4);

  useEffect(() => {
    if (localStorage.getItem("fitpro_onboarded")) {
      router.replace("/");
    }
  }, [router]);

  const goTo = (s: number) => {
    setAnimKey((k) => k + 1);
    setStep(s);
  };

  const handleFinish = () => {
    setUserProfile({
      nome: nome.trim() || "Atleta",
      objetivo: objetivo!,
      nivel: nivel!,
      metaSemanal: meta,
      faixaEtaria: faixaEtaria ?? undefined,
    });
    localStorage.setItem("fitpro_onboarded", "1");
    router.replace("/");
  };

  const showProgress = step >= 1 && step <= 5;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
        display: "flex",
        flexDirection: "column",
        maxWidth: 480,
        margin: "0 auto",
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {/* Progress header */}
      {showProgress && (
        <div style={{ padding: "16px 24px 0", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <button
              className="btn-press"
              onClick={() => goTo(step - 1)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "none", border: "none", color: "#ffffff50", fontSize: 14, padding: 4,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Voltar
            </button>
            <span style={{ fontSize: 12, color: "#ffffff30" }}>{step} de 5</span>
          </div>
          <div style={{ height: 3, background: "#1a1a1a", borderRadius: 999, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${(step / 5) * 100}%`,
              background: "linear-gradient(90deg, #1dfe52, #2ffe1d)",
              borderRadius: 999,
              transition: "width 0.4s cubic-bezier(0.22, 0.9, 0.4, 1)",
            }} />
          </div>
        </div>
      )}

      {/* Step content */}
      <div
        key={animKey}
        className="onb-enter"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "24px 24px 40px",
          overflowY: "auto",
        }}
      >
        {step === 0 && <StepWelcome onNext={() => goTo(1)} />}
        {step === 1 && <StepNome nome={nome} setNome={setNome} onNext={() => goTo(2)} />}
        {step === 2 && (
          <StepFaixaEtaria
            value={faixaEtaria}
            onChange={(v) => { setFaixaEtaria(v); setTimeout(() => goTo(3), 300); }}
          />
        )}
        {step === 3 && (
          <StepObjetivo
            value={objetivo}
            onChange={(v) => { setObjetivo(v); setTimeout(() => goTo(4), 300); }}
          />
        )}
        {step === 4 && (
          <StepNivel
            value={nivel}
            onChange={(v) => { setNivel(v); setTimeout(() => goTo(5), 300); }}
          />
        )}
        {step === 5 && <StepMeta value={meta} onChange={setMeta} onNext={() => goTo(6)} />}
        {step === 6 && (
          <StepPronto
            nome={nome.trim() || "Atleta"}
            objetivo={objetivo!}
            nivel={nivel!}
            meta={meta}
            faixaEtaria={faixaEtaria}
            onFinish={handleFinish}
          />
        )}
      </div>
    </div>
  );
}

// ——— STEPS ———

function StepWelcome({ onNext }: { onNext: () => void }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div style={{
        width: 96, height: 96, borderRadius: "50%",
        background: "rgba(47,254,29,0.08)",
        border: "2px solid rgba(47,254,29,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 32,
        animation: "pulseGlow 2s ease-in-out infinite",
        boxShadow: "0 0 40px rgba(47,254,29,0.12)",
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M6 4v16M18 4v16M6 8H4a1 1 0 00-1 1v6a1 1 0 001 1h2M18 8h2a1 1 0 011 1v6a1 1 0 01-1 1h-2M6 12h12"
            stroke="#2ffe1d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <p style={{ fontSize: 12, color: "#2ffe1d", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>
        FitPro
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.15, marginBottom: 16, letterSpacing: "-0.5px" }}>
        Seu coach de<br />treinos com IA
      </h1>
      <p style={{ fontSize: 15, color: "#ffffff55", lineHeight: 1.65, maxWidth: 280, marginBottom: 52 }}>
        Planos personalizados, acompanhamento em tempo real e suporte nutricional.
      </p>

      <button
        className="btn-press"
        onClick={onNext}
        style={{
          width: "100%", padding: "16px", borderRadius: 16,
          background: "#2ffe1d", color: "#000", fontWeight: 800, fontSize: 16,
          border: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}
      >
        Começar agora
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M12 5l7 7-7 7" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

function StepNome({ nome, setNome, onNext }: { nome: string; setNome: (v: string) => void; onNext: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 350);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: 8 }}>
      <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>Como você<br />se chama?</h2>
      <p style={{ fontSize: 14, color: "#ffffff45", marginBottom: 36 }}>Seu coach vai te chamar pelo nome.</p>

      <input
        ref={inputRef}
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && nome.trim() && onNext()}
        placeholder="Seu nome..."
        autoComplete="given-name"
        style={{
          background: "#1e161e",
          border: "1.5px solid rgba(47,254,29,0.25)",
          borderRadius: 14,
          padding: "16px 18px",
          fontSize: 18,
          color: "#fff",
          outline: "none",
          width: "100%",
          marginBottom: 16,
          fontFamily: "inherit",
          fontWeight: 600,
        }}
      />

      <div style={{ flex: 1 }} />

      <button
        className="btn-press"
        onClick={onNext}
        disabled={!nome.trim()}
        style={{
          width: "100%", padding: "16px", borderRadius: 16,
          background: nome.trim() ? "#2ffe1d" : "#1a1a1a",
          color: nome.trim() ? "#000" : "#555",
          fontWeight: 700, fontSize: 15,
          border: nome.trim() ? "none" : "1px solid #2b2b2b",
        }}
      >
        Continuar
      </button>
    </div>
  );
}

function StepFaixaEtaria({ value, onChange }: { value: FaixaEtaria | null; onChange: (v: FaixaEtaria) => void }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: 8 }}>
      <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>Qual sua<br />faixa etária?</h2>
      <p style={{ fontSize: 14, color: "#ffffff45", marginBottom: 32 }}>Ajusta carga e intensidade para sua idade.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {FAIXAS_ETARIAS.map((f) => {
          const selected = value === f.id;
          return (
            <button
              key={f.id}
              className="btn-press"
              onClick={() => onChange(f.id)}
              style={{
                background: selected ? "rgba(47,254,29,0.1)" : "#1e161e",
                border: `1.5px solid ${selected ? "rgba(47,254,29,0.45)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 16, padding: "16px 20px",
                display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left",
                transition: "background 0.18s, border-color 0.18s",
              }}
            >
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, color: selected ? "#fff" : "#ffffffbb", marginBottom: 3 }}>{f.label}</p>
                <p style={{ fontSize: 12, color: "#ffffff45" }}>{f.desc}</p>
              </div>
              {selected && (
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", background: "#2ffe1d",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M4 12l5 5 11-11" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepObjetivo({ value, onChange }: { value: Objetivo | null; onChange: (v: Objetivo) => void }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: 8 }}>
      <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>Qual é seu<br />objetivo?</h2>
      <p style={{ fontSize: 14, color: "#ffffff45", marginBottom: 32 }}>Define seu plano personalizado.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {OBJETIVOS.map((obj) => {
          const selected = value === obj.id;
          return (
            <button
              key={obj.id}
              className="btn-press"
              onClick={() => onChange(obj.id)}
              style={{
                background: selected ? "rgba(47,254,29,0.1)" : "#1e161e",
                border: `1.5px solid ${selected ? "rgba(47,254,29,0.45)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 16, padding: "18px 20px",
                display: "flex", alignItems: "center", gap: 16, textAlign: "left",
                transition: "background 0.18s, border-color 0.18s",
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: selected ? "rgba(47,254,29,0.12)" : "#1a1a1a",
                border: `1px solid ${selected ? "rgba(47,254,29,0.35)" : "#2b2b2b"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: selected ? "#2ffe1d" : "#555",
                transition: "background 0.18s, color 0.18s",
              }}>
                {obj.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 15, color: selected ? "#fff" : "#ffffffbb", marginBottom: 3 }}>{obj.label}</p>
                <p style={{ fontSize: 12, color: "#ffffff45" }}>{obj.desc}</p>
              </div>
              {selected && (
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", background: "#2ffe1d",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M4 12l5 5 11-11" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepNivel({ value, onChange }: { value: Nivel | null; onChange: (v: Nivel) => void }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: 8 }}>
      <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>Qual é seu<br />nível?</h2>
      <p style={{ fontSize: 14, color: "#ffffff45", marginBottom: 32 }}>Ajusta a intensidade dos treinos.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {NIVEIS.map((n) => {
          const selected = value === n.id;
          return (
            <button
              key={n.id}
              className="btn-press"
              onClick={() => onChange(n.id)}
              style={{
                background: selected ? "rgba(47,254,29,0.1)" : "#1e161e",
                border: `1.5px solid ${selected ? "rgba(47,254,29,0.45)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 16, padding: "18px 20px",
                display: "flex", alignItems: "center", gap: 16, textAlign: "left",
                transition: "background 0.18s, border-color 0.18s",
              }}
            >
              {/* Bar level icon */}
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: selected ? "rgba(47,254,29,0.1)" : "#1a1a1a",
                border: `1px solid ${selected ? "rgba(47,254,29,0.35)" : "#2b2b2b"}`,
                display: "flex", alignItems: "flex-end", justifyContent: "center",
                gap: 4, padding: "10px 11px",
                transition: "background 0.18s",
              }}>
                {[1, 2, 3].map((b) => (
                  <div key={b} style={{
                    width: 7,
                    height: b === 1 ? 10 : b === 2 ? 17 : 24,
                    borderRadius: 3,
                    background: b <= n.bars
                      ? (selected ? "#2ffe1d" : "rgba(47,254,29,0.35)")
                      : "#2b2b2b",
                    transition: "background 0.18s",
                  }} />
                ))}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 15, color: selected ? "#fff" : "#ffffffbb", marginBottom: 3 }}>{n.label}</p>
                <p style={{ fontSize: 12, color: "#ffffff45" }}>{n.desc}</p>
              </div>
              {selected && (
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", background: "#2ffe1d",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M4 12l5 5 11-11" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepMeta({ value, onChange, onNext }: { value: number; onChange: (v: number) => void; onNext: () => void }) {
  const hint =
    value <= 3 ? "Ótimo para manter consistência"
    : value === 4 ? "Recomendado para a maioria"
    : "Alta frequência — descanse bem entre sessões";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: 8 }}>
      <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>Quantos treinos<br />por semana?</h2>
      <p style={{ fontSize: 14, color: "#ffffff45", marginBottom: 48 }}>Define sua meta semanal.</p>

      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
        {METAS.map((m) => {
          const selected = value === m;
          return (
            <button
              key={m}
              className="btn-press"
              onClick={() => onChange(m)}
              style={{
                width: 52, height: 64, borderRadius: 14,
                background: selected ? "#2ffe1d" : "#1e161e",
                border: `1.5px solid ${selected ? "transparent" : "rgba(255,255,255,0.06)"}`,
                color: selected ? "#000" : "#ffffff70",
                fontWeight: 800, fontSize: 22,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.18s, color 0.18s",
              }}
            >
              {m}
            </button>
          );
        })}
      </div>

      <p style={{ textAlign: "center", fontSize: 13, color: "#ffffff35", marginBottom: 48 }}>{hint}</p>

      <div style={{ flex: 1 }} />

      <button
        className="btn-press"
        onClick={onNext}
        style={{
          width: "100%", padding: "16px", borderRadius: 16,
          background: "#2ffe1d", color: "#000", fontWeight: 800, fontSize: 16, border: "none",
        }}
      >
        Criar meu plano
      </button>
    </div>
  );
}

function StepPronto({ nome, objetivo, nivel, meta, faixaEtaria, onFinish }: {
  nome: string; objetivo: Objetivo; nivel: Nivel; meta: number; faixaEtaria: FaixaEtaria | null; onFinish: () => void;
}) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div
        className="check-circle"
        style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "rgba(47,254,29,0.1)",
          border: "2px solid #2ffe1d",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 28,
          boxShadow: "0 0 40px rgba(47,254,29,0.25)",
        }}
      >
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
          <path className="check-path" d="M4 12l5 5 11-11" stroke="#2ffe1d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>
        Tudo pronto,<br />
        <span style={{ color: "#2ffe1d" }}>{nome}!</span>
      </h2>
      <p style={{ fontSize: 14, color: "#ffffff45", marginBottom: 40 }}>
        Seu plano personalizado está configurado.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 48, width: "100%", flexWrap: "wrap" }}>
        {[
          { label: "Objetivo", value: OBJETIVO_LABELS[objetivo] },
          { label: "Nível",    value: NIVEL_LABELS[nivel] },
          { label: "Meta",     value: `${meta}x/sem` },
          ...(faixaEtaria ? [{ label: "Idade", value: faixaEtaria }] : []),
        ].map((item) => (
          <div
            key={item.label}
            style={{
              flex: 1, background: "#1e161e",
              border: "1px solid rgba(47,254,29,0.1)",
              borderRadius: 14, padding: "14px 8px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            }}
          >
            <p style={{ fontSize: 11, color: "#ffffff35", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.label}</p>
            <p style={{ fontSize: 13, color: "#fff", fontWeight: 700, textAlign: "center", lineHeight: 1.3 }}>{item.value}</p>
          </div>
        ))}
      </div>

      <button
        className="btn-press"
        onClick={onFinish}
        style={{
          width: "100%", padding: "16px", borderRadius: 16,
          background: "#2ffe1d", color: "#000", fontWeight: 800, fontSize: 16,
          border: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}
      >
        Ir para o Dashboard
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M12 5l7 7-7 7" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import type { UserProfile } from "@/types";

type FaixaEtaria = NonNullable<UserProfile["faixaEtaria"]>;

const FAIXAS_ETARIAS: { id: FaixaEtaria; label: string }[] = [
  { id: "16-25", label: "16–25" },
  { id: "26-35", label: "26–35" },
  { id: "36-45", label: "36–45" },
  { id: "46-55", label: "46–55" },
  { id: "56+",   label: "56+" },
];

const ALL_KEYS = [
  "fitpro_onboarded",
  "fitpro_user_profile",
  "fitpro_workout_history",
  "fitpro_meals",
  "fitpro_reminder",
  "fitpro_modules",
];

interface Props {
  open: boolean;
  onClose: () => void;
}

const OBJETIVOS: { id: UserProfile["objetivo"]; label: string; desc: string }[] = [
  { id: "hipertrofia",    label: "Hipertrofia",     desc: "Ganhar massa e força" },
  { id: "emagrecimento",  label: "Emagrecimento",   desc: "Perder gordura e definir" },
  { id: "condicionamento",label: "Condicionamento", desc: "Saúde e resistência" },
];

const NIVEIS: { id: UserProfile["nivel"]; label: string; desc: string }[] = [
  { id: "iniciante",    label: "Iniciante",     desc: "Menos de 1 ano" },
  { id: "intermediario",label: "Intermediário", desc: "1 a 3 anos" },
  { id: "avancado",     label: "Avançado",      desc: "Mais de 3 anos" },
];

export default function ProfileSheet({ open, onClose }: Props) {
  const { userProfile, setUserProfile } = useAppStore();
  const router = useRouter();

  const [nome,        setNome]        = useState("");
  const [objetivo,    setObjetivo]    = useState<UserProfile["objetivo"]>("hipertrofia");
  const [nivel,       setNivel]       = useState<UserProfile["nivel"]>("intermediario");
  const [metaSemanal, setMetaSemanal] = useState(4);
  const [faixaEtaria, setFaixaEtaria] = useState<FaixaEtaria | null>(null);
  const [saved,       setSaved]       = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = () => {
    ALL_KEYS.forEach((k) => localStorage.removeItem(k));
    window.location.href = "/onboarding";
  };

  useEffect(() => {
    if (open && userProfile) {
      setNome(userProfile.nome);
      setObjetivo(userProfile.objetivo);
      setNivel(userProfile.nivel);
      setMetaSemanal(userProfile.metaSemanal);
      setFaixaEtaria(userProfile.faixaEtaria ?? null);
    }
  }, [open, userProfile]);

  const handleSave = () => {
    setUserProfile({ nome: nome.trim(), objetivo, nivel, metaSemanal, faixaEtaria: faixaEtaria ?? undefined });
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="backdrop-in"
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.7)" }}
      />

      {/* Sheet */}
      <div
        className="sheet-enter"
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 201,
          background: "#111",
          borderRadius: "20px 20px 0 0",
          border: "1px solid rgba(47,254,29,0.1)",
          borderBottom: "none",
          maxWidth: 480, margin: "0 auto",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          maxHeight: "92dvh",
          overflowY: "scroll",
          WebkitOverflowScrolling: "touch" as never,
        }}
      >
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#2b2b2b" }} />
        </div>

        <div style={{ padding: "8px 20px 28px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <p style={{ fontWeight: 800, fontSize: 17 }}>Meu Perfil</p>
              <p style={{ fontSize: 12, color: "#ffffff40", marginTop: 2 }}>Edite suas informações</p>
            </div>
            <button
              className="btn-press"
              onClick={onClose}
              style={{ width: 32, height: 32, borderRadius: "50%", background: "#1e161e", border: "1px solid #2b2b2b", color: "#ffffff60", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Nome */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12, color: "#ffffff50", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Nome</p>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              style={{
                width: "100%", background: "#1e161e",
                border: "1px solid rgba(47,254,29,0.2)", borderRadius: 12,
                padding: "12px 14px", fontSize: 15, color: "#fff",
                outline: "none",
              }}
            />
          </div>

          {/* Objetivo */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12, color: "#ffffff50", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Objetivo</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {OBJETIVOS.map((o) => {
                const active = objetivo === o.id;
                return (
                  <button
                    key={o.id}
                    className="btn-press"
                    onClick={() => setObjetivo(o.id)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 14px", borderRadius: 12,
                      background: active ? "rgba(47,254,29,0.08)" : "#1a1a1a",
                      border: `1.5px solid ${active ? "rgba(47,254,29,0.4)" : "#2b2b2b"}`,
                      textAlign: "left",
                    }}
                  >
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: active ? "#2ffe1d" : "#fff" }}>{o.label}</p>
                      <p style={{ fontSize: 11, color: "#ffffff40", marginTop: 1 }}>{o.desc}</p>
                    </div>
                    {active && (
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#2ffe1d", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                          <path d="M4 12l5 5 11-11" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nível */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12, color: "#ffffff50", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Nível de Treino</p>
            <div style={{ display: "flex", gap: 8 }}>
              {NIVEIS.map((n) => {
                const active = nivel === n.id;
                return (
                  <button
                    key={n.id}
                    className="btn-press"
                    onClick={() => setNivel(n.id)}
                    style={{
                      flex: 1, padding: "10px 6px", borderRadius: 12,
                      background: active ? "rgba(47,254,29,0.08)" : "#1a1a1a",
                      border: `1.5px solid ${active ? "rgba(47,254,29,0.4)" : "#2b2b2b"}`,
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                    }}
                  >
                    <p style={{ fontSize: 12, fontWeight: 700, color: active ? "#2ffe1d" : "#fff" }}>{n.label}</p>
                    <p style={{ fontSize: 10, color: "#ffffff40" }}>{n.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Faixa etária */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12, color: "#ffffff50", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Faixa Etária</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {FAIXAS_ETARIAS.map((f) => {
                const active = faixaEtaria === f.id;
                return (
                  <button
                    key={f.id}
                    className="btn-press"
                    onClick={() => setFaixaEtaria(f.id)}
                    style={{
                      flex: "1 1 auto", minWidth: 60, height: 44, borderRadius: 12,
                      background: active ? "rgba(47,254,29,0.12)" : "#1a1a1a",
                      border: `1.5px solid ${active ? "rgba(47,254,29,0.5)" : "#2b2b2b"}`,
                      color: active ? "#2ffe1d" : "#ffffff60",
                      fontSize: 13, fontWeight: 700,
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Meta semanal */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 12, color: "#ffffff50", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
              Meta semanal — <span style={{ color: "#2ffe1d" }}>{metaSemanal}x por semana</span>
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {[2, 3, 4, 5, 6].map((v) => {
                const active = metaSemanal === v;
                return (
                  <button
                    key={v}
                    className="btn-press"
                    onClick={() => setMetaSemanal(v)}
                    style={{
                      flex: 1, height: 44, borderRadius: 12,
                      background: active ? "rgba(47,254,29,0.12)" : "#1a1a1a",
                      border: `1.5px solid ${active ? "rgba(47,254,29,0.5)" : "#2b2b2b"}`,
                      color: active ? "#2ffe1d" : "#ffffff60",
                      fontSize: 16, fontWeight: 800,
                    }}
                  >
                    {v}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save */}
          <button
            className="btn-press"
            onClick={handleSave}
            style={{
              width: "100%", padding: "14px 0", borderRadius: 14,
              fontWeight: 700, fontSize: 15,
              background: saved ? "#1a4a00" : "#2ffe1d",
              color: saved ? "#2ffe1d" : "#000",
              border: saved ? "1px solid rgba(47,254,29,0.4)" : "none",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            {saved ? "Salvo! ✓" : "Salvar alterações"}
          </button>

          {/* Reset */}
          <div style={{ marginTop: 16, borderTop: "1px solid #1e1e1e", paddingTop: 16 }}>
            {!confirmReset ? (
              <button
                className="btn-press"
                onClick={() => setConfirmReset(true)}
                style={{
                  width: "100%", padding: "12px 0", borderRadius: 14,
                  fontWeight: 600, fontSize: 13,
                  background: "transparent", color: "#f87171",
                  border: "1px solid rgba(248,113,113,0.2)",
                }}
              >
                Resetar conta
              </button>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <p style={{ fontSize: 12, color: "#ffffff60", textAlign: "center" }}>
                  Isso apaga todos os dados. Tem certeza?
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn-press"
                    onClick={() => setConfirmReset(false)}
                    style={{ flex: 1, padding: "12px 0", borderRadius: 14, fontWeight: 600, fontSize: 13, background: "#1a1a1a", color: "#fff", border: "1px solid #2b2b2b" }}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn-press"
                    onClick={handleReset}
                    style={{ flex: 1, padding: "12px 0", borderRadius: 14, fontWeight: 700, fontSize: 13, background: "rgba(248,113,113,0.15)", color: "#f87171", border: "1px solid rgba(248,113,113,0.4)" }}
                  >
                    Sim, resetar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

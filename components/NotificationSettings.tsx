"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ReminderConfig {
  enabled: boolean;
  hour: number;
  minute: number;
  days: number[]; // 0=Dom … 6=Sáb
}

const DEFAULT_CONFIG: ReminderConfig = {
  enabled: false,
  hour: 19,
  minute: 0,
  days: [1, 2, 3, 4, 5],
};

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

interface Props {
  open: boolean;
  onClose: () => void;
}

// ——— Scheduling helpers ———

async function showPushNotification(title: string, body: string) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(title, {
        body,
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        tag: "fitpro-reminder",
      } as NotificationOptions);
      return;
    } catch {
      // fall through to Notification API
    }
  }
  new Notification(title, { body, icon: "/icon-192.png" });
}

let scheduledTimer: ReturnType<typeof setTimeout> | null = null;

function cancelScheduled() {
  if (scheduledTimer !== null) {
    clearTimeout(scheduledTimer);
    scheduledTimer = null;
  }
}

export function scheduleReminder(cfg: ReminderConfig) {
  cancelScheduled();
  if (!cfg.enabled || cfg.days.length === 0) return;

  const now = new Date();
  let next: Date | null = null;

  for (let i = 0; i < 8; i++) {
    const candidate = new Date(now);
    candidate.setDate(candidate.getDate() + i);
    candidate.setHours(cfg.hour, cfg.minute, 0, 0);
    if (cfg.days.includes(candidate.getDay()) && candidate.getTime() > now.getTime()) {
      next = candidate;
      break;
    }
  }

  if (!next) return;

  const delay = next.getTime() - Date.now();
  scheduledTimer = setTimeout(async () => {
    await showPushNotification("FitPro 💪", "Hora do treino! Bora lá!");
    scheduleReminder(cfg); // re-schedule for the next occurrence
  }, delay);
}

// ——— Component ———

export default function NotificationSettings({ open, onClose }: Props) {
  const [config, setConfig] = useState<ReminderConfig>(DEFAULT_CONFIG);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isStandalone, setIsStandalone] = useState(true);
  const [saved, setSaved] = useState(false);
  const [tested, setTested] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Load saved config
    const raw = localStorage.getItem("fitpro_reminder");
    if (raw) {
      try { setConfig(JSON.parse(raw)); } catch { /* ignore */ }
    }
    // Check permission
    if ("Notification" in window) setPermission(Notification.permission);
    // Check standalone
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches || (window.navigator as { standalone?: boolean }).standalone === true);
  }, [open]);

  const toggleDay = (day: number) => {
    setConfig((c) => ({
      ...c,
      days: c.days.includes(day) ? c.days.filter((d) => d !== day) : [...c.days, day],
    }));
  };

  const handleSave = async () => {
    // Request permission if not granted
    if ("Notification" in window && Notification.permission === "default") {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== "granted") {
        setConfig((c) => ({ ...c, enabled: false }));
        return;
      }
    }

    localStorage.setItem("fitpro_reminder", JSON.stringify(config));
    scheduleReminder(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTest = async () => {
    if ("Notification" in window && Notification.permission !== "granted") {
      await Notification.requestPermission();
      setPermission(Notification.permission);
    }
    await showPushNotification("FitPro 💪", "Teste de lembrete — tudo funcionando!");
    setTested(true);
    setTimeout(() => setTested(false), 2000);
  };

  const pad = (n: number) => String(n).padStart(2, "0");
  const isBlocked = permission === "denied";

  // Compute next reminder time for display
  const nextReminderLabel = (() => {
    if (!config.enabled || config.days.length === 0) return null;
    const now = new Date();
    for (let i = 0; i < 8; i++) {
      const c = new Date(now);
      c.setDate(c.getDate() + i);
      c.setHours(config.hour, config.minute, 0, 0);
      if (config.days.includes(c.getDay()) && c.getTime() > now.getTime()) {
        const diff = c.getTime() - now.getTime();
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const dayLabel = i === 0 ? "hoje" : i === 1 ? "amanhã" : DAY_LABELS[c.getDay()];
        return `${dayLabel} às ${pad(config.hour)}:${pad(config.minute)}${h < 24 ? ` (em ${h}h${m > 0 ? `${m}m` : ""})` : ""}`;
      }
    }
    return null;
  })();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="notif-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.7)" }}
          />

          {/* Sheet */}
          <motion.div
            key="notif-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0, transition: { type: "spring", stiffness: 320, damping: 30 } }}
            exit={{ y: "100%", transition: { duration: 0.22, ease: "easeIn" } }}
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0,
              zIndex: 201,
              background: "#111",
              borderRadius: "20px 20px 0 0",
              border: "1px solid rgba(47,254,29,0.1)",
              borderBottom: "none",
              maxWidth: 480,
              margin: "0 auto",
              maxHeight: "88vh",
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
            }}
          >
            {/* Handle */}
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "#2b2b2b" }} />
            </div>

            <div style={{ padding: "8px 20px 28px" }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 17 }}>Lembretes de Treino</p>
                  <p style={{ fontSize: 12, color: "#ffffff40", marginTop: 2 }}>Notificacao no horario escolhido</p>
                </div>
                <button className="btn-press" onClick={onClose}
                  style={{ width: 32, height: 32, borderRadius: "50%", background: "#1e161e", border: "1px solid #2b2b2b", color: "#ffffff60", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* iOS non-standalone warning */}
              {!isStandalone && (
                <div style={{ background: "rgba(250,204,21,0.08)", border: "1px solid rgba(250,204,21,0.25)", borderRadius: 12, padding: "10px 14px", marginBottom: 14, display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
                  <p style={{ fontSize: 12, color: "#facc15", lineHeight: 1.5 }}>
                    No iPhone, adicione o FitPro a tela inicial para receber notificacoes.
                  </p>
                </div>
              )}

              {/* Blocked warning */}
              {isBlocked && (
                <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 12, padding: "10px 14px", marginBottom: 14, display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>🚫</span>
                  <p style={{ fontSize: 12, color: "#f87171", lineHeight: 1.5 }}>
                    Notificacoes bloqueadas. Habilite nas configuracoes do navegador.
                  </p>
                </div>
              )}

              {/* Next reminder info */}
              {nextReminderLabel && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ background: "rgba(47,254,29,0.06)", border: "1px solid rgba(47,254,29,0.2)", borderRadius: 12, padding: "10px 14px", marginBottom: 14, display: "flex", gap: 10, alignItems: "center" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="#2ffe1d" strokeWidth="2"/>
                    <path d="M12 7v5l3 3" stroke="#2ffe1d" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <p style={{ fontSize: 12, color: "#2ffe1d", lineHeight: 1.4 }}>
                    Proximo lembrete: <strong>{nextReminderLabel}</strong>
                  </p>
                </motion.div>
              )}

              {/* Toggle */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#1e161e", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>Ativar lembrete</p>
                  <p style={{ fontSize: 11, color: "#ffffff40", marginTop: 2 }}>Receber notificacao no horario</p>
                </div>
                <button
                  className="btn-press"
                  onClick={() => setConfig((c) => ({ ...c, enabled: !c.enabled }))}
                  style={{
                    width: 48, height: 28, borderRadius: 14,
                    background: config.enabled ? "#2ffe1d" : "#2b2b2b",
                    position: "relative", border: "none",
                    transition: "background 0.2s", flexShrink: 0,
                  }}
                >
                  <div style={{
                    position: "absolute", top: 3, width: 22, height: 22, borderRadius: "50%", background: "#fff",
                    transition: "left 0.2s",
                    left: config.enabled ? "calc(100% - 25px)" : 3,
                  }} />
                </button>
              </div>

              <AnimatePresence>
                {config.enabled && (
                  <motion.div
                    key="notif-options"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto", transition: { duration: 0.25 } }}
                    exit={{ opacity: 0, height: 0, transition: { duration: 0.18 } }}
                    style={{ overflow: "hidden" }}
                  >
                    {/* Time picker */}
                    <div style={{ background: "#1e161e", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
                      <p style={{ fontSize: 12, color: "#ffffff50", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Horario</p>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <select
                          value={config.hour}
                          onChange={(e) => setConfig((c) => ({ ...c, hour: +e.target.value }))}
                          style={{ flex: 1, background: "#141414", border: "1px solid rgba(47,254,29,0.2)", borderRadius: 10, padding: "10px 12px", fontSize: 20, fontWeight: 700, color: "#fff", outline: "none", textAlign: "center" }}
                        >
                          {HOURS.map((h) => <option key={h} value={h}>{pad(h)}</option>)}
                        </select>
                        <span style={{ fontSize: 22, fontWeight: 800, color: "#2ffe1d" }}>:</span>
                        <select
                          value={config.minute}
                          onChange={(e) => setConfig((c) => ({ ...c, minute: +e.target.value }))}
                          style={{ flex: 1, background: "#141414", border: "1px solid rgba(47,254,29,0.2)", borderRadius: 10, padding: "10px 12px", fontSize: 20, fontWeight: 700, color: "#fff", outline: "none", textAlign: "center" }}
                        >
                          {MINUTES.map((m) => <option key={m} value={m}>{pad(m)}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Days of week */}
                    <div style={{ background: "#1e161e", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
                      <p style={{ fontSize: 12, color: "#ffffff50", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Dias da semana</p>
                      <div style={{ display: "flex", gap: 6 }}>
                        {DAY_LABELS.map((label, day) => {
                          const active = config.days.includes(day);
                          return (
                            <button
                              key={day}
                              className="btn-press"
                              onClick={() => toggleDay(day)}
                              style={{
                                flex: 1, height: 36, borderRadius: 8,
                                background: active ? "rgba(47,254,29,0.12)" : "#141414",
                                border: `1px solid ${active ? "rgba(47,254,29,0.4)" : "#2b2b2b"}`,
                                color: active ? "#2ffe1d" : "#555",
                                fontSize: 10, fontWeight: 700,
                                transition: "background 0.15s, color 0.15s",
                              }}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* How it works note */}
                    <div style={{ padding: "0 4px", marginBottom: 14 }}>
                      <p style={{ fontSize: 11, color: "#ffffff30", lineHeight: 1.6 }}>
                        O lembrete funciona enquanto o app esta aberto ou em segundo plano. Para notificacoes em segundo plano, instale o FitPro na tela inicial.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="btn-press"
                  onClick={handleTest}
                  style={{
                    flex: 1, padding: "13px 0", borderRadius: 14, fontWeight: 700, fontSize: 13,
                    background: "#1e161e", color: tested ? "#2ffe1d" : "#fff",
                    border: `1px solid ${tested ? "rgba(47,254,29,0.4)" : "rgba(255,255,255,0.08)"}`,
                    transition: "color 0.2s, border-color 0.2s",
                  }}
                >
                  {tested ? "Enviado! ✓" : "Testar agora"}
                </button>
                <button
                  className="btn-press"
                  onClick={handleSave}
                  style={{
                    flex: 2, padding: "13px 0", borderRadius: 14, fontWeight: 700, fontSize: 14,
                    background: saved ? "#1a4a00" : "#2ffe1d",
                    color: saved ? "#2ffe1d" : "#000",
                    border: saved ? "1px solid rgba(47,254,29,0.4)" : "none",
                    transition: "background 0.2s, color 0.2s",
                  }}
                >
                  {saved ? "Salvo! ✓" : "Salvar lembrete"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

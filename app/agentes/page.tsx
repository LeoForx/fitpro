"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import PageWrapper from "@/components/PageWrapper";

const QUICK_CHIPS = [
  "Criar treino para hoje",
  "Sugestão de dieta",
  "Dica de recuperação",
  "Progresso semanal",
  "Exercício para costas",
  "Receita pós-treino",
];

function CoachAvatar({ size = 8 }: { size?: number }) {
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center flex-shrink-0`}
      style={{ background: "rgba(47,254,29,0.1)", border: "1.5px solid rgba(47,254,29,0.3)" }}
    >
      <svg width={size * 1.8} height={size * 1.8} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="#2ffe1d" strokeWidth="2"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#2ffe1d" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <CoachAvatar size={8} />
      <div
        className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1"
        style={{ background: "#1e161e", border: "1px solid rgba(47,254,29,0.08)" }}
      >
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}

export default function AgentesPage() {
  const {
    agentMessages, isAgentTyping,
    addUserMessage, addAgentMessage, setAgentTyping,
    userProfile, treinosCompletos, streak, progressoSemanal, metaSemanal, workoutHistory,
  } = useAppStore();

  const [input, setInput]               = useState("");
  const [streamingText, setStreamingText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);
  const abortRef       = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [agentMessages, isAgentTyping, streamingText]);

  const handleSend = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || isAgentTyping) return;

    addUserMessage(msg);
    setInput("");
    setAgentTyping(true);
    setStreamingText("");

    // Build conversation history for the API (excluding the initial greeting if it's still there)
    const history = [
      ...agentMessages.filter((m) => m.id !== "1"), // skip initial mock greeting
      { id: "pending", role: "user", content: msg, timestamp: Date.now() },
    ];

    abortRef.current = new AbortController();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          messages: history,
          userProfile,
          stats: { treinosCompletos, streak, progressoSemanal, metaSemanal },
          workoutHistory,
        }),
      });

      if (!response.ok || !response.body) throw new Error("Erro ao conectar com o coach");

      const reader  = response.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setStreamingText(full);
      }
      full += decoder.decode();

      setStreamingText("");
      addAgentMessage(full || "Desculpe, não consegui processar sua mensagem. Tente novamente.");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setStreamingText("");
      addAgentMessage("Ops, tive um problema de conexão. Verifique sua internet e tente de novo.");
      setAgentTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <PageWrapper style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        className="px-4 py-4 flex items-center gap-3 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(47,254,29,0.08)", background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: "rgba(47,254,29,0.1)", border: "1.5px solid rgba(47,254,29,0.3)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="#2ffe1d" strokeWidth="2"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#2ffe1d" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="18" cy="6" r="3" fill="#2ffe1d"/>
            <path d="M17 5.5l.5 1 1-1.5" stroke="#000" strokeWidth="1" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <p className="font-bold text-sm">Coach FitPro</p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: isAgentTyping ? "#facc15" : "#2ffe1d" }} />
            <span className="text-xs" style={{ color: "#ffffff60" }}>
              {isAgentTyping ? "Digitando..." : "Online agora"}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col">
        <AnimatePresence initial={false}>
          {agentMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: [0.22, 0.9, 0.4, 1] }}
              className={`flex items-end gap-2 mb-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {msg.role === "agent" && <CoachAvatar size={8} />}
              <div
                className="max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
                style={
                  msg.role === "user"
                    ? { background: "rgba(47,254,29,0.12)", border: "1px solid rgba(47,254,29,0.2)", borderBottomRightRadius: 4, color: "#fff" }
                    : { background: "#1e161e", border: "1px solid rgba(47,254,29,0.08)", borderBottomLeftRadius: 4, color: "#fff", whiteSpace: "pre-wrap" }
                }
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Streaming bubble */}
        {streamingText && (
          <div className="flex items-end gap-2 mb-3">
            <CoachAvatar size={8} />
            <div
              className="max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
              style={{ background: "#1e161e", border: "1px solid rgba(47,254,29,0.08)", borderBottomLeftRadius: 4, color: "#fff", whiteSpace: "pre-wrap" }}
            >
              {streamingText}
              <span
                style={{ display: "inline-block", width: 2, height: "1em", background: "#2ffe1d", marginLeft: 2, verticalAlign: "text-bottom", animation: "pulseGlow 0.8s ease-in-out infinite" }}
              />
            </div>
          </div>
        )}

        {/* Typing indicator (while waiting for first token) */}
        {isAgentTyping && !streamingText && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick chips */}
      <div className="px-4 py-2 flex-shrink-0" style={{ borderTop: "1px solid rgba(47,254,29,0.06)" }}>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              className="chip btn-press"
              onClick={() => handleSend(chip)}
              disabled={isAgentTyping}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div
        className="px-4 pt-2 pb-3 flex-shrink-0 flex items-center gap-3"
        style={{ borderTop: "1px solid rgba(47,254,29,0.06)" }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pergunte ao seu coach..."
          className="flex-1 px-4 py-3 rounded-2xl text-sm outline-none"
          style={{ background: "#1e161e", border: "1px solid rgba(47,254,29,0.15)", color: "#fff" }}
          disabled={isAgentTyping}
        />
        <motion.button
          className="btn-press w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: input.trim() && !isAgentTyping ? "#2ffe1d" : "#1a1a1a",
            border: input.trim() && !isAgentTyping ? "none" : "1px solid #2b2b2b",
          }}
          onClick={() => handleSend()}
          whileTap={{ scale: 0.93 }}
          disabled={!input.trim() || isAgentTyping}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
              stroke={input.trim() && !isAgentTyping ? "#000" : "#666"}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      </div>
    </PageWrapper>
  );
}

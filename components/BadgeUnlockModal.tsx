"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BadgeUnlockModalProps {
  badge: { nome: string; desc: string; color: string; icon: React.ReactNode } | null;
  onClose: () => void;
}

export default function BadgeUnlockModal({ badge, onClose }: BadgeUnlockModalProps) {
  useEffect(() => {
    if (!badge) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [badge, onClose]);

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          key="badge-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, zIndex: 99999,
            background: "rgba(0,0,0,0.75)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 32,
          }}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 22 } }}
            exit={{ scale: 0.85, opacity: 0, y: 20, transition: { duration: 0.2 } }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0e0e0e",
              border: `1.5px solid ${badge.color}40`,
              borderRadius: 24,
              padding: "36px 32px",
              maxWidth: 320,
              width: "100%",
              textAlign: "center",
              boxShadow: `0 0 60px ${badge.color}25`,
            }}
          >
            {/* Burst rings */}
            <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <motion.div
                initial={{ scale: 0.6, opacity: 0.6 }}
                animate={{ scale: 1.6, opacity: 0, transition: { duration: 1.2, ease: "easeOut", repeat: Infinity, repeatDelay: 0.4 } }}
                style={{
                  position: "absolute",
                  width: 80, height: 80, borderRadius: "50%",
                  border: `2px solid ${badge.color}`,
                }}
              />
              <motion.div
                initial={{ scale: 0.6, opacity: 0.6 }}
                animate={{ scale: 1.6, opacity: 0, transition: { duration: 1.2, ease: "easeOut", delay: 0.5, repeat: Infinity, repeatDelay: 0.4 } }}
                style={{
                  position: "absolute",
                  width: 80, height: 80, borderRadius: "50%",
                  border: `2px solid ${badge.color}`,
                }}
              />
              <motion.div
                initial={{ rotate: -15, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1, transition: { type: "spring", stiffness: 280, damping: 18, delay: 0.1 } }}
                style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: `${badge.color}15`,
                  border: `2px solid ${badge.color}70`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: badge.color,
                  boxShadow: `0 0 24px ${badge.color}40`,
                }}
              >
                <span style={{ transform: "scale(1.4)", display: "flex" }}>{badge.icon}</span>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
              style={{ color: badge.color, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}
            >
              Badge desbloqueado!
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.28 } }}
              style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 8 }}
            >
              {badge.nome}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.35 } }}
              style={{ color: "#ffffff60", fontSize: 14, marginBottom: 28 }}
            >
              {badge.desc}
            </motion.p>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.45 } }}
              onClick={onClose}
              style={{
                width: "100%", padding: "14px 0",
                background: badge.color, color: "#000",
                border: "none", borderRadius: 14,
                fontSize: 15, fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Incrivel!
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6 } }}
              style={{ color: "#ffffff30", fontSize: 11, marginTop: 12 }}
            >
              Fecha automaticamente em 4s
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

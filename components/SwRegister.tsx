"use client";

import { useEffect, useState } from "react";

export default function SwRegister() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {/* ignore */});
    }

    // Offline detection
    const onOffline = () => setOffline(true);
    const onOnline  = () => setOffline(false);
    window.addEventListener("offline", onOffline);
    window.addEventListener("online",  onOnline);
    setOffline(!navigator.onLine);
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online",  onOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "env(safe-area-inset-top, 0px)",
        left: 0, right: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "10px 16px",
        background: "rgba(248,113,113,0.15)",
        borderBottom: "1px solid rgba(248,113,113,0.3)",
        backdropFilter: "blur(8px)",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01"
          stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span style={{ fontSize: 13, color: "#f87171", fontWeight: 600 }}>
        Sem conexão — usando dados locais
      </span>
    </div>
  );
}

"use client";

import { useEffect } from "react";

const KEYS = [
  "fitpro_onboarded",
  "fitpro_user_profile",
  "fitpro_workout_history",
  "fitpro_meals",
  "fitpro_reminder",
  "fitpro_modules",
];

export default function ResetPage() {
  useEffect(() => {
    KEYS.forEach((k) => localStorage.removeItem(k));
    window.location.replace("/onboarding");
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100dvh", background: "#000" }}>
      <p style={{ color: "#ffffff60", fontSize: 14 }}>Resetando...</p>
    </div>
  );
}

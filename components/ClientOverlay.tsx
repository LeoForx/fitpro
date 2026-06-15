"use client";

import { useState, useEffect } from "react";
import OnboardingScreen from "./OnboardingScreen";

export default function ClientOverlay() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!localStorage.getItem("fitpro_onboarded")) {
      setShowOnboarding(true);
    }
  }, []);

  if (!mounted) return null;
  if (showOnboarding) return <OnboardingScreen onDone={() => setShowOnboarding(false)} />;
  return null;
}

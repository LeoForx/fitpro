"use client";

import { useState, useEffect } from "react";

const CACHE_KEY = "fitpro_exercise_gifs";
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 dias

interface CacheEntry {
  url: string | null;
  ts: number;
}

function readCache(): Record<string, CacheEntry> {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeCache(name: string, url: string | null) {
  try {
    const cache = readCache();
    cache[name] = { url, ts: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* storage cheio — ignora */
  }
}

export function useExerciseGif(exerciseName?: string) {
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!exerciseName) return;

    const cache = readCache();
    const cached = cache[exerciseName];
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      setGifUrl(cached.url);
      return;
    }

    setLoading(true);
    fetch(`/api/exercises/gif?name=${encodeURIComponent(exerciseName)}`)
      .then((r) => r.json())
      .then((data: { gifUrl: string | null }) => {
        writeCache(exerciseName, data.gifUrl ?? null);
        setGifUrl(data.gifUrl ?? null);
      })
      .catch(() => {
        writeCache(exerciseName, null);
      })
      .finally(() => setLoading(false));
  }, [exerciseName]);

  return { gifUrl, loading };
}

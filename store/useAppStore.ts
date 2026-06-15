import { create } from "zustand";
import type { Exercise, WorkoutSerie, AgentMessage, Meal, UserProfile, WorkoutHistoryEntry, AppModule } from "@/types";

// ——— Persistence helpers ———

const HISTORY_KEY  = "fitpro_workout_history";
const PROFILE_KEY  = "fitpro_user_profile";
const MEALS_KEY    = "fitpro_meals";
const MODULES_KEY  = "fitpro_modules";
const CHAT_KEY     = "fitpro_chat_history";

function loadHistory(): WorkoutHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]"); } catch { return []; }
}
function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) ?? "null"); } catch { return null; }
}
function loadMeals(): Meal[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(MEALS_KEY) ?? "[]"); } catch { return []; }
}

const DEFAULT_MODULES: AppModule[] = [
  {
    id: "fundamentos",
    nome: "Fundamentos",
    aulas: [
      { id: "f1", titulo: "Como funciona a hipertrofia muscular", duracao: "8 min", concluida: false },
      { id: "f2", titulo: "Princípios de sobrecarga progressiva", duracao: "10 min", concluida: false },
      { id: "f3", titulo: "Aquecimento e ativação muscular", duracao: "6 min", concluida: false },
      { id: "f4", titulo: "Postura e técnica nos exercícios básicos", duracao: "12 min", concluida: false },
      { id: "f5", titulo: "Respiração durante o treino", duracao: "5 min", concluida: false },
      { id: "f6", titulo: "Frequência e volume ideal", duracao: "9 min", concluida: false },
      { id: "f7", titulo: "Recuperação e sono", duracao: "8 min", concluida: false },
      { id: "f8", titulo: "Montando seu primeiro plano", duracao: "11 min", concluida: false },
    ],
  },
  {
    id: "hipertrofia1",
    nome: "Hipertrofia I",
    aulas: [
      { id: "h1",  titulo: "Tensão mecânica vs. estresse metabólico", duracao: "10 min", concluida: false },
      { id: "h2",  titulo: "Compostos x isoladores: quando usar cada um", duracao: "9 min", concluida: false },
      { id: "h3",  titulo: "Range de repetições para hipertrofia", duracao: "7 min", concluida: false },
      { id: "h4",  titulo: "Peito: supino e variações", duracao: "12 min", concluida: false },
      { id: "h5",  titulo: "Costas: puxadas e remadas", duracao: "12 min", concluida: false },
      { id: "h6",  titulo: "Pernas: agachamento e leg press", duracao: "14 min", concluida: false },
      { id: "h7",  titulo: "Ombros: press e elevações", duracao: "10 min", concluida: false },
      { id: "h8",  titulo: "Bíceps e tríceps: isolamento eficiente", duracao: "9 min", concluida: false },
      { id: "h9",  titulo: "Periodização básica", duracao: "11 min", concluida: false },
      { id: "h10", titulo: "Deload: quando e como fazer", duracao: "8 min", concluida: false },
      { id: "h11", titulo: "Progressão de carga semana a semana", duracao: "10 min", concluida: false },
      { id: "h12", titulo: "Montando o treino de hipertrofia completo", duracao: "13 min", concluida: false },
    ],
  },
  {
    id: "core",
    nome: "Core & Mobilidade",
    aulas: [
      { id: "c1", titulo: "O que é o core e por que treinar", duracao: "7 min", concluida: false },
      { id: "c2", titulo: "Prancha e variações", duracao: "8 min", concluida: false },
      { id: "c3", titulo: "Mobilidade de quadril e tornozelo", duracao: "10 min", concluida: false },
      { id: "c4", titulo: "Mobilidade de ombros e coluna torácica", duracao: "9 min", concluida: false },
      { id: "c5", titulo: "Rotina de mobilidade pré-treino (10 min)", duracao: "10 min", concluida: false },
      { id: "c6", titulo: "Rotina de alongamento pós-treino", duracao: "10 min", concluida: false },
    ],
  },
  {
    id: "cardio",
    nome: "Cardio Avançado",
    aulas: [
      { id: "ca1",  titulo: "Cardio e hipertrofia: amigos ou inimigos?", duracao: "9 min", concluida: false },
      { id: "ca2",  titulo: "HIIT: protocolo e benefícios", duracao: "11 min", concluida: false },
      { id: "ca3",  titulo: "LISS: cardio de baixa intensidade", duracao: "8 min", concluida: false },
      { id: "ca4",  titulo: "Zone 2 training para saúde cardiovascular", duracao: "12 min", concluida: false },
      { id: "ca5",  titulo: "Cardio em jejum: vale a pena?", duracao: "8 min", concluida: false },
      { id: "ca6",  titulo: "Frequência cardíaca e zonas de treino", duracao: "10 min", concluida: false },
      { id: "ca7",  titulo: "Corrida, bike ou elíptico: como escolher", duracao: "7 min", concluida: false },
      { id: "ca8",  titulo: "Combinando cardio com treino de força", duracao: "10 min", concluida: false },
      { id: "ca9",  titulo: "VO2 máximo e como melhorá-lo", duracao: "11 min", concluida: false },
      { id: "ca10", titulo: "Montando seu plano de cardio avançado", duracao: "12 min", concluida: false },
    ],
  },
];

const INITIAL_GREETING: AgentMessage = {
  id: "1",
  role: "agent",
  content: "Olá! Sou seu coach de treinos e dieta. Como posso te ajudar hoje?",
  timestamp: Date.now() - 10000,
};

function loadChatHistory(): AgentMessage[] {
  if (typeof window === "undefined") return [INITIAL_GREETING];
  try {
    const saved = JSON.parse(localStorage.getItem(CHAT_KEY) ?? "null");
    if (Array.isArray(saved) && saved.length > 0) return saved;
  } catch { /* ignore */ }
  return [INITIAL_GREETING];
}

function loadModules(): AppModule[] {
  if (typeof window === "undefined") return DEFAULT_MODULES;
  try {
    const saved = localStorage.getItem(MODULES_KEY);
    if (!saved) return DEFAULT_MODULES;
    return JSON.parse(saved) as AppModule[];
  } catch { return DEFAULT_MODULES; }
}

// ——— XP & Level system ———

export const LEVEL_THRESHOLDS = [
  { level: 1, name: "Novato",    color: "#888",    min: 0,    max: 199  },
  { level: 2, name: "Iniciante", color: "#4ade80", min: 200,  max: 499  },
  { level: 3, name: "Atleta",    color: "#2ffe1d", min: 500,  max: 999  },
  { level: 4, name: "Guerreiro", color: "#facc15", min: 1000, max: 1999 },
  { level: 5, name: "Elite",     color: "#fb923c", min: 2000, max: 3999 },
  { level: 6, name: "Lenda",     color: "#a78bfa", min: 4000, max: Infinity },
];

export function calcXP(history: WorkoutHistoryEntry[], modules: AppModule[], streak: number): number {
  const workoutXP = history.length * 50;
  const lessonXP  = modules.reduce((s, m) => s + m.aulas.filter((a) => a.concluida).length, 0) * 10;
  const streakBonus = Math.min(streak * 5, 100);
  return workoutXP + lessonXP + streakBonus;
}

export function getLevelInfo(xp: number) {
  return LEVEL_THRESHOLDS.findLast((l) => xp >= l.min) ?? LEVEL_THRESHOLDS[0];
}

// ——— Stats computed from history ———

function calcTreinosCompletos(history: WorkoutHistoryEntry[]): number {
  return history.length;
}

function calcProgressoSemanal(history: WorkoutHistoryEntry[]): number {
  const now = new Date();
  const dow = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - ((dow + 6) % 7)); // Monday
  startOfWeek.setHours(0, 0, 0, 0);
  // Count unique days, not entries
  const uniqueDays = new Set(
    history
      .filter((e) => e.date >= startOfWeek.getTime())
      .map((e) => new Date(e.date).toDateString())
  );
  return uniqueDays.size;
}

function calcStreak(history: WorkoutHistoryEntry[]): number {
  if (history.length === 0) return 0;
  const days = new Set(history.map((e) => new Date(e.date).toDateString()));
  const today = new Date();
  const todayStr = today.toDateString();
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);

  // Streak only valid if worked out today or yesterday
  let check = new Date(today);
  if (!days.has(todayStr)) {
    if (!days.has(yesterday.toDateString())) return 0;
    check = yesterday;
  }

  let streak = 0;
  while (days.has(check.toDateString())) {
    streak++;
    check.setDate(check.getDate() - 1);
  }
  return streak;
}

// ——— Store ———

interface AppStore {
  // Workout execution
  currentWorkout: { id: string; nome: string; exercicios: Exercise[] } | null;
  currentExerciseIndex: number;
  series: WorkoutSerie[];
  workoutStartedAt: number | null;

  setCurrentWorkout: (w: AppStore["currentWorkout"]) => void;
  setCurrentExerciseIndex: (i: number) => void;
  concluirSerie: (exerciseId: string, serieIndex: number) => void;
  nextExercise: () => void;
  resetWorkout: () => void;

  // Stats (computed from history)
  streak: number;
  metaSemanal: number;
  progressoSemanal: number;
  treinosCompletos: number;

  // Workout history
  workoutHistory: WorkoutHistoryEntry[];
  addWorkoutHistory: (entry: WorkoutHistoryEntry) => void;

  // Diet
  meals: Meal[];
  setMeals: (meals: Meal[]) => void;
  toggleFoodConsumed: (mealId: string, foodId: string) => void;

  // User profile
  userProfile: UserProfile | null;
  setUserProfile: (p: UserProfile) => void;

  // XP
  xp: number;

  // Modules
  modules: AppModule[];
  toggleAula: (moduleId: string, aulaId: string) => void;

  // Agent
  agentMessages: AgentMessage[];
  isAgentTyping: boolean;
  addUserMessage: (content: string) => void;
  addAgentMessage: (content: string) => void;
  setAgentTyping: (v: boolean) => void;
}

const initialHistory = loadHistory();
const initialProfile = loadProfile();
const initialModules = loadModules();

export const useAppStore = create<AppStore>((set, get) => ({
  // ——— Workout execution ———
  currentWorkout: null,
  currentExerciseIndex: 0,
  series: [],
  workoutStartedAt: null,

  setCurrentWorkout: (w) =>
    set({ currentWorkout: w, currentExerciseIndex: 0, series: [], workoutStartedAt: Date.now() }),

  setCurrentExerciseIndex: (i) => set({ currentExerciseIndex: i }),

  concluirSerie: (exerciseId, serieIndex) =>
    set((s) => ({
      series: [
        ...s.series.filter((x) => !(x.exerciseId === exerciseId && x.serieIndex === serieIndex)),
        { exerciseId, serieIndex, concluida: true, timestamp: Date.now() },
      ],
    })),

  nextExercise: () => {
    const { currentWorkout, currentExerciseIndex } = get();
    if (!currentWorkout) return;
    if (currentExerciseIndex < currentWorkout.exercicios.length - 1) {
      set({ currentExerciseIndex: currentExerciseIndex + 1 });
    }
  },

  resetWorkout: () =>
    set({ currentWorkout: null, currentExerciseIndex: 0, series: [], workoutStartedAt: null }),

  // ——— Stats (derived from history on init) ———
  streak:           calcStreak(initialHistory),
  metaSemanal:      initialProfile?.metaSemanal ?? 4,
  progressoSemanal: calcProgressoSemanal(initialHistory),
  treinosCompletos: calcTreinosCompletos(initialHistory),
  xp:               calcXP(initialHistory, initialModules, calcStreak(initialHistory)),

  // ——— Workout history ———
  workoutHistory: initialHistory,
  addWorkoutHistory: (entry) =>
    set((s) => {
      const updated = [entry, ...s.workoutHistory].slice(0, 100);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
      const newStreak = calcStreak(updated);
      return {
        workoutHistory:   updated,
        treinosCompletos: calcTreinosCompletos(updated),
        progressoSemanal: calcProgressoSemanal(updated),
        streak:           newStreak,
        xp:               calcXP(updated, s.modules, newStreak),
      };
    }),

  // ——— Diet ———
  meals: loadMeals(),
  setMeals: (meals) => {
    try { localStorage.setItem(MEALS_KEY, JSON.stringify(meals)); } catch { /* ignore */ }
    set({ meals });
  },
  toggleFoodConsumed: (mealId, foodId) =>
    set((s) => {
      const updated = s.meals.map((m) =>
        m.id === mealId
          ? { ...m, itens: m.itens.map((f) => f.id === foodId ? { ...f, consumido: !f.consumido } : f) }
          : m
      );
      try { localStorage.setItem(MEALS_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
      return { meals: updated };
    }),

  // ——— User profile ———
  userProfile: initialProfile,
  setUserProfile: (p) => {
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch { /* ignore */ }
    set({ userProfile: p, metaSemanal: p.metaSemanal });
  },

  // ——— Modules ———
  modules: initialModules,
  toggleAula: (moduleId, aulaId) =>
    set((s) => {
      const updated = s.modules.map((m) =>
        m.id === moduleId
          ? { ...m, aulas: m.aulas.map((a) => a.id === aulaId ? { ...a, concluida: !a.concluida } : a) }
          : m
      );
      try { localStorage.setItem(MODULES_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
      return { modules: updated, xp: calcXP(s.workoutHistory, updated, s.streak) };
    }),

  // ——— Agent ———
  agentMessages: loadChatHistory(),
  isAgentTyping: false,

  addUserMessage: (content) =>
    set((s) => {
      const updated = [...s.agentMessages, { id: Date.now().toString(), role: "user" as const, content, timestamp: Date.now() }].slice(-60);
      try { localStorage.setItem(CHAT_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
      return { agentMessages: updated };
    }),

  addAgentMessage: (content) =>
    set((s) => {
      const updated = [...s.agentMessages, { id: Date.now().toString(), role: "agent" as const, content, timestamp: Date.now() }].slice(-60);
      try { localStorage.setItem(CHAT_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
      return { agentMessages: updated, isAgentTyping: false };
    }),

  setAgentTyping: (v) => set({ isAgentTyping: v }),
}));

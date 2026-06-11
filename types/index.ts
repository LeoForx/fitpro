export type AnimacaoTipo = "lottie" | "gif" | "mp4" | "sprite";

export interface ExerciseMedia {
  image?: string;
  animation?: string;
  thumbnail?: string;
}

export interface Exercise {
  id: string;
  nome: string;
  grupo_muscular: string;
  descricao_curta: string;
  image_url?: string;
  animacao_url?: string;
  animacao_tipo?: AnimacaoTipo;
  thumbnail_url?: string;
  video_url?: string;
  equipment?: string[];
  nivel?: "iniciante" | "intermediario" | "avancado";
  tags?: string[];
  series?: number;
  reps?: string;
  descanso_segundos?: number;
}

export interface WorkoutSerie {
  exerciseId: string;
  serieIndex: number;
  concluida: boolean;
  timestamp?: number;
}

export interface Workout {
  id: string;
  nome: string;
  descricao?: string;
  duracao_minutos: number;
  nivel?: string;
  exercicios: Exercise[];
  thumbnail_url?: string;
}

export interface MacroBar {
  label: string;
  value: number;
  max: number;
  color: string;
}

export interface FoodItem {
  id: string;
  nome: string;
  quantidade: string;
  calorias: number;
  proteina: number;
  carboidrato: number;
  gordura: number;
  image_url?: string;
  consumido?: boolean;
}

export interface Meal {
  id: string;
  nome: string;
  horario: string;
  itens: FoodItem[];
}

export interface AgentMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: number;
}

export interface UserProfile {
  nome: string;
  objetivo: "hipertrofia" | "emagrecimento" | "condicionamento";
  nivel: "iniciante" | "intermediario" | "avancado";
  metaSemanal: number;
  faixaEtaria?: "16-25" | "26-35" | "36-45" | "46-55" | "56+";
}

export interface ModuleAula {
  id: string;
  titulo: string;
  duracao: string;
  concluida: boolean;
}

export interface AppModule {
  id: string;
  nome: string;
  aulas: ModuleAula[];
}

export interface WorkoutHistoryEntry {
  id: string;
  workoutId: string;
  workoutNome: string;
  date: number;
  durationMin: number;
  totalExercicios: number;
  totalSeries: number;
  calories: number;
}

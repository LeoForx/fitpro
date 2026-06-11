import { NextResponse } from "next/server";
import type { Exercise } from "@/types";

const EXERCISES: Exercise[] = [
  {
    id: "e1",
    nome: "Supino Reto",
    grupo_muscular: "Peito",
    descricao_curta: "Exercício composto para desenvolvimento do peitoral. Mantenha os cotovelos em 45°.",
    animacao_tipo: "lottie",
    equipment: ["Barra", "Banco"],
    nivel: "intermediario",
    tags: ["composto", "peito", "tríceps"],
    series: 4,
    reps: "8-12",
    descanso_segundos: 90,
  },
  {
    id: "e2",
    nome: "Agachamento",
    grupo_muscular: "Pernas",
    descricao_curta: "Rei dos exercícios para membros inferiores. Ativação completa de quadríceps, posterior e glúteos.",
    animacao_tipo: "lottie",
    equipment: ["Barra", "Rack"],
    nivel: "intermediario",
    tags: ["composto", "pernas", "glúteos"],
    series: 5,
    reps: "6-10",
    descanso_segundos: 120,
  },
  {
    id: "e3",
    nome: "Puxada Frontal",
    grupo_muscular: "Costas",
    descricao_curta: "Puxada na polia alta para desenvolvimento da largura das costas.",
    animacao_tipo: "lottie",
    equipment: ["Polia Alta"],
    nivel: "iniciante",
    tags: ["costas", "bíceps", "largura"],
    series: 4,
    reps: "8-12",
    descanso_segundos: 90,
  },
  {
    id: "e4",
    nome: "Rosca Direta",
    grupo_muscular: "Bíceps",
    descricao_curta: "Isolamento do bíceps com barra. Cotovelos fixos ao lado do tronco.",
    animacao_tipo: "lottie",
    equipment: ["Barra"],
    nivel: "iniciante",
    tags: ["bíceps", "isolamento"],
    series: 3,
    reps: "10-12",
    descanso_segundos: 60,
  },
  {
    id: "e5",
    nome: "Desenvolvimento",
    grupo_muscular: "Ombros",
    descricao_curta: "Exercício composto para desenvolvimento dos ombros com barra ou halteres.",
    animacao_tipo: "lottie",
    equipment: ["Barra", "Banco"],
    nivel: "intermediario",
    tags: ["ombros", "composto"],
    series: 4,
    reps: "8-10",
    descanso_segundos: 90,
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const grupo = searchParams.get("grupo");
  const nivel = searchParams.get("nivel");
  const id = searchParams.get("id");

  let result = EXERCISES;

  if (id) {
    const found = EXERCISES.find((e) => e.id === id);
    if (!found) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ exercise: found });
  }

  if (grupo) result = result.filter((e) => e.grupo_muscular.toLowerCase() === grupo.toLowerCase());
  if (nivel) result = result.filter((e) => e.nivel === nivel);

  return NextResponse.json({
    exercises: result,
    total: result.length,
  });
}

import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const OBJETIVO_MAP: Record<string, string> = {
  hipertrofia: "muscle hypertrophy (gain mass and strength)",
  emagrecimento: "fat loss and body definition",
  condicionamento: "general fitness and cardiovascular conditioning",
};

const NIVEL_MAP: Record<string, string> = {
  iniciante: "beginner (less than 1 year of training, simple exercises, lower volume)",
  intermediario: "intermediate (1-3 years, mix of compound and isolation, moderate volume)",
  avancado: "advanced (3+ years, heavy compounds, high volume)",
};

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === "your_api_key_here") {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY not configured in .env.local" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const { objetivo, nivel, metaSemanal, nome, grupoMuscular, faixaEtaria } = await request.json();
  const focusInstruction = grupoMuscular && grupoMuscular !== "Full Body"
    ? `- Primary muscle focus: ${grupoMuscular} (most exercises must target this muscle group)`
    : grupoMuscular === "Full Body"
    ? "- Style: full body workout (cover multiple muscle groups in the same session)"
    : "";

  const ageInstruction = faixaEtaria
    ? `- Age range: ${faixaEtaria} — adjust load, volume and rest accordingly (e.g. 56+ → lower impact, more rest, joint-friendly alternatives; 16-25 → can handle higher volume)`
    : "";

  const client = new Anthropic({ apiKey });

  const stream = client.messages.stream({
    model: "claude-opus-4-6",
    max_tokens: 4096,
    system: `You are a professional personal trainer who creates personalized workout plans.
Return ONLY a valid JSON object — no markdown, no code blocks, no explanation.
Start your response directly with { and end with }.`,
    messages: [
      {
        role: "user",
        content: `Create a personalized gym workout for:
- Name: ${nome || "Atleta"}
- Objective: ${OBJETIVO_MAP[objetivo] ?? objetivo}
- Level: ${NIVEL_MAP[nivel] ?? nivel}
- Weekly sessions goal: ${metaSemanal}x per week

Requirements:
${focusInstruction ? focusInstruction + "\n" : ""}${ageInstruction ? ageInstruction + "\n" : ""}- 4 to 6 exercises total
- Exercise names in Brazilian Portuguese
- Muscle groups in Brazilian Portuguese (e.g., "Peito", "Costas", "Pernas", "Bíceps", "Tríceps", "Ombros", "Abdômen")
- Appropriate sets/reps/rest for the level and objective
- descricao_curta: technique tip (max 80 chars, Portuguese)

Return this exact JSON structure:
{
  "id": "ai_1",
  "nome": "Treino IA — [focus area in Portuguese]",
  "descricao": "brief description in Portuguese (max 120 chars)",
  "duracao_minutos": [number between 40-70],
  "nivel": "${nivel}",
  "thumbnail_url": "",
  "exercicios": [
    {
      "id": "ex1",
      "nome": "[exercise name in Portuguese]",
      "grupo_muscular": "[muscle group in Portuguese]",
      "descricao_curta": "[technique tip in Portuguese]",
      "series": [number],
      "reps": "[e.g. '8-12' or 'max']",
      "descanso_segundos": [number]
    }
  ]
}`,
      },
    ],
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

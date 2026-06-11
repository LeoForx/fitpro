import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const OBJETIVO_MAP: Record<string, string> = {
  hipertrofia: "muscle hypertrophy (high protein, caloric surplus ~300-500 kcal above maintenance)",
  emagrecimento: "fat loss (caloric deficit ~300-500 kcal below maintenance, high protein to preserve muscle)",
  condicionamento: "general fitness and body recomposition (maintenance calories, balanced macros)",
};

const NIVEL_MAP: Record<string, string> = {
  iniciante: "beginner",
  intermediario: "intermediate",
  avancado: "advanced",
};

const META_ALIMENTAR_MAP: Record<string, string> = {
  emagrecer: "fat loss / caloric deficit",
  manter: "weight maintenance",
  ganhar: "muscle gain / caloric surplus",
};

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === "your_api_key_here") {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY not configured in .env.local" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const { objetivo, nivel, nome, metaAlimentar, restricoes, alergias, faixaEtaria } = await request.json();

  const client = new Anthropic({ apiKey });

  const restricoesText = restricoes?.length
    ? `- Dietary preferences: ${restricoes.join(", ")}`
    : "";

  const alergiasText = alergias?.length
    ? `- CRITICAL - User is ALLERGIC to (NEVER include these in any meal): ${alergias.join(", ")}`
    : "";

  const ageText = faixaEtaria
    ? `- Age range: ${faixaEtaria} — adjust portions and nutrients accordingly (e.g. 56+ → reduce sodium, prioritize calcium and vitamin D, smaller portions; 16-25 → can handle higher calories and protein)`
    : "";

  const stream = client.messages.stream({
    model: "claude-opus-4-6",
    max_tokens: 4096,
    system: `You are a professional sports nutritionist who creates personalized meal plans.
Return ONLY a valid JSON array — no markdown, no code blocks, no explanation.
Start your response directly with [ and end with ].`,
    messages: [
      {
        role: "user",
        content: `Create a full-day personalized meal plan for:
- Name: ${nome || "Atleta"}
- Training objective: ${OBJETIVO_MAP[objetivo] ?? objetivo}
- Fitness level: ${NIVEL_MAP[nivel] ?? nivel}
- Dietary goal: ${META_ALIMENTAR_MAP[metaAlimentar] ?? "balanced diet"}
${restricoesText}
${alergiasText}
${ageText}

Requirements:
- 4 to 5 meals (Café da Manhã, Lanche da Manhã (optional), Almoço, Pré-Treino or Lanche da Tarde, Jantar)
- All meal and food names in Brazilian Portuguese
- Realistic portions with accurate macros (protein, carbohydrate, fat in grams, calories)
- Foods appropriate for Brazilian cuisine
- Total daily protein should be 1.8-2.2g per kg body weight (assume 75kg)
- Each meal must have 2-4 food items

Return this exact JSON structure:
[
  {
    "id": "m1",
    "nome": "Café da Manhã",
    "horario": "07:00",
    "itens": [
      {
        "id": "f1",
        "nome": "food name in Portuguese",
        "quantidade": "portion size",
        "calorias": 000,
        "proteina": 00,
        "carboidrato": 00,
        "gordura": 00,
        "consumido": false
      }
    ]
  }
]`,
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

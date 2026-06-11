import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messages, userProfile, stats, workoutHistory } = await request.json();

  const profileBlock = userProfile
    ? `User profile:
- Name: ${userProfile.nome || "Atleta"}
- Training objective: ${userProfile.objetivo}
- Experience level: ${userProfile.nivel}
- Weekly training goal: ${userProfile.metaSemanal}x per week${userProfile.faixaEtaria ? `\n- Age range: ${userProfile.faixaEtaria}` : ""}`
    : "User profile: not available";

  const statsBlock = stats
    ? `Current stats:
- Completed workouts: ${stats.treinosCompletos}
- Current streak: ${stats.streak} days
- Weekly progress: ${stats.progressoSemanal}/${stats.metaSemanal} workouts`
    : "";

  const historyBlock = workoutHistory?.length
    ? `Recent workouts (last 5):
${workoutHistory
    .slice(0, 5)
    .map((h: { workoutNome: string; date: number; durationMin: number; calories: number }) =>
      `- ${h.workoutNome} | ${new Date(h.date).toLocaleDateString("pt-BR")} | ${h.durationMin}min | ~${h.calories}kcal`
    )
    .join("\n")}`
    : "";

  const systemPrompt = `You are Coach FitPro, a knowledgeable and motivating personal trainer and sports nutritionist. You speak Brazilian Portuguese naturally and casually — like a real coach talking to their athlete. Be direct, practical, and encouraging.

${profileBlock}
${statsBlock}
${historyBlock}

Guidelines:
- Always respond in Brazilian Portuguese
- Keep answers concise and actionable (2-4 short paragraphs max)
- Use the user's profile data to give personalized advice
- For exercise technique questions, describe form clearly
- For nutrition questions, give specific quantities and food names common in Brazil
- Be motivating but realistic
- Use line breaks to organize information, but avoid long bullet lists
- Don't use markdown headers or bold — just plain conversational text`;

  const client = new Anthropic({ apiKey });

  const stream = client.messages.stream({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role === "agent" ? "assistant" : "user",
      content: m.content,
    })),
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
    cancel() { stream.abort(); },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

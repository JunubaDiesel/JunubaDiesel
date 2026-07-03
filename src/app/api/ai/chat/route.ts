import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { google } from "@ai-sdk/google";
import { NextRequest } from "next/server";
import { junubaChatTools, junubaSystemPrompt } from "@/lib/ai/tools";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const limited = checkRateLimit(request, {
    prefix: "ai-chat",
    limit: 20,
    windowMs: 60 * 60_000,
  });
  if (limited) return limited;

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return Response.json(
      { error: "Asistente IA no configurado (GOOGLE_GENERATIVE_AI_API_KEY)" },
      { status: 503 }
    );
  }

  const { messages }: { messages: UIMessage[] } = await request.json();

  const result = streamText({
    model: google("gemini-2.0-flash"),
    system: junubaSystemPrompt,
    messages: await convertToModelMessages(messages),
    tools: junubaChatTools,
  });

  return result.toUIMessageStreamResponse();
}

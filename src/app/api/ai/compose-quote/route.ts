import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { siteConfig } from "@/config/site";
import { whatsappHref } from "@/lib/contact";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

const payloadSchema = z.object({
  items: z.array(
    z.object({
      oemNumber: z.string(),
      name: z.string().optional(),
      notes: z.string().optional(),
    })
  ),
});

export async function POST(request: NextRequest) {
  const limited = checkRateLimit(request, {
    prefix: "ai-compose",
    limit: 15,
    windowMs: 60 * 60_000,
  });
  if (limited) return limited;

  const body = payloadSchema.parse(await request.json());

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    const message = [
      "Hola JUNUBA, solicito cotización:",
      ...body.items.map(
        (item, index) =>
          `${index + 1}. ${item.name ?? item.oemNumber} (${item.oemNumber})${item.notes ? ` — ${item.notes}` : ""}`
      ),
      "¿Precio y disponibilidad? Gracias.",
    ].join("\n");

    return NextResponse.json({
      message,
      url: whatsappHref(siteConfig.phone, message),
    });
  }

  const { text } = await generateText({
    model: google("gemini-2.0-flash"),
    prompt: `Redacta un mensaje breve en español para WhatsApp solicitando cotización a JUNUBA Corea Diesel.
Piezas:
${body.items
  .map(
    (item, index) =>
      `${index + 1}. OEM ${item.oemNumber}${item.name ? ` - ${item.name}` : ""}${item.notes ? ` (${item.notes})` : ""}`
  )
  .join("\n")}

Formato: saludo + lista numerada + pregunta de precio/disponibilidad. Sin markdown.`,
  });

  return NextResponse.json({
    message: text.trim(),
    url: whatsappHref(siteConfig.phone, text.trim()),
  });
}

import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/config/site";
import { escapeHtml } from "@/lib/html-escape";
import { checkRateLimit } from "@/lib/rate-limit";
import { whatsappHref } from "@/lib/contact";

interface ContactPayload {
  name?: string;
  phone?: string;
  email?: string;
  vehicle?: string;
  message?: string;
  website?: string;
}

const MAX_FIELD_LENGTH = 2000;

export async function POST(request: NextRequest) {
  const limited = await checkRateLimit(request, {
    prefix: "contact",
    limit: 5,
    windowMs: 15 * 60_000,
  });
  if (limited) return limited;

  const body = (await request.json()) as ContactPayload;

  if (body.website?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = body.name?.trim().slice(0, MAX_FIELD_LENGTH);
  const phone = body.phone?.trim().slice(0, 100);
  const email = body.email?.trim().slice(0, 200);
  const vehicle = body.vehicle?.trim().slice(0, 200);
  const message = body.message?.trim().slice(0, MAX_FIELD_LENGTH);

  if (!name || !phone || !message) {
    return NextResponse.json(
      { error: "Nombre, teléfono y mensaje son obligatorios" },
      { status: 400 }
    );
  }

  const html = `
    <h2>Nueva consulta web - JUNUBA</h2>
    <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
    <p><strong>Teléfono:</strong> ${escapeHtml(phone)}</p>
    <p><strong>Correo:</strong> ${escapeHtml(email || "No indicado")}</p>
    <p><strong>Vehículo:</strong> ${escapeHtml(vehicle || "No indicado")}</p>
    <p><strong>Mensaje:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
  `;

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev",
        to: siteConfig.email,
        subject: `Consulta web - ${name}`,
        html,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "No se pudo enviar el correo" }, { status: 502 });
    }
  } else if (process.env.NODE_ENV === "development") {
    console.info("[contact]", { name, phone, email, vehicle, message });
  } else {
    const waMessage = `Hola JUNUBA, consulta web:\nNombre: ${name}\nTel: ${phone}\n${message}`;
    return NextResponse.json({
      ok: true,
      fallback: "whatsapp",
      url: whatsappHref(siteConfig.phone, waMessage),
    });
  }

  return NextResponse.json({ ok: true });
}

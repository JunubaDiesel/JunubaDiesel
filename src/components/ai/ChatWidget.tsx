"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useMemo, useState } from "react";
import { ChatToolParts } from "@/components/ai/ChatToolParts";
import { siteConfig, ui } from "@/config/site";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/ai/chat" }),
    []
  );

  const { messages, sendMessage, status, error } = useChat({ transport });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    await sendMessage({ text });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-6 right-6 z-[90] flex h-14 w-14 items-center justify-center rounded-full accent-gradient text-white shadow-xl"
        aria-label="Asistente IA JUNUBA"
      >
        AI
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-[90] flex h-[min(70vh,520px)] w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
          <div className="border-b border-border px-4 py-3">
            <p className="font-bold">Asistente JUNUBA</p>
            <p className="text-xs text-muted">Repuestos · Stock · Cotización</p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.length === 0 && (
              <p className="text-sm text-muted">
                Pregunte por ejemplo: &quot;¿Tienen bomba de agua para Starex 2013?&quot;
              </p>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-xl px-3 py-2 text-sm ${
                  message.role === "user"
                    ? "ml-8 bg-accent/20 text-foreground"
                    : "mr-8 bg-surface-light text-muted"
                }`}
              >
                <ChatToolParts parts={message.parts as Parameters<typeof ChatToolParts>[0]["parts"]} />
              </div>
            ))}
            {status === "streaming" && (
              <p className="text-xs text-muted">Escribiendo...</p>
            )}
            {error && (
              <p className="text-xs text-red-400">
                {error.message.includes("503")
                  ? "Configure GOOGLE_GENERATIVE_AI_API_KEY para activar el asistente."
                  : error.message.includes("429")
                    ? "Demasiadas consultas. Intente más tarde."
                    : error.message}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-border p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Consulte stock o repuestos..."
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={status === "streaming"}
                className="rounded-lg accent-gradient px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                Enviar
              </button>
            </div>
            <a
              href={siteConfig.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs text-accent hover:underline"
            >
              {ui.contactWhatsApp} directo →
            </a>
          </form>
        </div>
      )}
    </>
  );
}

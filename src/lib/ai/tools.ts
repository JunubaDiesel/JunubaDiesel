import { z } from "zod";
import { siteConfig } from "@/config/site";
import { whatsappHref } from "@/lib/contact";
import { getInventoryStats, lookupByOem } from "@/lib/inventory";
import { toPublicLookupResult, toPublicPart } from "@/lib/public-part";
import { searchParts } from "@/lib/parts";
import { searchResources as findResources } from "@/lib/resources";
import { tool } from "ai";

export const junubaSystemPrompt = `Eres un asistente experto de JUNUBA Corea Diesel, especialista en repuestos Hyundai Starex, Staria, Porter y Kia Bongo en República Dominicana.
Responde siempre en español. Ayuda a encontrar repuestos, verificar stock, consultar guías de mantenimiento en /recursos y preparar cotizaciones por WhatsApp.
No inventes stock ni precios: usa las herramientas disponibles.`;

export const junubaChatTools = {
  searchParts: tool({
    description: "Buscar repuestos en el catálogo JUNUBA por texto y vehículo",
    inputSchema: z.object({
      query: z.string().describe("Texto de búsqueda: nombre, OEM o código"),
      vehicle: z.enum(["starex", "staria", "porter", "bongo"]).optional(),
      category: z
        .enum(["engine", "transmission", "exterior", "electrical", "other"])
        .optional(),
    }),
    execute: async ({ query, vehicle, category }) => {
      const result = searchParts({ query, vehicle, category, pageSize: 6 });
      return {
        total: result.total,
        parts: result.parts.map((part) => toPublicPart(part)),
      };
    },
  }),
  lookupOem: tool({
    description: "Consultar stock JUNUBA por número OEM",
    inputSchema: z.object({
      oem: z.string().describe("Número OEM o código de pieza"),
    }),
    execute: async ({ oem }) => {
      const result = toPublicLookupResult(lookupByOem(oem));
      return {
        ...result,
        products: result.products.slice(0, 5),
      };
    },
  }),
  getInventoryStats: tool({
    description: "Obtener estadísticas generales del inventario JUNUBA",
    inputSchema: z.object({}),
    execute: async () => getInventoryStats(),
  }),
  composeWhatsApp: tool({
    description: "Generar mensaje de cotización para WhatsApp con lista de repuestos",
    inputSchema: z.object({
      items: z.array(
        z.object({
          name: z.string(),
          oem: z.string().optional(),
          quantity: z.number().optional(),
        })
      ),
      customerNote: z.string().optional(),
    }),
    execute: async ({ items, customerNote }) => {
      const lines = items.map((item, index) => {
        const qty = item.quantity && item.quantity > 0 ? ` x${item.quantity}` : "";
        const oem = item.oem ? ` (${item.oem})` : "";
        return `${index + 1}. ${item.name}${oem}${qty}`;
      });
      const message = [
        "Hola JUNUBA, solicito cotización:",
        ...lines,
        customerNote?.trim(),
        "¿Precio y disponibilidad? Gracias.",
      ]
        .filter(Boolean)
        .join("\n");

      return {
        message,
        url: whatsappHref(siteConfig.phone, message),
      };
    },
  }),
  searchResources: tool({
    description:
      "Buscar guías de mantenimiento, consejos y videos en la sección Recursos de JUNUBA",
    inputSchema: z.object({
      query: z.string().describe("Tema de mantenimiento o pregunta del usuario"),
      vehicle: z.enum(["starex", "staria", "porter", "bongo"]).optional(),
    }),
    execute: async ({ query, vehicle }) => findResources(query, vehicle, 5),
  }),
};

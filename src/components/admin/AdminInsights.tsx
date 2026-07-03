"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";

interface AdminInsightsProps {
  authHeader: string;
}

export function AdminInsights({ authHeader }: AdminInsightsProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);

  const analyze = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/insights", {
        headers: { Authorization: authHeader },
      });
      const data = await response.json();
      if (!response.ok) {
        showToast(data.error ?? "Error de análisis IA");
        return;
      }
      setInsights(data.insights as string);
    } catch {
      showToast("Error de análisis IA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card space-y-4 rounded-2xl p-6">
      <div>
        <h2 className="text-lg font-bold">Análisis IA del inventario</h2>
        <p className="text-sm text-muted">
          Gemini resume stock, categorías, alertas y oportunidades comerciales.
        </p>
      </div>
      <Button type="button" onClick={analyze} disabled={loading}>
        {loading ? "Analizando..." : "Analizar inventario con IA"}
      </Button>
      {insights && (
        <div className="rounded-xl border border-border bg-surface-light p-4 text-sm whitespace-pre-wrap text-muted">
          {insights}
        </div>
      )}
    </div>
  );
}

"use client";

import { ToastProvider } from "@/context/ToastContext";
import { ChatWidget } from "@/components/ai/ChatWidget";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <ChatWidget />
    </ToastProvider>
  );
}

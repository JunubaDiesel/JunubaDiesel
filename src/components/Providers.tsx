"use client";

import { ReviewListProvider } from "@/context/ReviewListContext";
import { ToastProvider } from "@/context/ToastContext";
import { ChatWidget } from "@/components/ai/ChatWidget";
import { ReviewListPanel } from "@/components/catalog/ReviewListPanel";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ReviewListProvider>
        {children}
        <ReviewListPanel />
        <ChatWidget />
      </ReviewListProvider>
    </ToastProvider>
  );
}

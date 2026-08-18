"use client";

import { useEffect } from "react";
import { Check, X } from "lucide-react";

export interface ToastMessage {
  id: number;
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export default function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, 3600);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div
      className="fixed bottom-6 inset-x-0 z-[60] flex justify-center px-4 pointer-events-none"
      role="status"
      aria-live="polite"
    >
      {/* Keyed so a repeated message replays the entrance animation */}
      <div
        key={toast.id}
        className="animate-fade-in-up pointer-events-auto flex items-center gap-3 bg-foreground text-white pl-4 pr-2 py-3 rounded-2xl shadow-2xl max-w-sm w-full"
      >
        <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
          <Check className="w-3.5 h-3.5" />
        </span>
        <span className="text-sm font-medium flex-1">{toast.message}</span>
        <button
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

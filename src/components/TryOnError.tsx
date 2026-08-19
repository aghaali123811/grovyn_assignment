"use client";

import { AlertCircle, KeyRound, RotateCcw, Zap } from "lucide-react";

export interface TryOnErrorDetail {
  message: string;
  code?: string;
}

interface TryOnErrorProps {
  error: TryOnErrorDetail;
  onRetry: () => void;
  onUseDemoMode: () => void;
}

export default function TryOnError({
  error,
  onRetry,
  onUseDemoMode,
}: TryOnErrorProps) {
  const isMissingKey = error.code === "MISSING_API_KEY";

  return (
    <div
      className="max-w-lg mx-auto text-center px-4"
      role="alert"
      aria-live="assertive"
    >
      <div
        className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 ${
          isMissingKey ? "bg-amber-50" : "bg-red-50"
        }`}
      >
        {isMissingKey ? (
          <KeyRound className="w-7 h-7 text-amber-600" />
        ) : (
          <AlertCircle className="w-7 h-7 text-red-600" />
        )}
      </div>

      <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
        {isMissingKey
          ? "AI try-on is unavailable right now"
          : "We couldn't create your look"}
      </h3>

      <p className="text-text-muted leading-relaxed mb-8">{error.message}</p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {isMissingKey ? (
          <button
            onClick={onUseDemoMode}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-foreground text-white px-8 py-4 rounded-full font-semibold hover:bg-stone-800 transition-colors shadow-lg"
          >
            <Zap className="w-5 h-5" />
            Continue in Demo Mode
          </button>
        ) : (
          <button
            onClick={onRetry}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-foreground text-white px-8 py-4 rounded-full font-semibold hover:bg-stone-800 transition-colors shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </button>
        )}

        <button
          onClick={onRetry}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-border text-foreground px-8 py-4 rounded-full font-semibold hover:bg-surface-muted transition-colors ${
            isMissingKey ? "" : "hidden sm:inline-flex"
          }`}
        >
          <RotateCcw className="w-5 h-5" />
          {isMissingKey ? "Retry Live Mode" : "Choose Another Look"}
        </button>
      </div>

      {/* Developer detail, never shown to customers in production. */}
      {isMissingKey && process.env.NODE_ENV !== "production" && (
        <div className="mt-10 text-left bg-surface-muted/60 border border-border rounded-2xl p-5">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">
            Developer note
          </p>
          <p className="text-sm text-text-muted leading-relaxed">
            No valid Replicate API key was found. Add one to{" "}
            <code className="font-mono text-xs bg-white border border-border rounded px-1.5 py-0.5 text-foreground">
              .env.local
            </code>{" "}
            and restart the dev server:
          </p>
          <pre className="mt-3 bg-white border border-border rounded-xl p-3 text-xs font-mono text-foreground overflow-x-auto">
            REPLICATE_API_TOKEN=r8_your_real_token
          </pre>
          <p className="text-xs text-text-light mt-3">
            Create a token at replicate.com/account/api-tokens. Demo Mode works
            without one.
          </p>
        </div>
      )}
    </div>
  );
}

"use client";

interface LoadingAnimationProps {
  message?: string;
  subMessage?: string;
}

export default function LoadingAnimation({
  message = "Creating your new look...",
  subMessage = "Our AI is working its magic",
}: LoadingAnimationProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative w-32 h-32 mb-8">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-surface-muted" />
        {/* Spinning ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent animate-spin" />
        {/* Inner pulse */}
        <div className="absolute inset-4 rounded-full bg-accent-light animate-pulse-soft flex items-center justify-center">
          <span className="text-3xl">✨</span>
        </div>
      </div>

      <div className="text-center space-y-3">
        <h3 className="text-xl font-semibold text-foreground animate-pulse-soft">
          {message}
        </h3>
        <p className="text-text-muted text-sm">{subMessage}</p>
      </div>

      <div className="mt-8 flex items-center gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-accent rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      <p className="mt-6 text-xs text-text-light">
        This usually takes a few seconds
      </p>
    </div>
  );
}

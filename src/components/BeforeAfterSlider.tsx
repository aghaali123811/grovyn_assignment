"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const moveTo = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const percentage = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, percentage)));
  }, []);

  // Listen on the document so a drag keeps tracking once the pointer
  // leaves the image, and still ends if it is released outside.
  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => moveTo(e.clientX);
    const stopDragging = () => setIsDragging(false);

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", stopDragging);
    document.addEventListener("pointercancel", stopDragging);
    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", stopDragging);
      document.removeEventListener("pointercancel", stopDragging);
    };
  }, [isDragging, moveTo]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    moveTo(e.clientX);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    const next: Record<string, number> = {
      ArrowLeft: position - step,
      ArrowRight: position + step,
      Home: 0,
      End: 100,
    };
    if (!(e.key in next)) return;
    e.preventDefault();
    setPosition(Math.max(0, Math.min(100, next[e.key])));
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      className="relative w-full max-w-lg mx-auto aspect-[3/4] rounded-2xl overflow-hidden cursor-ew-resize select-none touch-none shadow-2xl bg-surface-muted"
    >
      {/* Generated result sits underneath and is revealed as the handle moves left */}
      <img
        src={afterImage}
        alt="Your generated look"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Original photo, clipped to the handle position. Clipping (rather than
          resizing the wrapper) keeps the two images pixel-aligned. */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt="Your original photo"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        <button
          type="button"
          role="slider"
          aria-label="Compare before and after"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          aria-valuetext={`${Math.round(position)}% original photo shown`}
          onKeyDown={handleKeyDown}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center cursor-ew-resize transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-stone-600"
            aria-hidden="true"
          >
            <path d="M18 8L22 12L18 16" />
            <path d="M6 8L2 12L6 16" />
          </svg>
        </button>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full z-10 pointer-events-none">
        Before
      </div>
      <div className="absolute top-4 right-4 bg-accent/80 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full z-10 pointer-events-none">
        After
      </div>
    </div>
  );
}

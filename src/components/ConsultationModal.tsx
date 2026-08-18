"use client";

import { useEffect, useRef, useState } from "react";
import { X, MessageCircle } from "lucide-react";
import type { TryOnStyle } from "@/data/styles";

interface ConsultationModalProps {
  style: TryOnStyle;
  open: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}

export default function ConsultationModal({
  style,
  open,
  onClose,
  onSubmitted,
}: ConsultationModalProps) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Close on Escape and lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No CRM behind this yet — the booking is acknowledged locally.
    // See README "Known limitations" for how this would be wired in production.
    setName("");
    setContact("");
    setNotes("");
    onSubmitted();
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consultation-title"
    >
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between p-6 pb-0">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-accent" />
            </span>
            <div>
              <h3
                id="consultation-title"
                className="text-lg font-bold text-foreground"
              >
                Request a consultation
              </h3>
              <p className="text-sm text-text-muted">
                About {style.productName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-muted transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 text-text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="consult-name"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Your name
            </label>
            <input
              ref={firstFieldRef}
              id="consult-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Priya Sharma"
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface-muted/40 text-foreground placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-shadow"
            />
          </div>

          <div>
            <label
              htmlFor="consult-contact"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Phone or email
            </label>
            <input
              id="consult-contact"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface-muted/40 text-foreground placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-shadow"
            />
          </div>

          <div>
            <label
              htmlFor="consult-notes"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Anything you&apos;d like the stylist to know{" "}
              <span className="text-text-light font-normal">(optional)</span>
            </label>
            <textarea
              id="consult-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="I'm looking for something low maintenance..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface-muted/40 text-foreground placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-shadow resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-foreground text-white py-4 rounded-xl font-semibold hover:bg-stone-800 transition-colors shadow-lg"
          >
            Request callback
          </button>
          <p className="text-xs text-text-light text-center">
            A LustraHair stylist will get back to you within 24 hours.
          </p>
        </form>
      </div>
    </div>
  );
}

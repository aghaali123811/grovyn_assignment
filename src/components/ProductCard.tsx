"use client";

import { Star, ShoppingBag, Heart, MessageCircle, ArrowRight, Check } from "lucide-react";
import type { TryOnStyle } from "@/data/styles";

interface ProductCardProps {
  style: TryOnStyle;
  onTryAnother: () => void;
  onAddToCart: () => void;
  onRequestConsultation: () => void;
  onToggleSave: () => void;
  onNotify: (message: string) => void;
  isSaved: boolean;
  isInCart: boolean;
}

export default function ProductCard({
  style,
  onTryAnother,
  onAddToCart,
  onRequestConsultation,
  onToggleSave,
  onNotify,
  isSaved,
  isInCart,
}: ProductCardProps) {
  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: `${style.productName} — LustraHair`,
      text: `I just tried on the ${style.name} look with LustraHair's AI try-on.`,
      url: shareUrl,
    };

    // Desktop Chrome exposes navigator.share but has no share target, so the
    // promise can hang forever and the button appears dead. Only use the Web
    // Share API where a native share sheet actually exists.
    const hasNativeShareSheet =
      typeof navigator.share === "function" &&
      window.matchMedia("(pointer: coarse)").matches;

    if (hasNativeShareSheet) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Dismissing the share sheet is a deliberate choice, not a failure.
        if (err instanceof Error && err.name === "AbortError") return;
        // Any other failure falls through to copying the link.
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      onNotify("Link copied — share your new look");
    } catch {
      onNotify("Couldn't share automatically. Copy the page URL instead.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl border border-border overflow-hidden">
        {/* Product Image */}
        <div className="relative aspect-[16/9] bg-surface-muted overflow-hidden">
          <img
            src={style.image}
            alt={style.productName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="bg-white/90 backdrop-blur-sm text-xs font-medium px-3 py-1.5 rounded-full text-stone-700">
              Featured Product
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {style.productName}
            </h2>
            <p className="text-text-muted mt-2 leading-relaxed">
              Premium human hair collection designed for the most natural look and
              feel. Invisible hand-tied knots, multi-directional part, and
              ultra-lightweight construction for all-day comfort.
            </p>
          </div>

          {/* Color Options */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Available in:
            </h4>
            <div className="flex flex-wrap gap-2">
              {style.availableColors.map((color) => (
                <span
                  key={color}
                  className="px-4 py-1.5 bg-surface-muted rounded-full text-sm text-text-muted border border-border"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>

          {/* Price and Rating */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-foreground">
                ₹{style.price.toLocaleString("en-IN")}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
                <span className="text-sm text-text-muted ml-1">4.8 (342 reviews)</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onAddToCart}
              aria-live="polite"
              className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg ${
                isInCart
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-foreground text-white hover:bg-stone-800"
              }`}
            >
              {isInCart ? (
                <>
                  <Check className="w-5 h-5" />
                  In Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart
                </>
              )}
            </button>
            <button
              onClick={onRequestConsultation}
              className="flex-1 bg-accent-light text-accent-dark py-4 px-6 rounded-xl font-semibold hover:bg-accent/20 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Request Consultation
            </button>
            <button
              onClick={onTryAnother}
              className="flex-1 border-2 border-border text-foreground py-4 px-6 rounded-xl font-semibold hover:bg-surface-muted transition-colors flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              Try Another Look
            </button>
          </div>

          {/* Secondary Actions */}
          <div className="flex items-center justify-center gap-6 pt-2">
            <button
              onClick={onToggleSave}
              aria-pressed={isSaved}
              className={`flex items-center gap-2 text-sm transition-colors ${
                isSaved ? "text-accent" : "text-text-muted hover:text-accent"
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? "fill-accent" : ""}`} />
              {isSaved ? "Saved" : "Save Look"}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import type { TryOnStyle } from "@/data/styles";

interface StyleSelectorProps {
  styles: TryOnStyle[];
  selectedStyle: TryOnStyle | null;
  onSelectStyle: (style: TryOnStyle) => void;
}

export default function StyleSelector({
  styles,
  selectedStyle,
  onSelectStyle,
}: StyleSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Looks" },
    { id: "style", label: "Hairstyles" },
    { id: "color", label: "Colors" },
  ];

  const filteredStyles =
    activeCategory === "all"
      ? styles
      : styles.filter((s) => s.category === activeCategory);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Category Tabs */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === cat.id
                ? "bg-foreground text-white shadow-md"
                : "bg-surface-muted text-text-muted hover:text-foreground hover:bg-border-light"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Style Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredStyles.map((style) => {
          const isSelected = selectedStyle?.id === style.id;
          return (
            <button
              key={style.id}
              onClick={() => onSelectStyle(style)}
              className={`group relative rounded-2xl overflow-hidden text-left transition-all duration-300 ${
                isSelected
                  ? "ring-2 ring-accent shadow-xl scale-[1.02]"
                  : "hover:shadow-lg hover:-translate-y-1"
              }`}
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-surface-muted">
                <img
                  src={style.image}
                  alt={style.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {isSelected && (
                  <div className="absolute top-3 right-3 w-7 h-7 bg-accent rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-full text-stone-700 capitalize">
                    {style.category}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white">
                <h3 className="font-semibold text-foreground text-sm">
                  {style.name}
                </h3>
                <p className="text-xs text-text-muted mt-1 line-clamp-2">
                  {style.description}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-bold text-foreground">
                    ₹{style.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-accent font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Try On
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedStyle && (
        <div className="mt-8 p-6 bg-accent-light/50 rounded-2xl border border-accent/10 animate-fade-in-up">
          <div className="flex items-start gap-4">
            <img
              src={selectedStyle.image}
              alt={selectedStyle.name}
              className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                {selectedStyle.name} Selected
              </h3>
              <p className="text-sm text-text-muted mt-1">
                {selectedStyle.description}
              </p>
              <p className="text-sm text-accent-dark mt-2 font-medium">
                Ready to see how this looks on you?
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

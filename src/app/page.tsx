"use client";

import { useState, useCallback, useRef } from "react";
import { Sparkles, ChevronDown, Check, ArrowRight, RotateCcw, Zap, ShoppingBag } from "lucide-react";
import PhotoUpload from "@/components/PhotoUpload";
import StyleSelector from "@/components/StyleSelector";
import LoadingAnimation from "@/components/LoadingAnimation";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import ProductCard from "@/components/ProductCard";
import ConsultationModal from "@/components/ConsultationModal";
import Toast, { type ToastMessage } from "@/components/Toast";
import type { TryOnStyle } from "@/data/styles";
import { STYLES } from "@/data/styles";

type Step = "landing" | "upload" | "select" | "processing" | "result";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>("landing");
  const [uploadedPhoto, setUploadedPhoto] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<TryOnStyle | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  // Commerce state. Deliberately in-memory: the brief asks for a believable
  // next action, not a real cart or checkout.
  const [cart, setCart] = useState<TryOnStyle[]>([]);
  const [savedLooks, setSavedLooks] = useState<string[]>([]);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastCounter = useRef(0);

  const handlePhotoSelected = useCallback(
    (file: File | null, preview: string) => {
      if (file && preview) {
        setUploadedPhoto({ file, preview });
        setCurrentStep("select");
      } else {
        setUploadedPhoto(null);
      }
    },
    []
  );

  const handleStyleSelect = useCallback((style: TryOnStyle) => {
    setSelectedStyle(style);
  }, []);

  const handleGenerateTryOn = useCallback(async () => {
    if (!uploadedPhoto || !selectedStyle) return;

    setCurrentStep("processing");

    try {
      const base64Image = uploadedPhoto.preview;
      const response = await fetch("/api/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64Image,
          styleId: selectedStyle.id,
          isDemo: demoMode,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResultImage(data.outputUrl);
        setCurrentStep("result");
      } else {
        console.error("API Error:", data.error);
        alert(data.error || "Failed to generate try-on. Please try again.");
        setCurrentStep("select");
      }
    } catch (error) {
      console.error("Generation error:", error);
      alert("Something went wrong. Please check your connection and try again.");
      setCurrentStep("select");
    }
  }, [uploadedPhoto, selectedStyle, demoMode]);

  const handleTryAnother = useCallback(() => {
    setSelectedStyle(null);
    setResultImage(null);
    setCurrentStep("select");
  }, []);

  const showToast = useCallback((message: string) => {
    toastCounter.current += 1;
    setToast({ id: toastCounter.current, message });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const handleAddToCart = useCallback(() => {
    if (!selectedStyle) return;
    if (cart.some((item) => item.id === selectedStyle.id)) {
      showToast(`${selectedStyle.productName} is already in your cart`);
      return;
    }
    setCart((prev) => [...prev, selectedStyle]);
    showToast(`${selectedStyle.productName} added to cart`);
  }, [cart, selectedStyle, showToast]);

  const handleToggleSave = useCallback(() => {
    if (!selectedStyle) return;
    const alreadySaved = savedLooks.includes(selectedStyle.id);
    setSavedLooks((prev) =>
      alreadySaved
        ? prev.filter((id) => id !== selectedStyle.id)
        : [...prev, selectedStyle.id]
    );
    showToast(
      alreadySaved
        ? "Look removed from your saved list"
        : "Look saved to your profile"
    );
  }, [savedLooks, selectedStyle, showToast]);

  const handleConsultationSubmitted = useCallback(() => {
    setConsultationOpen(false);
    showToast("Consultation requested \u2014 a stylist will call you within 24 hours");
  }, [showToast]);

  const handleViewCart = useCallback(() => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    showToast(
      `${cart.length} item${cart.length === 1 ? "" : "s"} in your cart \u00b7 \u20b9${total.toLocaleString("en-IN")}`
    );
  }, [cart, showToast]);

  const scrollToUpload = () => {
    document.getElementById("upload-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight">
                LustraHair
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setDemoMode(!demoMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  demoMode
                    ? "bg-amber-100 text-amber-700 border border-amber-200"
                    : "bg-surface-muted text-text-muted border border-border"
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{demoMode ? "Demo Mode" : "Live Mode"}</span>
                <span className="sm:hidden">{demoMode ? "Demo" : "Live"}</span>
              </button>
              {cart.length > 0 && (
                <button
                  onClick={handleViewCart}
                  aria-label={`View cart, ${cart.length} item${
                    cart.length === 1 ? "" : "s"
                  }`}
                  className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-muted transition-colors"
                >
                  <ShoppingBag className="w-5 h-5 text-foreground" />
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                </button>
              )}
              <button
                onClick={scrollToUpload}
                className="bg-foreground text-white px-4 sm:px-5 py-2 rounded-full text-sm hover:bg-stone-800 transition-colors"
              >
                Try It Now
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {currentStep === "landing" && (
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-surface-muted/50 to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-accent-light text-accent-dark px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in-up">
                <Sparkles className="w-4 h-4" />
                AI-Powered Virtual Try-On
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground tracking-tight leading-[1.1] mb-6 animate-fade-in-up">
                See Your Next Look
                <br />
                <span className="text-accent">Before You Buy</span>
              </h1>

              <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up">
                Upload a photo and preview different hair looks with our AI. Find
                your perfect style, length, and color with confidence.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
                <button
                  onClick={scrollToUpload}
                  className="w-full sm:w-auto bg-foreground text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-stone-800 transition-all hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Try It Now
                  <ArrowRight className="w-5 h-5" />
                </button>
                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto border-2 border-border text-foreground px-8 py-4 rounded-full font-semibold text-lg hover:bg-surface-muted transition-colors flex items-center justify-center gap-2"
                >
                  Learn More
                  <ChevronDown className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Hero Image Grid */}
            <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {STYLES.slice(0, 4).map((style, i) => (
                <div
                  key={style.id}
                  className="rounded-2xl overflow-hidden aspect-[3/4] shadow-lg hover:shadow-xl transition-shadow"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <img
                    src={style.image}
                    alt={style.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Three simple steps to find your perfect look
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Upload Your Photo",
                description:
                  "Take or upload a clear photo of yourself. We support all major image formats.",
                icon: "📸",
              },
              {
                step: "02",
                title: "Choose Your Style",
                description:
                  "Browse our curated collection of hairstyles, extensions, and colors.",
                icon: "💇",
              },
              {
                step: "03",
                title: "See The Magic",
                description:
                  "Our AI generates a realistic preview of how the look would appear on you.",
                icon: "✨",
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className="text-center p-8 rounded-3xl bg-surface-muted/50 hover:bg-surface-muted transition-colors"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="text-sm font-bold text-accent mb-2">
                  STEP {item.step}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section
        id="upload-section"
        className="py-20 bg-gradient-to-b from-white to-surface-muted/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Upload Your Photo
            </h2>
            <p className="text-lg text-text-muted max-w-xl mx-auto">
              Choose a clear, front-facing photo for the best results
            </p>
          </div>

          <PhotoUpload
            onPhotoSelected={handlePhotoSelected}
            selectedPhoto={uploadedPhoto}
          />

          {uploadedPhoto && (
            <div className="mt-8 text-center animate-fade-in-up">
              <button
                onClick={() => setCurrentStep("select")}
                className="inline-flex items-center gap-2 bg-foreground text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-stone-800 transition-all shadow-lg"
              >
                Choose Your Style
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Style Selection */}
      {currentStep === "select" && (
        <section id="styles" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Choose Your Look
              </h2>
              <p className="text-lg text-text-muted max-w-xl mx-auto">
                Select a hairstyle, extension, or color to preview on your photo
              </p>
            </div>

            <StyleSelector
              styles={STYLES}
              selectedStyle={selectedStyle}
              onSelectStyle={handleStyleSelect}
            />

            {selectedStyle && (
              <div className="mt-10 text-center animate-fade-in-up">
                <button
                  onClick={handleGenerateTryOn}
                  className="inline-flex items-center gap-3 bg-accent text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-accent-dark transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  <Sparkles className="w-6 h-6" />
                  Generate My New Look
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-sm text-text-muted mt-3">
                  This will take about 5-10 seconds
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Processing */}
      {currentStep === "processing" && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <LoadingAnimation
              message="Creating your new look..."
              subMessage="Our AI is working its magic"
            />
          </div>
        </section>
      )}

      {/* Result */}
      {currentStep === "result" && uploadedPhoto && selectedStyle && resultImage && (
        <section className="py-20 bg-gradient-to-b from-white to-surface-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Check className="w-4 h-4" />
                Try-On Complete
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Your New Look
              </h2>
              <p className="text-lg text-text-muted max-w-xl mx-auto">
                Drag the slider to compare before and after
              </p>
            </div>

            <BeforeAfterSlider
              beforeImage={uploadedPhoto.preview}
              afterImage={resultImage}
            />

            <div className="mt-8 text-center">
              <p className="text-sm text-text-muted mb-4">
                Selected style:{" "}
                <span className="font-semibold text-foreground">
                  {selectedStyle.name}
                </span>
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleTryAnother}
                  className="inline-flex items-center gap-2 border-2 border-border text-foreground px-6 py-3 rounded-full font-semibold hover:bg-surface-muted transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Another Look
                </button>
              </div>
            </div>

            {/* Product Card */}
            <div className="mt-16">
              <ProductCard
                style={selectedStyle}
                onTryAnother={handleTryAnother}
                onAddToCart={handleAddToCart}
                onRequestConsultation={() => setConsultationOpen(true)}
                onToggleSave={handleToggleSave}
                onNotify={showToast}
                isSaved={savedLooks.includes(selectedStyle.id)}
                isInCart={cart.some((item) => item.id === selectedStyle.id)}
              />
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-xl font-bold">LustraHair</span>
            </div>
            <p className="text-stone-400 text-sm">
              2025 LustraHair. All rights reserved. Premium hair extensions and
              wigs.
            </p>
          </div>
        </div>
      </footer>

      <Toast toast={toast} onDismiss={dismissToast} />

      {selectedStyle && (
        <ConsultationModal
          style={selectedStyle}
          open={consultationOpen}
          onClose={() => setConsultationOpen(false)}
          onSubmitted={handleConsultationSubmitted}
        />
      )}
    </div>
  );
}

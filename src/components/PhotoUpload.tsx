"use client";

import { useCallback, useState } from "react";
import { Camera, Upload, X, Check, AlertCircle } from "lucide-react";

interface PhotoUploadProps {
  onPhotoSelected: (file: File, preview: string) => void;
  selectedPhoto: { file: File; preview: string } | null;
}

export default function PhotoUpload({
  onPhotoSelected,
  selectedPhoto,
}: PhotoUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1024;
          let { width, height } = img;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas not supported"));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const validateFile = (file: File): string | null => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"];
    if (!validTypes.includes(file.type)) {
      return "Please upload a JPG, PNG, or WebP image.";
    }
    if (file.size > 10 * 1024 * 1024) {
      return "Image must be under 10MB.";
    }
    return null;
  };

  const processFile = useCallback(
    async (file: File) => {
      setError(null);
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      try {
        const resizedBase64 = await resizeImage(file);
        onPhotoSelected(file, resizedBase64);
      } catch (err) {
        setError("Failed to process image. Please try another file.");
      }
    },
    [onPhotoSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const removePhoto = useCallback(() => {
    setError(null);
    onPhotoSelected(null as any, "");
  }, [onPhotoSelected]);

  if (selectedPhoto) {
    return (
      <div className="w-full max-w-sm mx-auto">
        <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-green-200 bg-green-50">
          <img
            src={selectedPhoto.preview}
            alt="Your photo"
            className="w-full aspect-[3/4] object-cover"
          />
          <div className="absolute top-3 right-3">
            <button
              onClick={removePhoto}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
            >
              <X className="w-4 h-4 text-stone-600" />
            </button>
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 shadow-md">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-stone-700">
                Photo uploaded successfully
              </span>
            </div>
          </div>
        </div>
        <p className="text-center text-sm text-text-muted mt-3">
          Looking good! Now choose your style below.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragOver
            ? "border-accent bg-accent-light scale-[1.02]"
            : "border-border hover:border-accent/50 hover:bg-surface-muted/50"
        }`}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id="photo-upload"
        />

        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-surface-muted rounded-full flex items-center justify-center">
            <Upload className="w-7 h-7 text-accent" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">
              Upload your photo
            </p>
            <p className="text-sm text-text-muted mt-1">
              Drag & drop or click to browse
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-text-light">
            <Camera className="w-3.5 h-3.5" />
            <span>JPG, PNG or WebP up to 10MB</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

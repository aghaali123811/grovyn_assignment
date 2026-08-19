import Replicate from "replicate";
import type { TryOnStyle } from "@/data/styles";

/**
 * Raised when a live generation is requested but no usable Replicate
 * credential is available — unset, still holding the .env.example
 * placeholder, or rejected by Replicate itself.
 */
export class MissingApiKeyError extends Error {
  constructor(message = "No valid REPLICATE_API_TOKEN is configured.") {
    super(message);
    this.name = "MissingApiKeyError";
  }
}

const TRY_ON_MODEL =
  "timbrooks/instruct-pix2pix:1c221fc1709020613e5b57966b94e9a40e440a3015d232162b2eb02578bc0e7c";

const NEGATIVE_PROMPT =
  "deformed, distorted, disfigured, poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, blurry, amputation, watermark, signature, text";

/**
 * Stand-in results for Demo Mode. These are stock portraits, not generated
 * from the uploaded photo — see "Known limitations" in the README.
 */
const DEMO_RESULTS: Record<string, string> = {
  "long-straight": "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&h=800&fit=crop",
  "beach-waves": "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800&h=800&fit=crop",
  "curly": "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&h=800&fit=crop",
  "bob": "https://images.unsplash.com/photo-1608877607386-8698047d65a9?w=800&h=800&fit=crop",
  "layered": "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=800&fit=crop",
  "pixie": "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&h=800&fit=crop",
  "black": "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800&h=800&fit=crop",
  "brunette": "https://images.unsplash.com/photo-1554519515-242161756769?w=800&h=800&fit=crop",
  "blonde": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=800&fit=crop",
};

/**
 * Returns the token only if it could plausibly be real. A value copied
 * straight out of .env.example counts as absent, so Live Mode reports a
 * clear configuration error instead of surfacing a raw 401.
 */
function resolveApiToken(): string | null {
  const token = process.env.REPLICATE_API_TOKEN?.trim();
  if (!token) return null;

  const isPlaceholder =
    /^your[_-]/i.test(token) || /_here$/i.test(token) || /^r8_x+$/i.test(token);

  return isPlaceholder ? null : token;
}

/** Whether a real generation can be attempted right now. */
export function isLiveModeConfigured(): boolean {
  return resolveApiToken() !== null;
}

function isUnauthorized(error: unknown): boolean {
  if (typeof error === "object" && error !== null) {
    const { status, response } = error as {
      status?: number;
      response?: { status?: number };
    };
    if (status === 401 || response?.status === 401) return true;
  }
  return (
    error instanceof Error &&
    /\b401\b|unauthenticated|unauthorized/i.test(error.message)
  );
}

async function generateDemoResult(
  style: TryOnStyle
): Promise<{ outputUrl: string; processingTime: number }> {
  // Mimic a real generation so the loading state is exercised honestly.
  const processingTime = 3000 + Math.random() * 2000;
  await new Promise((resolve) => setTimeout(resolve, processingTime));

  return {
    outputUrl: DEMO_RESULTS[style.id] ?? DEMO_RESULTS["long-straight"],
    processingTime,
  };
}

export async function generateHairTryOn(
  imageBase64: string,
  style: TryOnStyle,
  isDemo = false
): Promise<{ outputUrl: string; processingTime: number }> {
  // Demo Mode is an explicit user choice and never needs a credential.
  if (isDemo) return generateDemoResult(style);

  const auth = resolveApiToken();
  if (!auth) throw new MissingApiKeyError();

  const replicate = new Replicate({ auth });
  const startTime = Date.now();

  let output: unknown;
  try {
    output = await replicate.run(TRY_ON_MODEL, {
      input: {
        image: imageBase64,
        prompt: style.prompt,
        negative_prompt: NEGATIVE_PROMPT,
        num_inference_steps: 30,
        guidance_scale: 7.5,
        image_guidance_scale: 1.5,
        seed: Math.floor(Math.random() * 1000000),
      },
    });
  } catch (error) {
    // A rejected key is a configuration problem, not a transient failure.
    if (isUnauthorized(error)) {
      throw new MissingApiKeyError(
        "Replicate rejected the configured REPLICATE_API_TOKEN."
      );
    }
    throw error;
  }

  const outputUrl = Array.isArray(output) ? output[0] : output;

  return {
    outputUrl: String(outputUrl),
    processingTime: Date.now() - startTime,
  };
}

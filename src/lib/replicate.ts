import Replicate from "replicate";

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

export const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
});

export async function generateHairTryOn(
  imageBase64: string,
  style: typeof import("@/data/styles").STYLES[0],
  isDemo = false
): Promise<{ outputUrl: string; processingTime: number }> {
  if (isDemo || !REPLICATE_API_TOKEN) {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(3000 + Math.random() * 2000);

    const demoImages: Record<string, string> = {
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

    return {
      outputUrl: demoImages[style.id] || demoImages["long-straight"],
      processingTime: 3000 + Math.random() * 2000,
    };
  }

  const startTime = Date.now();

  const output = await replicate.run(
    "timbrooks/instruct-pix2pix:1c221fc1709020613e5b57966b94e9a40e440a3015d232162b2eb02578bc0e7c",
    {
      input: {
        image: imageBase64,
        prompt: style.prompt,
        negative_prompt: "deformed, distorted, disfigured, poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, blurry, amputation, watermark, signature, text",
        num_inference_steps: 30,
        guidance_scale: 7.5,
        image_guidance_scale: 1.5,
        seed: Math.floor(Math.random() * 1000000),
      },
    }
  );

  const outputUrl = Array.isArray(output) ? output[0] : typeof output === "string" ? output : String(output);

  return {
    outputUrl: typeof outputUrl === "string" ? outputUrl : String(outputUrl),
    processingTime: Date.now() - startTime,
  };
}

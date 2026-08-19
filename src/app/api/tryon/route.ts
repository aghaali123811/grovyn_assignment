import { NextResponse } from "next/server";
import { generateHairTryOn, MissingApiKeyError } from "@/lib/replicate";
import { STYLES } from "@/data/styles";

export async function POST(request: Request) {
  try {
    const { image, styleId, isDemo = false } = await request.json();

    if (!image || !styleId) {
      return NextResponse.json(
        { error: "Missing required fields: image and styleId", code: "BAD_REQUEST" },
        { status: 400 }
      );
    }

    const style = STYLES.find((s) => s.id === styleId);

    if (!style) {
      return NextResponse.json(
        { error: "Invalid style selected", code: "BAD_REQUEST" },
        { status: 400 }
      );
    }

    const result = await generateHairTryOn(image, style, isDemo);

    return NextResponse.json({
      success: true,
      outputUrl: result.outputUrl,
      processingTime: result.processingTime,
    });
  } catch (error) {
    if (error instanceof MissingApiKeyError) {
      // Deliberately customer-safe wording. The client adds the developer
      // detail (which env var to set) only outside production.
      console.error("Try-on unavailable:", error.message);
      return NextResponse.json(
        {
          error:
            "AI try-on is temporarily unavailable. You can still preview the full experience in Demo Mode.",
          code: "MISSING_API_KEY",
        },
        { status: 503 }
      );
    }

    console.error("Try-on generation error:", error);
    return NextResponse.json(
      {
        error:
          "We couldn't create your look just now. Please try again in a moment.",
        code: "GENERATION_FAILED",
      },
      { status: 500 }
    );
  }
}

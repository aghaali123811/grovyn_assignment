import { NextResponse } from "next/server";
import { generateHairTryOn } from "@/lib/replicate";

export async function POST(request: Request) {
  try {
    const { image, styleId, isDemo = false } = await request.json();

    if (!image || !styleId) {
      return NextResponse.json(
        { error: "Missing required fields: image and styleId" },
        { status: 400 }
      );
    }

    const { STYLES } = await import("@/data/styles");
    const style = STYLES.find((s) => s.id === styleId);

    if (!style) {
      return NextResponse.json(
        { error: "Invalid style selected" },
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
    console.error("Try-on generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate try-on. Please try again." },
      { status: 500 }
    );
  }
}

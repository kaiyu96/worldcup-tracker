import { NextResponse } from "next/server";
import { fetchGammaPage } from "@/lib/polymarket";

export const revalidate = 300;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = clamp(Number(searchParams.get("limit") ?? 100), 1, 100);
  const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0);

  try {
    const markets = await fetchGammaPage(offset, limit);

    return NextResponse.json(markets, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Gamma API error";

    return NextResponse.json(
      {
        error: message
      },
      { status: 502 }
    );
  }
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return max;
  }

  return Math.min(Math.max(value, min), max);
}

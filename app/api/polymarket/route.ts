import { NextResponse } from "next/server";
import { getPolymarketSnapshot } from "@/lib/polymarket";

export async function GET() {
  const data = await getPolymarketSnapshot();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}

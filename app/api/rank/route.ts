import { fetchRank } from "@/app/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rank_id = body.rank_id;
    const rank = await fetchRank(Number(rank_id));
    return NextResponse.json(rank);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database Error:", error.message);
    } else {
      console.error("Unknown Error:", error);
    }
    return NextResponse.json(
      { error: "Failed to fetch rank data." },
      { status: 500 }
    );
  }
}

import { fetchLastMonthGoal } from "@/app/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    const data = await fetchLastMonthGoal(Number(user_id));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Database error", error);
  }
}

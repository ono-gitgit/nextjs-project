import { fetchLastMonthGoal, fetchThisMonthGoal } from "@/app/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    const targetMonth = searchParams.get("target_month");
    if (targetMonth === "lastMonth") {
      const data = await fetchLastMonthGoal(Number(user_id));
      return NextResponse.json(data);
    } else if (targetMonth === "thisMonth") {
      const data = await fetchThisMonthGoal(Number(user_id));
      return NextResponse.json(data);
    } else {
      throw new Error("URLにパラメータ（target_month）を指定してください");
    }
  } catch (error) {
    console.error("Database error", error);
  }
}

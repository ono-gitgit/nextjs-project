import { fetchFixedExpenses, updateFixedExpenses } from "@/app/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    if (user_id) {
      const data = await fetchFixedExpenses(Number(user_id));
      return NextResponse.json(data);
    } else {
      throw new Error("URLにパラメータを入れてください");
    }
  } catch (error) {
    console.error("Failed to fetch fixed expenses data.", error);
  }
}

export async function POST(req: NextRequest) {
  const { user_id, sendedFixedExpensesList } = await req.json();
  try {
    await updateFixedExpenses(user_id, sendedFixedExpensesList);
    return NextResponse.json({ succsess: true });
  } catch (error) {
    console.error("Database error", error);
  }
}

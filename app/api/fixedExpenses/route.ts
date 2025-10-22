import { updateFixedExpenses } from "@/app/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { user_id, sendedFixedExpensesList } = await req.json();
  try {
    await updateFixedExpenses(user_id, sendedFixedExpensesList);
    return NextResponse.json({ succsess: true });
  } catch (error) {
    console.error("Database error", error);
  }
}

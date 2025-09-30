import { fetchThisMonthRecordSum, updateRecord } from "@/app/lib/api";
import { NextRequest, NextResponse } from "next/server";

//ログインユーザーの今月の支出を取得
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = Number(searchParams.get("user_id"));
    const data = await fetchThisMonthRecordSum(user_id);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database Error:", error.message);
    } else {
      console.error("Unknown Error:", error);
    }
    return NextResponse.json(
      { error: "Failed to fetch this month data." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user_id = body.user_id;
    const date = body.date;
    const RecordFormValue = body.RecordFormValue;
    await updateRecord(user_id, date, RecordFormValue);
    return NextResponse.json({ result: "success" });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database Error:", error.message);
    } else {
      console.error("Unknown Error:", error);
    }
    return NextResponse.json(
      { error: "Failed to update userGoal data." },
      { status: 500 }
    );
  }
}

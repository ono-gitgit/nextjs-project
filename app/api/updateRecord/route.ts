import { updateRecord } from "@/app/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user_id = body.user_id;
    const RecordFormValue = body.RecordFormValue;
    await updateRecord(user_id, RecordFormValue);
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

import {
  fetchDayCategoriesRecord,
  fetchDayRecordSum,
  fetchRecordAverage,
  fetchThisMonthRecordSum,
  fetchThisYearExpenses,
  updateRecord,
} from "@/app/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = Number(searchParams.get("user_id"));
    const target = searchParams.get("target");
    if (target == "thisMonth") {
      const data = await fetchThisMonthRecordSum(user_id);
      return NextResponse.json(data);
    } else if (target == "thisYear") {
      const data = await fetchThisYearExpenses(
        new Date().getFullYear().toString(),
        user_id
      );
      return NextResponse.json(data);
    } else if (target == "average") {
      const data = await fetchRecordAverage(user_id);
      return NextResponse.json(data);
    } else if (target == "days") {
      const data = await fetchDayRecordSum(user_id);
      return NextResponse.json(data);
    } else if (target == "dayCategoriesRecord") {
      const data = await fetchDayCategoriesRecord(
        searchParams.get("date") as string,
        user_id
      );
      return NextResponse.json(data);
    }
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

import { fetchUserIcon } from "@/app/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const icon_id = body.icon_id;
    const user_icon = await fetchUserIcon(Number(icon_id));
    return NextResponse.json(user_icon);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database Error:", error.message);
    } else {
      console.error("Unknown Error:", error);
    }
    return NextResponse.json(
      { error: "Failed to fetch user_icon data." },
      { status: 500 }
    );
  }
}

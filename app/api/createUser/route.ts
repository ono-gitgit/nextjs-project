import { createUser } from "@/app/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await body.user;
    await createUser(user);
    return NextResponse.json({ succsess: true });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database Error:", error.message);
    } else {
      console.error("Unknown Error:", error);
    }
    return NextResponse.json(
      { error: "Failed to create user data." },
      { status: 500 }
    );
  }
}

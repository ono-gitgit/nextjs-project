import { fetchUsers, createUser } from "@/app/lib/api";
import { NextResponse, NextRequest } from "next/server";

//ユーザー検索
export async function GET() {
  try {
    const users = await fetchUsers();
    return NextResponse.json(users);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database Error:", error.message);
    } else {
      console.error("Unknown Error:", error);
    }
    throw new Error("Failed to fetch user data.");
  }
}

//ユーザー（アカウント）作成
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

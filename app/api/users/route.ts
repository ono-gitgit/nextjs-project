import {
  createUser,
  editUser,
  fetchTheUser,
  fetchUserToCheckLogin,
} from "@/app/lib/api";
import { NextResponse, NextRequest } from "next/server";

//ユーザー検索
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = Number(searchParams.get("user_id"));
    if (user_id) {
      const theUser = await fetchTheUser(user_id);
      return NextResponse.json(theUser);
    }
    const emai_address = String(searchParams.get("email_address"));
    const password = String(searchParams.get("password"));
    const users = await fetchUserToCheckLogin(emai_address, password);
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await body.user;
    const target = await body.target;
    if (target === "add") {
      await createUser(user);
      return NextResponse.json({ succsess: true });
    } else if (target === "edit") {
      const user_id = await body.user_id;
      await editUser(user_id, user);
      return NextResponse.json({ succsess: true });
    }
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

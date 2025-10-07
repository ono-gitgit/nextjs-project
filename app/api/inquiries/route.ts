import { createInquiry } from "@/app/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);
    await createInquiry(body);
    return NextResponse.json({ succsess: true });
  } catch (error) {
    console.error("Route error", error);
    throw new Error("Failed to input inquiry data.");
  }
}

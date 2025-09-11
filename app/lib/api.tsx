"use server";
import { neon } from "@neondatabase/serverless";

const sql = neon(`${process.env.DATABASE_URL}`);

//ユーザーデータの取得
export async function fetchUser() {
  try {
    const data =
      await sql`SELECT id, name, password, email_address, icon, goal, rank_id, is_deleted FROM users`;
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user data.");
  }
}

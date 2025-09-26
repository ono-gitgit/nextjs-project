"use server";
import { neon } from "@neondatabase/serverless";
import { RecordFormValue, User } from "@/app/types/types";
import { formatDate } from "@/app/lib/utils";

const sql = neon(`${process.env.DATABASE_URL}`);

//ユーザーデータの取得
export async function fetchUsers() {
  try {
    const data =
      await sql`SELECT id, name, password, email_address, icon_id, goal, rank_id, is_deleted FROM users`;
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user data.");
  }
}

//ユーザーの作成
export async function createUser(user: User) {
  try {
    const data =
      await sql`INSERT INTO users(name, password, email_address, icon_id, rank_id, is_deleted) 
      VALUES (${user.name}, ${user.password}, ${user.email_address}, ${
        user.icon_id
      }, ${1}, ${false}) 
      RETURNING *; `;
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create user data.");
  }
}

//ユーザーのアイコンの取得
export async function fetchUserIcon(icon_id: number) {
  try {
    const data = await sql`SELECT path FROM user_icons WHERE id = ${icon_id};`;
    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch icon data.");
  }
}

//ランクデータの取得
export async function fetchRank(id: number) {
  try {
    const data = await sql`SELECT name, icon FROM ranks WHERE id = ${id};`;
    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch rank data.");
  }
}

//目標金額の設定
export async function updateUserGoal(id: number, goal: number) {
  try {
    const data =
      await sql`UPDATE users SET goal = ${goal} WHERE id = ${id} RETURNING *;`;
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create user data.");
  }
}

//今日の支出金額の合計
export async function fetchTodayRecordSum(user_id: number) {
  try {
    const today = formatDate(new Date());
    const data =
      await sql`SELECT SUM(amount) FROM expenses WHERE recorded_on = ${today} AND user_id = ${user_id};`;
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create user data.");
  }
}

//支出金額の記録
export async function updateRecord(
  user_id: number,
  formValue: RecordFormValue
) {
  try {
    const today = formatDate(new Date());
    const existingData =
      await sql`SELECT recorded_on, user_id, category_id FROM expenses 
      WHERE recorded_on = ${today} AND user_id = ${user_id};`;

    type RecordFormValueKey = keyof RecordFormValue;
    if (existingData.length > 0) {
      for (let i = 1; i <= Object.keys(formValue).length; i++) {
        const key = String(i) as RecordFormValueKey;
        const amount = String(formValue[key]) === "" ? null : formValue[key];
        await sql`UPDATE expenses SET amount = ${amount} WHERE recorded_on = ${today} AND user_id = ${user_id} AND category_id = ${i};`;
      }
    } else {
      for (let i = 1; i <= Object.keys(formValue).length; i++) {
        const key = String(i) as RecordFormValueKey;
        const amount = String(formValue[key]) === "" ? null : formValue[key];
        await sql`INSERT INTO expenses(recorded_on, amount, user_id, category_id) VALUES (${today}, ${amount}, ${user_id}, ${i});`;
      }
    }
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create user data.");
  }
}

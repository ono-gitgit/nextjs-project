"use server";
import { neon } from "@neondatabase/serverless";
import { User } from "@/app/types/types";

const sql = neon(`${process.env.DATABASE_URL}`);

//ユーザーデータの取得
export async function fetchUsers() {
  try {
    const data =
      await sql`SELECT id, name, password, email_address, icon_id, goal, rank_id, is_deleted FROM users;`;
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user data.");
  }
}

//特定のユーザーの取得
export async function fetchTheUser(user_id: number) {
  try {
    const data =
      await sql`SELECT name, password, email_address, icon_id, password FROM users WHERE id = ${user_id};`;
    return data[0];
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

//ユーザーの編集
export async function editUser(user_id: number, user: User) {
  try {
    await sql`UPDATE users SET name = ${user.name}, password = ${user.password}, email_address = ${user.email_address}, icon_id = ${user.icon_id} 
    WHERE id = ${user_id};`;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to edit user data.");
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

//カテゴリの取得
export async function fetchCategories() {
  try {
    const data = await sql`SELECT id, name FROM categories`;
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch categories data.");
  }
}

//今月の支出金額の合計
export async function fetchThisMonthRecordSum(user_id: number) {
  try {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const firstDay = `${year}-${month}-01`;
    const lastDay = `${year}-${month}-${new Date(
      year,
      date.getMonth() + 1,
      0
    ).getDate()}`;

    const data = await sql`
      SELECT SUM(amount) AS sum
      FROM expenses
      WHERE recorded_on >= ${firstDay}
        AND recorded_on <= ${lastDay}
        AND user_id = ${user_id};
    `;

    return data[0].sum || 0;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch this month data.");
  }
}

//今年の出費（グラフのデータ）の取得
export async function fetchThisYearExpenses(thisYear: string, user_id: number) {
  try {
    const data = await sql`SELECT EXTRACT(YEAR FROM recorded_on) AS year,
    CASE EXTRACT(MONTH FROM recorded_on)
    WHEN 1 THEN '1月'
    WHEN 2 THEN '2月'
    WHEN 3 THEN '3月'
    WHEN 4 THEN '4月'
    WHEN 5 THEN '5月'
    WHEN 6 THEN '6月'
    WHEN 7 THEN '7月'
    WHEN 8 THEN '8月'
    WHEN 9 THEN '9月'
    WHEN 10 THEN '10月'
    WHEN 11 THEN '11月'
    WHEN 12 THEN '12月'
    END AS month, 
    SUM(amount) AS amount_sum FROM expenses 
    WHERE EXTRACT(YEAR FROM recorded_on) = ${thisYear} AND user_id = ${user_id} GROUP BY year, month ORDER BY month;`;
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch this yesr record data.");
  }
}

//これまでの支出平均（カテゴリ別）
export async function fetchRecordAverage(user_id: number) {
  try {
    const data =
      await sql`SELECT e.category_id, c.name AS category_name, AVG(e.amount) AS avg FROM expenses AS e
      INNER JOIN categories AS c ON e.category_id = c.id
      WHERE e.user_id = ${user_id} GROUP BY e.category_id, c.name ORDER BY avg DESC;`;
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch average record data.");
  }
}

//日ごとの支出合計
export async function fetchDayRecordSum(user_id: number) {
  try {
    const data = await sql`
      SELECT recorded_on as date, amount
      FROM expenses WHERE
        user_id = ${user_id};`;
    return data || 0;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch some day record data.");
  }
}

//日ごとのカテゴリ別支出合計
export async function fetchDayCategoriesRecord(date: string, user_id: number) {
  try {
    const data =
      await sql`SELECT amount, category_id FROM expenses WHERE recorded_on = ${date} AND user_id = ${user_id}`;
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch some day categories record data.");
  }
}

//支出金額の記録
export async function updateRecord(
  user_id: number,
  date: Date,
  formValue: Record<string, number>
) {
  try {
    const existingData =
      await sql`SELECT recorded_on, user_id, category_id FROM expenses
      WHERE recorded_on = ${date} AND user_id = ${user_id};`;
    const categories = await sql`SELECT id FROM categories `;
    for (const categoryId of categories) {
      const id = categoryId.id;
      const amount = formValue[id];
      let isUpdate = false;
      if (String(amount) !== "") {
        for (const data of existingData) {
          if (data.category_id == id) {
            await sql`UPDATE expenses SET amount = ${amount} WHERE recorded_on = ${date} AND user_id = ${user_id} AND category_id = ${id};`;
            isUpdate = true;
          }
        }
        if (!isUpdate) {
          await sql`INSERT INTO expenses(recorded_on, amount, user_id, category_id) VALUES (${date}, ${amount}, ${user_id}, ${id});`;
        }
      }
    }
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create user data.");
  }
}

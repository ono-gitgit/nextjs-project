import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// --- 型定義 ---
type MailRequest = {
  email: string;
  subject: string;
  message: string;
};

// --- メール送信用ハンドラー ---
export async function POST(req: Request) {
  try {
    const body: MailRequest = await req.json();

    // 入力チェック
    if (!body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: "メールアドレス・件名・本文は必須です。" },
        { status: 400 }
      );
    }

    // nodemailer設定
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: true, // 465ポートの場合はtrue
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // メール送信
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: body.email,
      subject: body.subject,
      text: body.message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("メール送信エラー:", error);
    return NextResponse.json(
      { error: "メール送信に失敗しました。" },
      { status: 500 }
    );
  }
}

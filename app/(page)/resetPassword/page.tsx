"use client";

import React, { useEffect, useState } from "react";
import Form from "@/app/components/Form";
import { FormArray } from "@/app/types/types";
import { BackgroundColor } from "@/app/components/BackgroundColor";

export default function MailForm() {
  const [loading, setLoading] = useState(false);
  const [oneTimePassword, setOneTimePassword] = useState("");

  const generateOneTimePassword = (length: number) => {
    const smallCharsAndNum = "abcdefghijklmnopqrstuvwxyz0123456789";
    const bigChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let oneTimePassword = "";
    for (let i = 0; i < length; i++) {
      oneTimePassword +=
        smallCharsAndNum.charAt(Math.floor(Math.random() * length)) +
        bigChars.charAt(Math.floor(Math.random() * length));
    }
    setOneTimePassword(oneTimePassword);
  };

  useEffect(() => {
    generateOneTimePassword(10);
  }, []);

  // 各フォーム要素の定義
  const formArray: FormArray[] = [
    {
      name: "email",
      label: "メールアドレス",
      type: "email",
      value: "",
      validationRule: {
        required: "メールアドレスを入力してください",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "有効なメールアドレスを入力してください",
        },
      },
    },
    {
      name: "subject",
      label: "",
      type: "hidden",
      value: "家計簿アプリ ワンタイムパスワード",
      validationRule: {
        required: "件名を入力してください",
      },
    },
    {
      name: "message",
      label: "",
      type: "hidden",
      value: `お客様のパスワードを再発行するためには、以下の認証コードを入力してください。\n\n認証コード：${oneTimePassword}\n\n※本メールに心当たりがない場合は、お手数ですが本メールを破棄してください。\n\n\n有効期限：2021年12月23日22時22分\n発行元：家計簿アプリ`,
      validationRule: {
        required: "本文を入力してください",
      },
    },
  ];

  // フォーム送信時の処理
  const handleSubmit = async (values: Record<string, string | number>) => {
    setLoading(true);
    try {
      const res = await fetch("/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      alert(
        data.success ? "送信しました！" : `送信に失敗しました: ${data.error}`
      );
    } catch (error) {
      console.error("メール送信エラー:", error);
      alert("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundColor isLoading={false}>
      <Form
        title="ワンタイムパスワード設定"
        description="入力いただいたメールアドレス宛に、ワンタイムパスワードをお送りします"
        formArray={formArray}
        onSubmit={handleSubmit}
        bottonName={loading ? "送信中..." : "送信"}
      />
    </BackgroundColor>
  );
}

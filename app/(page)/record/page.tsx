"use client";
import { BackgroundColor } from "@/app/components/BackgroundColor";
import Form from "@/app/components/Form";
import { RecordFormValue } from "@/app/types/types";
import { useEffect, useState } from "react";

export default function Record() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("navigation", "record");
  });

  const formArray = [
    {
      label: "食費",
      name: "1",
      value: "",
      validationRule: {
        maxLength: {
          value: 6,
          message: "入力できるのは６桁までです",
        },
      },
      type: "number",
    },
    {
      label: "趣味",
      name: "2",
      value: "",
      validationRule: {
        maxLength: {
          value: 6,
          message: "入力できるのは６桁までです",
        },
      },
      type: "number",
    },
    {
      label: "交通費",
      name: "3",
      value: "",
      validationRule: {
        maxLength: {
          value: 6,
          message: "入力できるのは６桁までです",
        },
      },
      type: "number",
    },
    {
      label: "通信費",
      name: "4",
      value: "",
      validationRule: {
        maxLength: {
          value: 6,
          message: "入力できるのは６桁までです",
        },
      },
      type: "number",
    },
    {
      label: "光熱費",
      name: "6",
      value: "",
      validationRule: {
        maxLength: {
          value: 6,
          message: "入力できるのは６桁までです",
        },
      },
      type: "number",
    },
    {
      label: "その他",
      name: "5",
      value: "",
      validationRule: {
        maxLength: {
          value: 6,
          message: "入力できるのは６桁までです",
        },
      },
      type: "number",
    },
  ];

  const onClick = async (formValues: RecordFormValue) => {
    setIsLoading(true);
    const data = await fetch("/api/updateRecord", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: sessionStorage.getItem("user_id"),
        RecordFormValue: formValues,
      }),
    });
    const json = await data.json();
    if (json.result === "success") {
      alert("記録しました");
    }
    setIsLoading(false);
  };
  return (
    <BackgroundColor isLoading={isLoading}>
      <Form
        icon="/monyFlyYen.png"
        iconDescription="羽が生えて飛んでいくお金のイラスト"
        title="今日の支出を記録する"
        description="全て数値のみで入力してください"
        yenMark="￥"
        formArray={formArray}
        onSubmit={(formValues) => {
          onClick(formValues as RecordFormValue);
        }}
        bottonName="記録する"
      ></Form>
    </BackgroundColor>
  );
}

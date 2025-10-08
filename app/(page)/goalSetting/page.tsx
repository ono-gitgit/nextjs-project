"use client";

import { BackgroundColor } from "@/app/components/BackgroundColor";
import Form from "@/app/components/Form";
import { GoalSettingFormValue } from "@/app/types/types";
import { useState } from "react";

export default function GoalSetting() {
  const [isLoading, setIsLoading] = useState(false);

  const formArray = [
    {
      label: "予算（数値のみ）",
      name: "goal",
      value: "",
      validationRule: {
        required: "予算が入力されていません",
        maxLength: {
          value: 6,
          message: "入力できるの６桁までです",
        },
      },
      type: "number",
    },
  ];

  const onClick = async (formValues: GoalSettingFormValue) => {
    setIsLoading(true);
    const data = await fetch("/api/updateUserGoal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: Number(sessionStorage.getItem("user_id")),
        goal: formValues.goal,
      }),
    });
    const results = await data.json();
    if (results.result === "success") {
      sessionStorage.setItem("goal", String(formValues.goal));
      alert("登録しました");
    }
    setIsLoading(false);
  };
  return (
    <>
      <BackgroundColor isLoading={isLoading}>
        <Form
          icon="/snowboardingRabbit.png"
          iconDescription="スノーボードをしているウサギのイラスト"
          title="予算を設定する"
          description="今月の予算を入力してください"
          yenMark="￥"
          formArray={formArray}
          onSubmit={(formValues) => {
            onClick(formValues as GoalSettingFormValue);
          }}
          bottonName="設定する"
        ></Form>
      </BackgroundColor>
    </>
  );
}

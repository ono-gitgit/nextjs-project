"use client";

import { BackgroundColor } from "@/app/components/BackgroundColor";
import Form from "@/app/components/Form";
import InputCompleteDialog from "@/app/components/InputCompleteDialog";
import { GoalSettingFormValue } from "@/app/types/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function GoalSetting() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [goal, setGoal] = useState<number>(0);

  const fetchGoal = useCallback(async () => {
    const data = await fetch(
      `/api/goals?user_id=${sessionStorage.getItem(
        "user_id"
      )}&target_month=thisMonth`
    );
    const thisMonthGoal = await data.json();
    setGoal(() => thisMonthGoal.this_month_goal);
  }, []);

  useEffect(() => {
    fetchGoal();
  }, [fetchGoal]);

  const formArray = [
    {
      label: "予算（数値のみ）",
      name: "goal",
      value: goal,
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
      setIsDialogOpen(true);
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
          yenKanji="円"
          formArray={formArray}
          onSubmit={(formValues) => {
            onClick(formValues as GoalSettingFormValue);
          }}
          bottonName="設定する"
        ></Form>
        <InputCompleteDialog
          isDialogOpen={isDialogOpen}
          dialogMessage={"予算を設定できました"}
          onClick={() => {
            sessionStorage.setItem("navigation", "home");
            router.push("/home");
          }}
        />
      </BackgroundColor>
    </>
  );
}

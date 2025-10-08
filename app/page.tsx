"use client";
import Form from "@/app/components/Form";
import { BackgroundColor } from "./components/BackgroundColor";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoginFormValue } from "./types/types";

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const formArray = [
    {
      label: "メールアドレス",
      name: "email_address",
      value: "",
      validationRule: {
        required: "メールアドレスは必須です",
        pattern: {
          value: /^\S+[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "メールアドレスを正しく入力してください",
        },
      },
      type: "text",
    },
    {
      label: "パスワード",
      name: "password",
      value: "",
      validationRule: {
        required: "パスワードは必須です",
        maxLength: {
          value: 20,
          message: "パスワードは２０文字以内で入力して下さい",
        },
        pattern: {
          value: /^\S+$/,
          message: "先頭と末尾に空白文字を入れないください",
        },
      },
      type: "password",
      link: "パスワードを忘れた場合は、こちらをクリック",
      linkPath: "/resetPassword",
    },
  ];

  const updateSessionAndDataRankId = async (
    user_id: number,
    rank_id: number
  ) => {
    await fetch("/api/users?target=updateRankId", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, rank_id }),
    });
    sessionStorage.setItem("rank_id", String(rank_id));
  };

  const updateRankId = async (user_id: number, goal: number) => {
    const record = await fetch(
      `/api/records?user_id=${user_id}&target=lastMonth`
    );
    const recordJson = await record.json();
    const recordJsonNum = Number(recordJson);
    const budgetDeviation = ((goal - recordJsonNum) / goal) * 100;
    if (budgetDeviation < 1 || recordJsonNum === 0 || goal === null) {
      await updateSessionAndDataRankId(user_id, 1);
    } else if (budgetDeviation >= 1 && budgetDeviation < 5) {
      await updateSessionAndDataRankId(user_id, 2);
    } else if (budgetDeviation >= 5 && budgetDeviation < 10) {
      await updateSessionAndDataRankId(user_id, 3);
    } else if (budgetDeviation >= 10 && budgetDeviation < 20) {
      await updateSessionAndDataRankId(user_id, 4);
    } else if (budgetDeviation >= 20) {
      await updateSessionAndDataRankId(user_id, 5);
    }
  };

  const onClick = async (formValues: LoginFormValue) => {
    setIsLoading(true);
    const users = await fetch(
      `/api/users?email_address=${formValues.email_address}&password=${formValues.password}`
    );
    const userJson = await users.json();
    const lastMonthGoal = await fetch(`/api/goals?user_id=${userJson.id}`);
    const lastMonthGoalJson = await lastMonthGoal.json();
    console.log("AAAAAAAA");
    console.log(lastMonthGoalJson);
    if (userJson.is_deleted === false) {
      sessionStorage.setItem("navigation", "home");
      sessionStorage.setItem("user_id", userJson.id);
      sessionStorage.setItem("user_name", userJson.name);
      sessionStorage.setItem("icon_id", userJson.icon_id);
      sessionStorage.setItem("goal", userJson.goal);
      if (lastMonthGoalJson.last_month_goal) {
        await updateRankId(userJson.id, lastMonthGoalJson.last_month_goal);
      } else {
        sessionStorage.setItem("rank_id", "1");
      }
      router.push("/home");
    } else {
      console.log(formValues.email_address);
      alert("該当するユーザーは存在しません");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    sessionStorage.removeItem("navigation");
  }, []);
  return (
    <>
      <BackgroundColor isLoading={isLoading}>
        <Form
          icon="/companyLogo.png"
          iconDescription="当アプリのロゴ"
          title="ログイン"
          description="アプリを利用するにはサインインが必要です"
          formArray={formArray}
          onSubmit={(formValues) =>
            onClick(formValues as { email_address: string; password: string })
          }
          bottonName="ログイン"
        >
          <a
            className="mt-5 mx-auto text-blue-600 underline text-[15px] text-center"
            onClick={() => {
              setIsLoading(true);
              router.push("/createAccount");
            }}
          >
            アカウントをお持ちでない方は <br />
            こちらをクリック
          </a>
        </Form>
      </BackgroundColor>
    </>
  );
}

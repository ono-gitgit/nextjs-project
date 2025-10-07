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

  const onClick = async (formValues: LoginFormValue) => {
    setIsLoading(true);
    const users = await fetch(
      `/api/users?email_address=${formValues.email_address}&password=${formValues.password}`
    );
    const json = await users.json();
    if (json.is_deleted === false) {
      sessionStorage.setItem("navigation", "home");
      sessionStorage.setItem("user_id", json.id);
      sessionStorage.setItem("user_name", json.name);
      sessionStorage.setItem("icon_id", json.icon_id);
      sessionStorage.setItem("goal", json.goal);
      sessionStorage.setItem("rank_id", json.rank_id);
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

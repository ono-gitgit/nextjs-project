"use client";
import Form from "@/app/components/Form";
import { BackgroundColor } from "./components/BackgroundColor";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const formArray = [
    {
      label: "メールアドレス",
      name: "mail",
      value: "",
      validationRule: {
        required: "メールアドレスは必須です",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "メールアドレスを正しく入力してください",
        },
      },
      type: "text",
      link: "",
      linkPath: "",
    },
    {
      label: "パスワード",
      name: "password",
      value: "",
      validationRule: {
        required: "パスワードは必須です",
        maxLength: {
          value: 20,
          message: "パスワードは２０文字以内にしてください",
        },
      },
      type: "password",
      link: "パスワードを忘れた場合は、こちらをクリック",
      linkPath: "/resetPassword",
    },
  ];

  type formValue = {
    mail: string;
    password: string | number;
  };
  const onClick = async (argument: formValue) => {
    setIsLoading(true);
    const users = await fetch("/api/users");
    const json = await users.json();
    for (const user of json) {
      if (
        user.email_address == argument.mail &&
        user.password == argument.password
      ) {
        router.push("/top");
      } else {
        console.log(argument.mail);
        alert("該当するユーザーは存在しません");
      }
    }
    setIsLoading(false);
  };
  return (
    <>
      <BackgroundColor>
        <Form
          icon="/companyLogo.png"
          iconDescription="Next.js logo"
          title="ログイン"
          description="アプリを利用するにはサインインが必要です"
          formArray={formArray}
          onSubmit={(argument) =>
            onClick(argument as { mail: string; password: string })
          }
          isLoading={isLoading}
          bottonName="ログイン"
        >
          <a href="https" className="mt-5 text-blue-600 underline text-[15px]">
            アカウントをお持ちでない方は、 <br />
            こちらをクリック
          </a>
        </Form>
      </BackgroundColor>
    </>
  );
}

"use client";
import Form from "@/app/components/Form";
import { BackgroundColor } from "@/app/components/BackgroundColor";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CreateAccountFormValue } from "@/app/types/types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import { IconData } from "@/app/sampleData/iconData";

export default function CreateAccount() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formArray = [
    {
      label: "名前",
      name: "name",
      value: "",
      validationRule: {
        required: "名前は必須です",
        maxLength: {
          value: 255,
          message: "名前は２５５文字以内で入力して下さい",
        },
        pattern: {
          value: /^\S(.*\S)?$/,
          message: "先頭と末尾に空白文字を入れないください",
        },
      },
      type: "text",
    },
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
          message: "パスワードは２０文字以内で入力してください",
        },
        pattern: {
          value: /^(?=.*[A-Z])(?=.*[a-z0-9])[A-Za-z0-9]+$/,
          message: "半角英数字と大文字のアルファベットを使用してください",
        },
      },
      type: "password",
    },
    {
      label: "プロフィール画像",
      name: "icon_id",
      value: "",
      validationRule: {
        required: "プロフィール画像を選択してください",
      },
      type: "radio",
      radioOptions: IconData,
    },
  ];

  const onClick = async (user: CreateAccountFormValue) => {
    setIsLoading(true);
    const response = await fetch("/api/createUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user }),
    });
    const result = await response.json();
    if (result.succsess) {
      setIsDialogOpen(true);
      const users = await fetch("/api/users");
      const json = await users.json();
      for (const aUser of json) {
        console.log(aUser.id);
        if (
          aUser.name == user.name &&
          aUser.email_address == user.email_address &&
          aUser.password == user.password &&
          aUser.icon_id == user.icon_id
        ) {
          sessionStorage.setItem("user_id", aUser.id);
          sessionStorage.setItem("user_name", user.name);
          sessionStorage.setItem("icon_id", String(user.icon_id));
          sessionStorage.setItem("rank_id", "1");
          break;
        }
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    sessionStorage.clear();
  }, []);
  return (
    <>
      <BackgroundColor isLoading={isLoading}>
        <Form
          icon=""
          iconDescription=""
          title="アカウント作成"
          description="アプリを利用するにはサインインが必要です"
          formArray={formArray}
          onSubmit={(formValues) =>
            onClick(
              formValues as {
                name: string;
                email_address: string;
                password: string;
                icon_id: number;
              }
            )
          }
          bottonName="アカウント作成"
        >
          <a
            className="mt-5 mx-auto text-blue-600 underline text-[15px]"
            onClick={() => {
              setIsLoading(true);
              router.push("/");
            }}
          >
            ログイン画面に戻る
          </a>
        </Form>
        <Dialog open={isDialogOpen}>
          <DialogTitle>
            <p>アカウントが作成できました！</p>
          </DialogTitle>
          <DialogActions>
            <button
              onClick={() => {
                router.push("/home");
              }}
              className="text-3xl text-blue-500 w-20"
            >
              OK
            </button>
          </DialogActions>
        </Dialog>
      </BackgroundColor>
    </>
  );
}

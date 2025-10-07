"use client";
import Form from "@/app/components/Form";
import { BackgroundColor } from "@/app/components/BackgroundColor";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FormArray, Inquiry } from "@/app/types/types";

export default function InquiryEdit() {
  const router = useRouter();
  const [user_id, setUserId] = useState("");
  const [enteredInquiry, setEnteredInquiry] = useState<Inquiry>({
    name: "",
    email_address: "",
    content: "",
  });
  const [isInputScreen, setIsInputScreen] = useState(true);
  const [isInputCheckScreen, setIsInputCheckScreen] = useState(false);
  const [isSendCompleteScreen, setIsSendCompleteScreenScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formArray, setFormArray] = useState<FormArray[]>([
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
      label: "お問い合わせ内容",
      name: "content",
      value: "",
      validationRule: {
        required: "お問い合わせ内容は必須です",
        maxLength: {
          value: 255,
          message: "お問い合わせ内容は５００文字以内で入力して下さい",
        },
        pattern: {
          value: /^\S(.*\S)?$/,
          message: "先頭と末尾に空白文字を入れないください",
        },
      },
      type: "textarea",
    },
  ]);

  type JsonValue = {
    name: string;
    password: string;
    email_address: string;
    icon_id: number;
  };
  const setDefaultFormValues = useCallback(async () => {
    const res = await fetch(`/api/users?user_id=${user_id}`);
    const userData: JsonValue = await res.json();
    setFormArray((prev) => {
      return prev.map((prevObject) => {
        if (prevObject.name === "name") {
          return { ...prevObject, value: userData.name };
        } else if (prevObject.name === "email_address") {
          return { ...prevObject, value: userData.email_address };
        }
        return prevObject;
      });
    });
  }, [user_id]);

  useEffect(() => {
    setUserId(sessionStorage.getItem("user_id") as string);
    setDefaultFormValues();
  }, [setDefaultFormValues]);

  const onClickConfirmation = async (inquiry: Inquiry) => {
    setIsInputScreen(false);
    setIsInputCheckScreen(true);
    setEnteredInquiry(inquiry);
    setFormArray((prev) => {
      return prev.map((prevObject) => {
        if (prevObject.name === "name") {
          return { ...prevObject, value: inquiry.name };
        } else if (prevObject.name === "email_address") {
          return { ...prevObject, value: inquiry.email_address };
        } else if (prevObject.name === "content") {
          return { ...prevObject, value: inquiry.content };
        }
        return prevObject;
      });
    });
  };

  const onClickSubmit = async (inquiry: Inquiry) => {
    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inquiry),
    });
    const result = await response.json();
    if (result.succsess) {
      setIsInputCheckScreen(false);
      setIsSendCompleteScreenScreen(true);
    }
    setIsLoading(false);
  };

  return (
    <>
      <BackgroundColor isLoading={isLoading}>
        {isInputScreen && (
          <Form
            icon=""
            iconDescription=""
            title="お問い合わせ"
            description="お問い合わせいただきました件については、
後日お客様のメールアドレス宛にご返信いたします"
            formArray={formArray}
            onSubmit={(formValues) =>
              onClickConfirmation(
                formValues as {
                  name: string;
                  email_address: string;
                  content: string;
                }
              )
            }
            bottonName="確認"
          ></Form>
        )}
        {enteredInquiry.content !== "" && isInputCheckScreen && (
          <div className="justify-items-center">
            <main className="flex flex-col gap-[32px] row-start-2">
              <p className="mt-3 text-center text-3xl font-serif">
                以下の内容でよろしいですか？
              </p>
              <div className="gap-4 flex-col max-w-70">
                <div className="mb-8 flex flex-col">
                  <span className="max-w-[200px] whitespace-pre-line">
                    名前
                  </span>
                  <p className="w-[240px] text-[25px]">{enteredInquiry.name}</p>
                  <span className="mt-6 max-w-[200px] whitespace-pre-line">
                    メールアドレス
                  </span>
                  <p className="w-[240px] text-[25px]">
                    {enteredInquiry.email_address}
                  </p>
                  <span className="mt-6 max-w-[200px] whitespace-pre-line">
                    お問い合わせ内容
                  </span>
                  <p className="w-[200px] text-[25px]">
                    {enteredInquiry.content}
                  </p>
                </div>
              </div>
              <div className="flex flex-row">
                <button
                  onClick={() => {
                    setIsInputScreen(true);
                  }}
                  className="rounded-[10px] mx-auto border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center bg-[#808080] hover:bg-[#a9a9a9] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm text-amber-50 sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-[190px]"
                >
                  戻る
                </button>
                <button
                  onClick={() => {
                    onClickSubmit(enteredInquiry);
                  }}
                  className="rounded-[10px] mx-auto border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center bg-[#F85F6A] hover:bg-[#f3a4a9] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm text-amber-50 sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-[190px]"
                >
                  送信
                </button>
              </div>
            </main>
          </div>
        )}
        {isSendCompleteScreen && (
          <div className="flex justify-center items-center h-[100vh]">
            <main className="flex flex-col gap-[32px] row-start-2">
              <p className="mt-3 text-center text-3xl font-serif">
                送信が完了しました
              </p>
              <button
                onClick={() => {
                  sessionStorage.setItem("navigation", "home");
                  router.push("/home");
                }}
                className="underline decoration-1"
              >
                ホーム画面に戻る
              </button>
            </main>
          </div>
        )}
      </BackgroundColor>
    </>
  );
}

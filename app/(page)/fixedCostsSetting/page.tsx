"use client";
import { BackgroundColor } from "@/app/components/BackgroundColor";
import Form from "@/app/components/Form";
import { Category, FormArray } from "@/app/types/types";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";

export default function FixedCostsSetting() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formArray, setFormArray] = useState<FormArray[]>([]);
  const [dialogMessage, setDialogMessage] = useState<string | React.ReactNode>(
    ""
  );

  const fetchFixedExpenses = async () => {
    setIsLoading(true);
    const data = await fetch("/api/categories");
    const categriesJson: Category[] = await data.json();
    const fixedExpensesCategories = categriesJson.filter(
      (data) => data.category_name === "固定費"
    );
    const fixedExpensesFormArray = fixedExpensesCategories.flatMap((data) => [
      {
        label: data.name,
        name: data.id.toString(),
        value: "",
        validationRule: {
          required: data.name + "は必須です",
          maxLength: {
            value: 6,
            message: "入力できるのは６桁までです",
          },
        },
        type: "number",
      },
      {
        label: (
          <span>
            {data.name}を自動入力する日
            <br />
            （月末に設定する場合は、「月末」と入力してください）
          </span>
        ),
        name: `dateFor${data.id.toString()}`,
        value: "",
        validationRule: {
          required: "この項目は必須です",
          pattern: {
            value: /^((0[1-9]|[12][0-9]|30)日|月末)$/,
            message: "日付を正しく入力してください",
          },
        },
        placeholder: " 例：〇〇日(〇〇は半角)",
        type: "text",
      },
    ]);
    setFormArray(() => fixedExpensesFormArray);
    console.log(fixedExpensesFormArray);
    setIsLoading(false);
  };

  const onClick = async (fixedExpenses: Record<string, string | number>) => {
    setIsLoading(true);
    const sendedFixedExpensesList = [];
    const keyList = Object.keys(fixedExpenses);
    for (let i = 0; i < Object.keys(fixedExpenses).length / 2; i++) {
      const key1 = keyList[i];
      const key2Index = i + keyList.length / 2;
      const key2 = keyList[key2Index];
      sendedFixedExpensesList.push([
        { [key1]: fixedExpenses[key1] },
        {
          [key2]: fixedExpenses[key2],
        },
      ]);
    }
    console.log(sendedFixedExpensesList);
    const responseForDay = await fetch("/api/fixedExpenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: sessionStorage.getItem("user_id"),
        sendedFixedExpensesList,
      }),
    });
    const result = await responseForDay.json();
    setIsDialogOpen(true);
    if (result.succsess) {
      setDialogMessage("固定費が設定できました");
    } else {
      setDialogMessage(
        <span>
          エラーが発生しました
          <br />
          もう一度やり直してください
        </span>
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFixedExpenses();
  }, []);
  return (
    <BackgroundColor isLoading={isLoading}>
      <Form
        title="固定費の設定"
        formArray={formArray}
        onSubmit={(formValues) =>
          onClick(formValues as Record<string, string | number>)
        }
        bottonName="設定する"
      ></Form>
      <Dialog open={isDialogOpen}>
        <DialogTitle>
          <p>{dialogMessage}</p>
        </DialogTitle>
        <DialogActions>
          <button
            onClick={() => {
              setIsDialogOpen(false);
            }}
            className="text-3xl text-blue-500 w-20"
          >
            OK
          </button>
        </DialogActions>
      </Dialog>
    </BackgroundColor>
  );
}

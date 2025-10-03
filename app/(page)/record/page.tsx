"use client";
import { BackgroundColor } from "@/app/components/BackgroundColor";
import IconAndTitle from "@/app/components/IconAndTitle";
import { formatDate, formatDateToString } from "@/app/lib/utils";
import { RecordFromArray } from "@/app/types/types";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useCallback, useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useForm } from "react-hook-form";

// const formArray = [
//   {
//     label: "食費",
//     name: "1",
//     value: "",
//   },
//   {
//     label: "趣味",
//     name: "2",
//     value: "",
//   },
//   {
//     label: "交通費",
//     name: "3",
//     value: "",
//   },
//   {
//     label: "通信費",
//     name: "4",
//     value: "",
//   },
//   {
//     label: "光熱費",
//     name: "5",
//     value: "",
//   },
//   {
//     label: "住居費",
//     name: "6",
//     value: "",
//   },
//   {
//     label: "衣服",
//     name: "7",
//     value: "",
//   },
//   {
//     label: "医療費",
//     name: "8",
//     value: "",
//   },
//   {
//     label: "その他",
//     name: "9",
//     value: "",
//   },
// ];
// const defaultValues = formArray.reduce((acc, cur) => {
//   acc[cur.name] = Number(cur.value);
//   return acc;
// }, {} as Record<string, number>);
type DayCategoriesAmountData = {
  amount: number;
  category_id: number;
};
export default function Record() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formArray, setFormArray] = useState<RecordFromArray[]>([]); //id:number, name:string
  const [defaultValues, setDefaultValues] = useState<Record<string, number>>(
    {}
  );

  const createFromArrayDefaultValues = useCallback(async () => {
    const data = await fetch("/api/categories");
    const categories: RecordFromArray[] = await data.json();
    const others = categories.find(
      (category) => category.name === "その他"
    ) ?? { id: 9999, name: "その他" };
    const noOthersCategories = categories.filter(
      (category) => category.name !== "その他"
    );
    const newCategories = [...noOthersCategories, others];
    setFormArray(() => newCategories);
    for (const data of newCategories) {
      setDefaultValues((pre) => {
        return { ...pre, [data.id]: "" };
      });
    }
  }, []);

  const setNewDefaultValues = async (date: string) => {
    reset();
    const amountData = await fetch(
      `/api/records?user_id=${sessionStorage.getItem(
        "user_id"
      )}&target=dayCategoriesRecord&date=${date}'`
    );
    const amountDataJson: DayCategoriesAmountData[] = await amountData.json();
    for (const data of amountDataJson) {
      setValue(String(data.category_id), data.amount);
    }
  };

  useEffect(() => {
    createFromArrayDefaultValues();
  }, [createFromArrayDefaultValues]);

  const {
    register,
    getValues,
    setValue,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setNewDefaultValues(formatDate(date));
    setIsDialogOpen(true);
  };

  const onClick = async (formValues: Record<string, number>) => {
    setIsLoading(true);
    console.log(formValues);
    const data = await fetch("/api/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: sessionStorage.getItem("user_id"),
        date: formatDate(selectedDate),
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
      <div className="justify-items-center">
        <main className="flex flex-col gap-[32px] row-start-2">
          <IconAndTitle
            icon="/monyFlyYen.png"
            iconDescription="羽が生えて飛んでいくお金のイラスト"
            title="支出を記録する"
            description="記録したい日付をタップしてください"
          />
          <div>
            <Calendar onClickDay={handleDateClick} locale="ja-JP" />

            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
              <DialogTitle>
                {formatDateToString(new Date(selectedDate))}の支出入力
              </DialogTitle>
              <DialogContent>
                <form
                  className="gap-4 flex-col max-w-70"
                  onSubmit={handleSubmit(() => {
                    onClick(getValues());
                  })}
                >
                  {formArray.map((field, index) => (
                    <div key={index} className="mb-8 flex flex-col">
                      <span className="max-w-[200px] whitespace-pre-line">
                        {field.name}
                      </span>
                      <label>
                        <span className="text-2xl">￥</span>
                        <input
                          {...register(String(field.id), {
                            maxLength: {
                              value: 6,
                              message: "入力できるのは６桁までです",
                            },
                          })}
                          type="number"
                          className="border-2 border-gray-500 bg-[#FAFAFA]"
                        />
                      </label>
                      <div className="text-red-500 text-[14px] max-w-[280px]">
                        {errors[field.id]?.message}
                      </div>
                    </div>
                  ))}
                  <button
                    type="submit"
                    className="rounded-[10px] border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center bg-[#F85F6A] hover:bg-[#f3a4a9] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm text-amber-50 sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full"
                  >
                    記録する
                  </button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </BackgroundColor>
  );
}

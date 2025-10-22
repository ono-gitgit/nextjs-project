"use client";
import { BackgroundColor } from "@/app/components/BackgroundColor";
import IconAndTitle from "@/app/components/IconAndTitle";
import InputCompleteDialog from "@/app/components/InputCompleteDialog";
import { formatDate, formatDateToString, formatNumber } from "@/app/lib/utils";
import { RecordFromArray } from "@/app/types/types";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useForm } from "react-hook-form";

type DayCategoriesAmountData = {
  amount: number;
  category_id: number;
};
type FixedExpensesJson = {
  category_id: number;
  amount: number;
  fixed_expenses_day: number;
};
type Expense = {
  date: string;
  amount: number;
};
export default function Record() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInputCompleteDialogOpen, setIsInputCompleteDialogOpen] =
    useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [formArray, setFormArray] = useState<RecordFromArray[]>([]);
  const [defaultValues, setDefaultValues] = useState<Record<string, number>>(
    {}
  );

  // ある日の支出合計（カテゴリ別）を取得
  const getDailyTotal = async (user_id: number) => {
    const res = await fetch(`/api/records?user_id=${user_id}&target=days`);
    const records: Expense[] = await res.json();
    const newExpenses = records.map((record) => {
      return { date: record.date.split("T")[0], amount: record.amount };
    });
    setExpenses(() => newExpenses);
  };

  //ある月のある日の支出合計を表示
  const showDailyTotal = (day: Date) => {
    const dayStr = day.toISOString().split("T")[0];
    const total = expenses
      .filter((e) => e.date === dayStr)
      .reduce((sum, e) => sum + e.amount, 0);
    return total > 0 ? `¥${formatNumber(total)}` : null;
  };

  const createFromArrayDefaultValues = useCallback(async () => {
    const data = await fetch("/api/categories");
    const categories: RecordFromArray[] = await data.json();
    const others = categories.find(
      (category) => category.name === "その他"
    ) ?? { id: 9999, name: "その他", expense_category_id: 1 };
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
    const fixedExpenses = await fetch(
      `/api/fixedExpenses?user_id=${sessionStorage.getItem("user_id")}`
    );
    const amountDataJson: DayCategoriesAmountData[] = await amountData.json();
    const fixedExpensesJson: FixedExpensesJson[] = await fixedExpenses.json();
    console.log(fixedExpensesJson);
    for (const data of amountDataJson) {
      setValue(String(data.category_id), data.amount);
    }
    const clickedDate = new Date(date);
    const clickedYear = clickedDate.getFullYear();
    const clickedMonth = clickedDate.getMonth() + 1;
    const clickedDay = clickedDate.getDate();
    const clickedMaxDay = new Date(clickedYear, +clickedMonth, 0).getDate();
    console.log(clickedMaxDay);
    for (const data of fixedExpensesJson) {
      if (
        data.fixed_expenses_day == clickedDay ||
        (clickedDay === clickedMaxDay &&
          data.fixed_expenses_day >= clickedMaxDay)
      ) {
        setValue(String(data.category_id), data.amount);
      }
    }
  };

  useEffect(() => {
    createFromArrayDefaultValues();
    getDailyTotal(Number(sessionStorage.getItem("user_id")) as number);
  }, [createFromArrayDefaultValues]);

  const {
    register,
    getValues,
    setValue,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });

  const handleDateClick = async (date: Date) => {
    setIsLoading(true);
    setSelectedDate(date);
    await setNewDefaultValues(formatDate(date));
    setIsDialogOpen(true);
    setIsLoading(false);
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
      setIsDialogOpen(false);
      setIsInputCompleteDialogOpen(true);
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
          <div className="ml-1 mx-auto w-[350px]">
            <Calendar
              // prevLabel={null}
              // nextLabel={null}
              prev2Label={null}
              next2Label={null}
              // showNeighboringMonth={false}
              onClickDay={handleDateClick}
              locale="ja-JP"
              tileContent={({ date }) => (
                <p
                  style={{
                    position: "absolute",
                    marginLeft: "5px",
                    marginTop: date.getDate() % 2 == 0 ? "5px" : "",
                    fontSize: "12px",
                    zIndex: "10px",
                    color: "green",
                  }}
                >
                  {showDailyTotal(date)}
                </p>
              )}
              className="w-full"
            />
          </div>
          <button
            className="text-blue-600 underline text-[15px] text-left"
            onClick={() => {
              setIsLoading(true);
              router.push("/fixedCostsSetting");
            }}
          >
            こちらのリンクをクリックすると、
            <br />
            指定した日付に固定費を自動入力する設定ができます
          </button>

          <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
            <h1 className="text-[20px] p-3 mb-[-10px] text-center font-bold">
              {formatDateToString(new Date(selectedDate))}の支出入力
            </h1>
            <DialogContent>
              <form
                className="flex-col max-w-80"
                onSubmit={handleSubmit(() => {
                  onClick(getValues());
                })}
              >
                {formArray.map((field, index) => (
                  <div key={index} className="mb-2 flex flex-col">
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
                        min={0}
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
        </main>
        <InputCompleteDialog
          isDialogOpen={isInputCompleteDialogOpen}
          dialogMessage={"記録しました"}
          onClick={() => {
            setIsInputCompleteDialogOpen(false);
          }}
        />
      </div>
    </BackgroundColor>
  );
}

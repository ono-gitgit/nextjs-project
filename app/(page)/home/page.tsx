"use client";
import { BackgroundColor } from "@/app/components/BackgroundColor";
import Image from "next/image";
import React from "react";
import { useCallback, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { UserIcon, Rank } from "@/app/types/types";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import HotelClassIcon from "@mui/icons-material/HotelClass";
import CommuteIcon from "@mui/icons-material/Commute";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import GasMeterIcon from "@mui/icons-material/GasMeter";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import WalletIcon from "@mui/icons-material/Wallet";
import { formatDate, formatDateToString, formatNumber } from "@/app/lib/utils";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ExplainDialog from "@/app/components/ExplainDialog";
import BudgetBar from "@/app/components/BudgetBar";
import { ExpensesChart } from "@/app/components/ExpensesChart";
import Tab from "@/app/components/Tab";

type CharData = {
  month: string;
  amount_sum: number;
};
type AYearExpensesJson = {
  year: string;
  month: string;
  amount_sum: number;
};
// type DayCategoriesAmountData = {
//   amount: number;
//   category_id: number;
// };
type CategoryExpenses = {
  amount: string;
  name: string;
};
type RecordAvg = {
  category_id: number;
  category_name: string;
  avg: string;
};
type Expense = {
  date: string;
  amount: number;
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExplainDialogOpen, setIsExplainDialogOpen] = useState(false);
  const [userId, setUserId] = useState<number>(0);
  const [userName, setUserName] = useState<string | null>(null);
  const [iconId, setIconId] = useState<number | null>(null);
  const [goal, setGoal] = useState<string | null>(null);
  const [thisMonthRecordSum, setthisMonthRecordSum] = useState<number | null>(
    null
  );
  const [budgetDeviation, setBudgetDeviation] = useState<number>(0);
  const [rankId, setRankId] = useState<number | null>(null);
  const [userIcon, setUserIcon] = useState<UserIcon>({ path: "" });
  const [rank, setRank] = useState<Rank>({
    name: "",
    icon: "",
  });
  const [chartData, setChartData] = useState<CharData[]>([
    { month: "1月", amount_sum: 0 },
    { month: "2月", amount_sum: 0 },
    { month: "3月", amount_sum: 0 },
    { month: "4月", amount_sum: 0 },
    { month: "5月", amount_sum: 0 },
    { month: "6月", amount_sum: 0 },
    { month: "7月", amount_sum: 0 },
    { month: "8月", amount_sum: 0 },
    { month: "9月", amount_sum: 0 },
    { month: "10月", amount_sum: 0 },
    { month: "11月", amount_sum: 0 },
    { month: "12月", amount_sum: 0 },
  ]);
  const [recordsAvgList, setRecordAvgList] = useState<RecordAvg[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [categoryExpenses, setCategoryExpenses] = useState<CategoryExpenses[]>(
    []
  );
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  //ユーザーアイコンの取得
  const fetchUserIcon = useCallback(async (icon_id: number) => {
    const data = await fetch("/api/userIcon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ icon_id }),
    });
    const user_icon = await data.json();
    console.log(user_icon);
    setUserIcon(() => user_icon);
  }, []);

  //今月の支出合計の取得
  const fetchthisMonthRecordSum = useCallback(async (user_id: number) => {
    const res = await fetch(`/api/records?user_id=${user_id}&target=thisMonth`);
    const thisMonthRecordSum = await res.json();
    setthisMonthRecordSum(() => thisMonthRecordSum);
  }, []);

  //ランクアイコンの検索
  const fetchRank = useCallback(async (rank_id: number) => {
    const data = await fetch("/api/rank", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rank_id }),
    });
    const rank = await data.json();
    setRank(() => rank);
  }, []);

  //目標と支出との乖離率を取得
  const calculateBudgetDeviation = useCallback(async () => {
    if (goal !== "null" && thisMonthRecordSum !== 0 && thisMonthRecordSum) {
      const tentativeBudgetDeviation = Number(goal) - thisMonthRecordSum;
      setBudgetDeviation(() => Math.floor(tentativeBudgetDeviation));
    }
  }, [goal, thisMonthRecordSum]);

  //今年の出費（グラフのデータ）を取得
  const fetchThisYearExpenses = async (user_id: number) => {
    setChartData([
      { month: "1月", amount_sum: 0 },
      { month: "2月", amount_sum: 0 },
      { month: "3月", amount_sum: 0 },
      { month: "4月", amount_sum: 0 },
      { month: "5月", amount_sum: 0 },
      { month: "6月", amount_sum: 0 },
      { month: "7月", amount_sum: 0 },
      { month: "8月", amount_sum: 0 },
      { month: "9月", amount_sum: 0 },
      { month: "10月", amount_sum: 0 },
      { month: "11月", amount_sum: 0 },
      { month: "12月", amount_sum: 0 },
    ]);
    const res = await fetch(`/api/records?user_id=${user_id}&target=thisYear`);
    const json: AYearExpensesJson[] = await res.json();
    console.log("今年の出費");
    console.log(json);
    if (json.length <= 0) return;
    setChartData((prev) => {
      return prev.map((data) => {
        const newJson = json.find(
          (gottenData) => gottenData.month === data.month
        );
        return newJson ? { ...data, amount_sum: newJson.amount_sum } : data;
      });
    });
  };

  //今年の出費（グラフのデータ）を取得
  const fetchLastYearExpenses = async (user_id: number) => {
    setChartData([
      { month: "1月", amount_sum: 0 },
      { month: "2月", amount_sum: 0 },
      { month: "3月", amount_sum: 0 },
      { month: "4月", amount_sum: 0 },
      { month: "5月", amount_sum: 0 },
      { month: "6月", amount_sum: 0 },
      { month: "7月", amount_sum: 0 },
      { month: "8月", amount_sum: 0 },
      { month: "9月", amount_sum: 0 },
      { month: "10月", amount_sum: 0 },
      { month: "11月", amount_sum: 0 },
      { month: "12月", amount_sum: 0 },
    ]);
    const res = await fetch(`/api/records?user_id=${user_id}&target=lastYear`);
    const json: AYearExpensesJson[] = await res.json();
    console.log("去年の出費");
    console.log(json);
    if (json.length <= 0) return;
    setChartData((prev) => {
      return prev.map((data) => {
        const newJson = json.find(
          (gottenData) => gottenData.month === data.month
        );
        return newJson ? { ...data, amount_sum: newJson.amount_sum } : data;
      });
    });
  };

  const fetchCategoryExpenses = async (date: string) => {
    setIsLoading(true);
    const amountData = await fetch(
      `/api/records?user_id=${sessionStorage.getItem(
        "user_id"
      )}&target=dayCategoriesRecordForTop&date=${date}'`
    );
    const amountDataJson: CategoryExpenses[] = await amountData.json();
    const others = amountDataJson.find((data) => data.name === "その他");
    const otherThanOthers = amountDataJson.filter(
      (data) => data.name !== "その他"
    );
    const newamountData: CategoryExpenses[] = others
      ? [...otherThanOthers, others]
      : otherThanOthers;
    console.log(newamountData);
    setCategoryExpenses(newamountData);
    setIsLoading(false);
  };

  const handleDateClick = async (date: Date) => {
    setSelectedDate(date);
    await fetchCategoryExpenses(formatDate(date));
    setIsCategoryDialogOpen(true);
  };

  //これまでの支出の平均（カテゴリ別）を取得
  const fetchRecordAverage = async (user_id: number) => {
    const res = await fetch(`/api/records?user_id=${user_id}&target=average`);
    const json = await res.json();
    console.log("カテゴリ別の平均値");
    console.log(json);
    setRecordAvgList(() => json);
  };

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

  //トップ画面に表示させるを取得する処理
  const fetchTopPageData = useCallback(async () => {
    setIsLoading(true);
    if (iconId !== null && rankId !== null && userId !== null) {
      await fetchUserIcon(iconId);
      await fetchthisMonthRecordSum(userId);
      await fetchRank(rankId);
      await calculateBudgetDeviation();
    }
    setIsLoading(false);
  }, [
    calculateBudgetDeviation,
    fetchRank,
    fetchthisMonthRecordSum,
    fetchUserIcon,
    iconId,
    rankId,
    userId,
  ]);

  //セッションスコープの情報を取得する処理
  useEffect(() => {
    if (sessionStorage.length > 0) {
      const user_id = sessionStorage.getItem("user_id");
      const user_name = sessionStorage.getItem("user_name");
      const icon_id = sessionStorage.getItem("icon_id");
      const goal = sessionStorage.getItem("goal");
      const rankId = sessionStorage.getItem("rank_id");
      setUserId(Number(user_id));
      setUserName(user_name);
      setIconId(Number(icon_id));
      setGoal(goal);
      setRankId(Number(rankId));
      console.log(sessionStorage);
    }
  }, []);

  //トップ画面の出力に必要な情報を検索する処理
  useEffect(() => {
    fetchTopPageData();
    fetchThisYearExpenses(userId);
    fetchRecordAverage(userId);
    getDailyTotal(userId);
  }, [fetchTopPageData, userId]);

  return (
    <>
      {userId !== 0 ? (
        <div>
          <BackgroundColor isLoading={isLoading}>
            <div className="flex justify-between">
              <div className="mt-3 ml-10">
                {userIcon.path !== "" && (
                  <Image
                    className="rounded-full mx-auto"
                    src={userIcon.path}
                    alt="userIcon"
                    height={50}
                    width={50}
                  />
                )}
                <div className="mt-2 max-w-40 font-bold">{userName}</div>
              </div>
              <button
                className="mr-10 max-w-20 font-bold hover:shadow-2xl rounded-2xl"
                onClick={() => {
                  setIsDialogOpen(true);
                }}
              >
                {rank.icon !== "" && (
                  <Image
                    src={rank.icon}
                    alt={rank.name}
                    height={50}
                    width={50}
                    className="mx-auto"
                  />
                )}
                <div
                  className={`mt-[-10px] px-1 max-w-20 font-bold ${
                    rank.name == "Bronze" && "text-[15px] text-[#9A6229]"
                  } ${rank.name == "Silver" && "text-[15px] text-[#C0C0C0]"} ${
                    rank.name == "Gold" && "text-[17px] text-[#D3AF37]"
                  } ${
                    rank.name == "Platinum" &&
                    "text-[12px] font-extrabold bg-gradient-to-r from-gray-600 via-gray-400 to-gray-700 bg-clip-text text-transparent"
                  } ${
                    rank.name == "Master" &&
                    "pt-3 text-[15px] font-extrabold bg-gradient-to-r from-blue-400 via-blue-300 to-blue-600 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(200,230,255,0.9)]"
                  }`}
                >
                  {rank.name}
                </div>
              </button>
            </div>

            <dl
              className={`relative p-3 mt-8 mx-auto border-1 border-black rounded-[5px] w-[80vw] ${
                budgetDeviation > 0 ? "bg-[#FFD783]" : "bg-[#aecefd]"
              }`}
            >
              <dt className="text-[14px]">今月の予算</dt>
              {goal !== "null" && goal ? (
                <dd className="text-[20px] break-all font-bold">
                  ￥{formatNumber(Number(goal))}
                </dd>
              ) : (
                <dd className="mb-2 text-[20px] break-all">
                  予算が設定されていません
                </dd>
              )}
              {goal !== "null" && goal && (
                <BudgetBar
                  budget={Number(goal)}
                  expenditure={Number(thisMonthRecordSum)}
                />
              )}
              <dt className="text-[14px] mt-3">今月の支出</dt>
              <dd className="flex flex-row">
                {formatNumber(Number(thisMonthRecordSum)) !== "0" ? (
                  <div>
                    <div className="text-[20px] break-all font-bold">
                      ￥{formatNumber(Number(thisMonthRecordSum))}
                    </div>
                    {budgetDeviation > 0 ? (
                      <div className="absolute bottom-1 right-3">
                        残り予算{formatNumber(budgetDeviation)}円！
                      </div>
                    ) : (
                      <div className="absolute bottom-1 right-3">
                        {formatNumber(Math.abs(budgetDeviation))}円の浪費...
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-[20px] break-all">記録がありません</div>
                )}
              </dd>
            </dl>

            {/* グラフ（ここから） */}
            <Tab
              heading="月ごとの支出合計"
              firstTabsValues={"thisYearExpenses"}
              firstTabsTitle={"今年"}
              firstTabsOnClick={() => {
                fetchThisYearExpenses(userId);
              }}
              firstTabsContent={<ExpensesChart chartData={chartData} />}
              seconsdTabsValues={"lastYearExpenses"}
              secondTabsOnClick={() => {
                fetchLastYearExpenses(userId);
              }}
              seconsdTabsTitle={"去年"}
              seconsdTabsContent={<ExpensesChart chartData={chartData} />}
            />
            {/* グラフ（ここまで） */}

            {/*支出レポート（ここから）*/}
            <Tab
              heading="支出レポート"
              firstTabsValues={"thisMonthExpend"}
              firstTabsTitle={"日ごとの支出"}
              firstTabsContent={
                <>
                  <Calendar
                    onChange={(date) => {
                      handleDateClick(new Date(String(date)));
                    }}
                    value={new Date()}
                    minDetail="month"
                    // prevLabel={null}
                    // nextLabel={null}
                    // prev2Label={null}
                    // next2Label={null}
                    // showNeighboringMonth={false}
                    tileContent={({ date }) => (
                      <p
                        style={{
                          position: "absolute",
                          marginTop: date.getDate() % 2 == 0 ? "7px" : "",
                          fontSize: "12px",
                          zIndex: "10px",
                          color:
                            formatDate(date) === formatDate(new Date())
                              ? "lightgreen"
                              : "green",
                        }}
                      >
                        {showDailyTotal(date)}
                      </p>
                    )}
                    tileClassName={({ date, view }) => {
                      if (view === "month") {
                        if (date.getDay() === 6 && date === new Date())
                          return "saturday";
                      }
                      return null;
                    }}
                  />
                  <p className="text-left">
                    今日の日付: {formatDateToString(new Date())}
                  </p>
                  <Dialog
                    open={isCategoryDialogOpen}
                    onClose={() => setIsCategoryDialogOpen(false)}
                  >
                    <h1 className="p-5 pb-0 text-[20px] text-center font-bold">
                      {formatDateToString(new Date(selectedDate))}の支出入力
                    </h1>
                    <DialogContent className="relative">
                      {categoryExpenses.length !== 0 ? (
                        categoryExpenses.map((field, index) => (
                          <div key={index} className="mb-5 flex flex-col">
                            <h2 className="max-w-[200px] whitespace-pre-line font-bold text-[18px]">
                              {field.name}
                            </h2>
                            <p>{formatNumber(Number(field.amount))}円</p>
                          </div>
                        ))
                      ) : (
                        <p className="pb-12 text-2xl">記録がありません</p>
                      )}
                      <button
                        type="submit"
                        className="absolute bottom-2 right-3 bg-gray-200 shadow-xl/20 text-3xl rounded-2xl text-blue-500 w-20"
                        onClick={() => {
                          setIsCategoryDialogOpen(false);
                        }}
                      >
                        閉じる
                      </button>
                    </DialogContent>
                  </Dialog>
                </>
              }
              seconsdTabsValues={"expendAverage"}
              seconsdTabsTitle={"記録開始以降の支出の平均"}
              seconsdTabsContent={
                <Table className="bg-gray-200">
                  <TableBody>
                    {recordsAvgList.length > 0 ? (
                      recordsAvgList.map((recordsAvg, index) => (
                        <TableRow
                          key={index}
                          onClick={() => {
                            setIsExplainDialogOpen(true);
                          }}
                        >
                          <TableCell className="font-medium flex items-center">
                            {recordsAvg.category_name === "食費" && (
                              <RestaurantOutlinedIcon className="text-[#FF6624]" />
                            )}
                            {recordsAvg.category_name === "趣味" && (
                              <HotelClassIcon className="text-[#C3BB38]" />
                            )}
                            {recordsAvg.category_name === "交通費" && (
                              <CommuteIcon className="text-[#4C7A34]" />
                            )}
                            {recordsAvg.category_name === "通信費" && (
                              <RssFeedIcon className="text-gray-600" />
                            )}
                            {recordsAvg.category_name === "光熱費" && (
                              <GasMeterIcon className="text-[#1464F6]" />
                            )}
                            {recordsAvg.category_name === "住居費" && (
                              <MapsHomeWorkIcon className="text-[#FFA834]" />
                            )}
                            {recordsAvg.category_name === "医療費" && (
                              <MedicalServicesIcon className="text-[#FF3823]" />
                            )}
                            {recordsAvg.category_name === "書籍" && (
                              <MedicalServicesIcon className="text-[#1B7837]" />
                            )}
                            {recordsAvg.category_name === "その他" && (
                              <WalletIcon />
                            )}
                            {recordsAvg.category_name}
                          </TableCell>
                          <TableCell className="text-left">
                            ￥
                            {formatNumber(Number(recordsAvg.avg.split(".")[0]))}
                            /日
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell className="text-center">
                          <Image
                            className="mt-[10px] mb-[0px] mx-auto w-auto"
                            src="/rabbitAndFrog.png"
                            alt="ウサギとカエルのイラスト"
                            width={100}
                            height={30}
                            priority
                          />
                          記録がありません
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              }
            />
            {/*支出レポート（ここまで）*/}
          </BackgroundColor>
          <AboutRank isOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
          <ExplainDialog
            isDialogOpen={isExplainDialogOpen}
            title={""}
            explain={"支出の記録をつけた日が計算対象となっています"}
            onClick={() => {
              setIsExplainDialogOpen(false);
            }}
          />
        </div>
      ) : (
        <BackgroundColor isLoading={false}>
          <div>ログインしてください</div>
        </BackgroundColor>
      )}
    </>
  );
}

type Prop = {
  isOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
};
const AboutRank: React.FC<Prop> = ({ isOpen, setIsDialogOpen }) => {
  return (
    <Dialog open={isOpen} className="z-10">
      <DialogTitle>ランクとは？</DialogTitle>
      <DialogContent>
        <p className="mb-5">
          先月の予算に対する節約率（（「先月の予算」 - 「先月の出費」） ÷
          「先月の予算」 × 100）によってランクが変動します
        </p>
        <ul>
          <li className="flex flex-row mb-3">
            <div>Bronze&nbsp;&nbsp;&nbsp;&nbsp;：</div>
            <div>
              節約率5%未満
              <br />
              （または記録なし）
            </div>
          </li>
          <li className="flex flex-row mb-3">
            <div>Silver&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;：</div>
            <div>節約率5%以上10%未満</div>
          </li>
          <li className="flex flex-row mb-3">
            <div>Gold&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;：</div>
            <div>節約率10%以上20%未満</div>
          </li>
          <li className="flex flex-row mb-3">
            <div>Platinum：</div>
            <div className="text-[15px]">節約率20%以上30%未満</div>
          </li>
          <li className="flex flex-row">
            <div>Master&nbsp;&nbsp;&nbsp;：</div>
            <div>節約率30%以上</div>
          </li>
        </ul>
      </DialogContent>
      <DialogActions>
        <button
          onClick={() => {
            setIsDialogOpen(false);
          }}
          className="bg-gray-200 shadow-xl/20 text-3xl rounded-2xl text-blue-500 w-20"
        >
          OK
        </button>
      </DialogActions>
    </Dialog>
  );
};

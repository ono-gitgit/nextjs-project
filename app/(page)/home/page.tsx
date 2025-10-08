"use client";
import { BackgroundColor } from "@/app/components/BackgroundColor";
import Image from "next/image";
import React from "react";
import { useCallback, useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  //TableCaption,
  TableCell,
  // TableHead,
  // TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

type CharData = {
  month: string;
  amount_sum: number;
};
type ThisYearExpensesJson = {
  year: string;
  month: string;
  amount_sum: number;
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
      const tentativeBudgetDeviation =
        ((Number(goal) - thisMonthRecordSum) / Number(goal)) * 100;
      setBudgetDeviation(() => Math.floor(tentativeBudgetDeviation));
    }
  }, [goal, thisMonthRecordSum]);

  //今年の出費（グラフのデータ）を取得
  const fetchThisYearExpenses = async (user_id: number) => {
    const res = await fetch(`/api/records?user_id=${user_id}&target=thisYear`);
    const json: ThisYearExpensesJson[] = await res.json();
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
    return total > 0 ? `¥${total}` : null;
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

  const chartConfig = {
    amount_sum: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

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
                    className="rounded-full"
                    src={userIcon.path}
                    alt="userIcon"
                    height={60}
                    width={60}
                  />
                )}
                <div className="max-w-30 text-center font-bold">{userName}</div>
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
                    height={100}
                    width={100}
                  />
                )}
                <div
                  className={`mt-[-10px] max-w-20 text-2xl font-bold ${
                    rank.name == "Bronze" && "text-[#9A6229]"
                  } ${rank.name == "Silver" && "text-[#C0C0C0]"} ${
                    rank.name == "Gold" && "text-[#D3AF37]"
                  } ${
                    rank.name == "Platinum" &&
                    "text-[17px] font-extrabold bg-gradient-to-r from-gray-600 via-gray-400 to-gray-700 bg-clip-text text-transparent"
                  } ${
                    rank.name == "Master" &&
                    "pt-3 text-[20px] font-extrabold bg-gradient-to-r from-blue-400 via-blue-300 to-blue-600 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(200,230,255,0.9)]"
                  }`}
                >
                  {rank.name}
                </div>
              </button>
            </div>

            <dl
              className={`mt-8 mx-auto border-1 border-black rounded-[5px] w-[80vw] ${
                budgetDeviation > 0 ? "bg-[#FFD783]" : "bg-[#75A9F9]"
              }`}
            >
              <dt className="text-[14px]">１か月の上限</dt>
              {goal !== "null" && goal ? (
                <dd className="text-[26px] break-all">
                  ￥{formatNumber(Number(goal))}
                </dd>
              ) : (
                <dd className="mb-2 text-[20px] break-all">
                  目標が設定されていません
                </dd>
              )}
              <dt className="text-[14px]">今月の支出</dt>
              <dd className="flex flex-row">
                {formatNumber(Number(thisMonthRecordSum)) !== "0" ? (
                  <div>
                    <div className="text-[26px] break-all">
                      ￥{formatNumber(Number(thisMonthRecordSum))}
                    </div>
                    {budgetDeviation > 0 ? (
                      <div className="flex items-end ml-15">
                        {budgetDeviation}％節約中！
                      </div>
                    ) : (
                      <div className="flex items-end ml-15">
                        {Math.abs(budgetDeviation)}％の浪費...
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-[20px] break-all">記録がありません</div>
                )}
              </dd>
            </dl>

            {/* グラフ（ここから） */}
            <div className="mt-8 justify-items-center">
              <div>
                <h1 className="font-serif w-[80vw]">
                  今年の出費
                  <hr className="border-black border-2 rounded-[5px] w-full" />
                </h1>
              </div>
              {chartData.length > 0 ? (
                <CardContent className="mt-3">
                  <ChartContainer
                    config={chartConfig}
                    className="h-[200px] w-[80vw] mr-3"
                  >
                    <LineChart
                      accessibilityLayer
                      data={chartData}
                      margin={{
                        top: 10,
                        right: 12,
                      }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={true}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={true}
                        domain={[
                          0,
                          Number(
                            chartData.reduce((acc, pre) => {
                              if (Number(pre.amount_sum) >= Number(acc)) {
                                return pre.amount_sum;
                              }
                              return acc;
                            }, 0)
                          ) + 10,
                        ]}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Line
                        dataKey="amount_sum"
                        type="linear"
                        stroke="#00441b"
                        strokeWidth={2}
                        dot={{
                          fill: "color(--chart-1)",
                        }}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              ) : (
                <p>
                  <Image
                    className="mt-[10px] mb-[0px] mx-auto w-auto"
                    src="/rabbitAndFrog.png"
                    alt="ウサギとカエルのイラスト"
                    width={100}
                    height={30}
                    priority
                  />
                  記録がありません
                </p>
              )}
            </div>
            {/* グラフ（ここまで） */}

            <div className="mt-8 justify-items-center">
              <div>
                <h1 className="font-serif w-[80vw]">
                  支出レポート
                  <hr className="border-black border-2 rounded-[5px]" />
                </h1>
              </div>
              <Tabs defaultValue="thisMonthExpend" className="mt-3">
                <TabsList className="w-[80vw] mx-auto">
                  <TabsTrigger value="thisMonthExpend">
                    日ごとの支出
                  </TabsTrigger>
                  <TabsTrigger value="expendAverage">
                    これまでの支出の平均
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="thisMonthExpend" className="max-w-[95vw]">
                  <Calendar
                    onChange={() => {}}
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
                          fontSize: "12px",
                          color:
                            formatDate(date) === formatDate(new Date())
                              ? "lightgreen"
                              : "green",
                        }}
                      >
                        {showDailyTotal(date)}
                      </p>
                    )}
                  />
                  <p>今日の日付: {formatDateToString(new Date())}</p>
                </TabsContent>
                <TabsContent value="expendAverage">
                  <Table className="bg-gray-200">
                    <TableBody>
                      {recordsAvgList.map((recordsAvg, index) => (
                        <TableRow key={index}>
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
                            ￥{recordsAvg.avg.split(".")[0]}/日
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </div>
          </BackgroundColor>
          <AboutRank isOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
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
          先月の節約率（ （「1か月の上限」 ー 「今月の支出」）÷
          「1か月の上限」）に応じてランクが 変動します
        </p>
        <ul>
          <li className="flex flex-row mb-3">
            <div>Bronze：</div>
            <div>節約率0%以下（もしくは記録なし）</div>
          </li>
          <li className="flex flex-row mb-3">
            <div>Silver：</div>
            <div>節約率1～5%</div>
          </li>
          <li className="flex flex-row mb-3">
            <div>Gold：</div>
            <div>節約率5～10%</div>
          </li>
          <li className="flex flex-row mb-3">
            <div>Platinum：</div>
            <div>節約率10～20%</div>
          </li>
          <li className="flex flex-row">
            <div>Master：</div>
            <div>節約率20%以上</div>
          </li>
        </ul>
      </DialogContent>
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
  );
};

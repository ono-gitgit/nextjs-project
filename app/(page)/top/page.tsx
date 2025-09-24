"use client";
import { BackgroundColor } from "@/app/components/BackgroundColor";
import Image from "next/image";
import React from "react";
import { useCallback, useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Top() {
  type UserIcon = {
    path: string;
  };
  type Rank = {
    name: string;
    icon: string;
  };

  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [iconId, setIconId] = useState<number | null>(null);
  const [goal, setGoal] = useState<string | null>(null);
  const [rankId, setRankId] = useState<number | null>(null);
  const [userIcon, setUserIcon] = useState<UserIcon>({ path: "" });
  const [rank, setRank] = useState<Rank>({
    name: "",
    icon: "",
  });

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

  //ランクアイコンの検索
  const fetchRank = useCallback(async (rank_id: number) => {
    setIsLoading(true);
    const data = await fetch("/api/rank", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rank_id }),
    });
    const rank = await data.json();
    setRank(() => rank);
    setIsLoading(false);
  }, []);

  //トップ画面の出力に必要な情報を検索する処理
  const fetchTopPageData = useCallback(async () => {
    setIsLoading(true);
    if (iconId !== null && rankId !== null) {
      await fetchUserIcon(iconId);
      await fetchRank(rankId);
    }
    setIsLoading(false);
  }, [fetchRank, fetchUserIcon, iconId, rankId]);

  const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ];
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  //セッションスコープの情報を取得する処理
  useEffect(() => {
    const user_name = sessionStorage.getItem("user_name");
    const icon_id = sessionStorage.getItem("icon_id");
    const goal = sessionStorage.getItem("goal");
    const rankId = sessionStorage.getItem("rank_id");
    setUserName(user_name);
    setIconId(Number(icon_id));
    setGoal(goal);
    setRankId(Number(rankId));
    console.log(sessionStorage);
  }, []);

  //トップ画面の出力に必要な情報を検索する処理
  useEffect(() => {
    fetchTopPageData();
  }, [fetchTopPageData]);

  return (
    <div className="relative">
      <BackgroundColor isLoading={isLoading}>
        {userIcon.path !== "" && (
          <Image
            className="absolute top-8 left-8 rounded-[100px]"
            src={userIcon.path}
            alt="userIcon"
            height={60}
            width={60}
          />
        )}
        <div className="absolute top-15 left-25 max-w-20 font-bold">
          {userName}
        </div>
        <div className="flex flex-col absolute top-3 right-7 max-w-20 font-bold">
          {rank.icon !== "" && (
            <Image src={rank.icon} alt={rank.name} height={100} width={100} />
          )}
          <div
            className={`mt-[-10px] max-w-20 text-2xl font-bold ${
              rank.name == "Bronze" && "text-[#9A6229]"
            }`}
          >
            {rank.name}
          </div>
        </div>

        <dl
          className={`absolute top-40 border-1 border-black rounded-[5px] w-[80vw] bg-[#FFD783]`}
        >
          <dt className="text-[14px]">１か月の上限</dt>
          <dd className="text-[26px] max-w-[40vw] break-all">￥100,000</dd>
          <dt className="text-[14px]">今月の支出</dt>
          <dd className="flex flex-row">
            <div className="text-[26px] max-w-[40vw] break-all">￥75,00</div>
            <div className="flex items-end ml-15">〇〇％節約中！</div>
          </dd>
        </dl>

        {/* グラフ（ここから） */}
        <div className="absolute top-80">
          <CardHeader>
            <CardTitle className="font-serif">
              今年の出費
              <hr className="border-black border-2 rounded-[5px]" />
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-3">
            <ChartContainer
              config={chartConfig}
              className="h-[200px] w-[300px]"
            >
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: -20,
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
                <YAxis tickLine={false} axisLine={true} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey="desktop"
                  type="linear"
                  stroke="#00441b"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </div>
        {/* グラフ（ここまで） */}
        <div className="absolute top-150">
          <CardHeader>
            <CardTitle className="font-serif">
              出費ランキング TOP5
              <hr className="border-black border-2 rounded-[5px]" />
            </CardTitle>
          </CardHeader>
          <Tabs defaultValue="expendAverage" className="absolute top-160">
            <TabsList className="w-[73vw]">
              <TabsTrigger value="expendAverage">
                これまでの支出の平均
              </TabsTrigger>
              <TabsTrigger value="thisMonthExpend">今月の支出</TabsTrigger>
            </TabsList>
            <TabsContent value="expendAverage">
              <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">INV001</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="thisMonthExpend">
              Change your password here.
            </TabsContent>
          </Tabs>
        </div>
      </BackgroundColor>
    </div>
  );
}

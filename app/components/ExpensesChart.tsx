"use client";
import Image from "next/image";
import React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import "react-calendar/dist/Calendar.css";

type CharData = {
  month: string;
  amount_sum: number;
};

type Prop = {
  chartData: CharData[];
};

export const ExpensesChart = ({ chartData }: Prop) => {
  const chartConfig = {
    amount_sum: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <>
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
                tickFormatter={
                  (value) => value.toLocaleString() // ← 3桁区切り（123,456）
                }
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
    </>
  );
};

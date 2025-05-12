"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartColumnBig } from "lucide-react";

const chartData = [
  { date: "2024-04-01", salaryLoan: 222, cashAdvanceLoan: 150, bonusLoan: 150 },
  { date: "2024-04-02", salaryLoan: 97, cashAdvanceLoan: 180, bonusLoan: 180 },
  { date: "2024-04-03", salaryLoan: 167, cashAdvanceLoan: 120, bonusLoan: 120 },
  { date: "2024-04-04", salaryLoan: 242, cashAdvanceLoan: 260, bonusLoan: 260 },
  { date: "2024-04-05", salaryLoan: 373, cashAdvanceLoan: 290, bonusLoan: 290 },
  { date: "2024-04-06", salaryLoan: 301, cashAdvanceLoan: 340, bonusLoan: 340 },
  { date: "2024-04-07", salaryLoan: 245, cashAdvanceLoan: 180, bonusLoan: 180 },
  { date: "2024-04-08", salaryLoan: 409, cashAdvanceLoan: 320, bonusLoan: 320 },
  { date: "2024-04-09", salaryLoan: 59, cashAdvanceLoan: 110, bonusLoan: 110 },
  { date: "2024-04-10", salaryLoan: 261, cashAdvanceLoan: 190, bonusLoan: 190 },
  { date: "2024-04-11", salaryLoan: 327, cashAdvanceLoan: 350, bonusLoan: 350 },
  { date: "2024-04-12", salaryLoan: 292, cashAdvanceLoan: 210, bonusLoan: 210 },
  { date: "2024-04-13", salaryLoan: 342, cashAdvanceLoan: 380, bonusLoan: 380 },
  { date: "2024-04-14", salaryLoan: 137, cashAdvanceLoan: 220, bonusLoan: 220 },
  { date: "2024-04-15", salaryLoan: 120, cashAdvanceLoan: 170, bonusLoan: 170 },
  { date: "2024-04-16", salaryLoan: 138, cashAdvanceLoan: 190, bonusLoan: 190 },
  { date: "2024-04-17", salaryLoan: 446, cashAdvanceLoan: 360, bonusLoan: 360 },
  { date: "2024-04-18", salaryLoan: 364, cashAdvanceLoan: 410, bonusLoan: 410 },
  { date: "2024-04-19", salaryLoan: 243, cashAdvanceLoan: 180, bonusLoan: 180 },
  { date: "2024-04-20", salaryLoan: 89, cashAdvanceLoan: 150, bonusLoan: 150 },
  { date: "2024-04-21", salaryLoan: 137, cashAdvanceLoan: 200, bonusLoan: 200 },
  { date: "2024-04-22", salaryLoan: 224, cashAdvanceLoan: 170, bonusLoan: 170 },
  { date: "2024-04-23", salaryLoan: 138, cashAdvanceLoan: 230, bonusLoan: 230 },
  { date: "2024-04-24", salaryLoan: 387, cashAdvanceLoan: 290, bonusLoan: 290 },
  { date: "2024-04-25", salaryLoan: 215, cashAdvanceLoan: 250, bonusLoan: 250 },
  { date: "2024-04-26", salaryLoan: 75, cashAdvanceLoan: 130, bonusLoan: 130 },
  { date: "2024-04-27", salaryLoan: 383, cashAdvanceLoan: 420, bonusLoan: 420 },
  { date: "2024-04-28", salaryLoan: 122, cashAdvanceLoan: 180, bonusLoan: 180 },
  { date: "2024-04-29", salaryLoan: 315, cashAdvanceLoan: 240, bonusLoan: 240 },
  { date: "2024-04-30", salaryLoan: 454, cashAdvanceLoan: 380, bonusLoan: 380 },
  { date: "2024-05-01", salaryLoan: 165, cashAdvanceLoan: 220, bonusLoan: 220 },
  { date: "2024-05-02", salaryLoan: 293, cashAdvanceLoan: 310, bonusLoan: 310 },
  { date: "2024-05-03", salaryLoan: 247, cashAdvanceLoan: 190, bonusLoan: 190 },
  { date: "2024-05-04", salaryLoan: 385, cashAdvanceLoan: 420, bonusLoan: 420 },
  { date: "2024-05-05", salaryLoan: 481, cashAdvanceLoan: 390, bonusLoan: 390 },
  { date: "2024-05-06", salaryLoan: 498, cashAdvanceLoan: 520, bonusLoan: 520 },
  { date: "2024-05-07", salaryLoan: 388, cashAdvanceLoan: 300, bonusLoan: 300 },
  { date: "2024-05-08", salaryLoan: 149, cashAdvanceLoan: 210, bonusLoan: 210 },
  { date: "2024-05-09", salaryLoan: 227, cashAdvanceLoan: 180, bonusLoan: 180 },
  { date: "2024-05-10", salaryLoan: 293, cashAdvanceLoan: 330, bonusLoan: 330 },
  { date: "2024-05-11", salaryLoan: 335, cashAdvanceLoan: 270, bonusLoan: 270 },
  { date: "2024-05-12", salaryLoan: 197, cashAdvanceLoan: 240, bonusLoan: 240 },
  { date: "2024-05-13", salaryLoan: 197, cashAdvanceLoan: 160, bonusLoan: 160 },
  { date: "2024-05-14", salaryLoan: 448, cashAdvanceLoan: 490, bonusLoan: 490 },
  { date: "2024-05-15", salaryLoan: 473, cashAdvanceLoan: 380, bonusLoan: 380 },
  { date: "2024-05-16", salaryLoan: 338, cashAdvanceLoan: 400, bonusLoan: 400 },
  { date: "2024-05-17", salaryLoan: 499, cashAdvanceLoan: 420, bonusLoan: 420 },
  { date: "2024-05-18", salaryLoan: 315, cashAdvanceLoan: 350, bonusLoan: 350 },
  { date: "2024-05-19", salaryLoan: 235, cashAdvanceLoan: 180, bonusLoan: 180 },
  { date: "2024-05-20", salaryLoan: 177, cashAdvanceLoan: 230, bonusLoan: 230 },
  { date: "2024-05-21", salaryLoan: 82, cashAdvanceLoan: 140, bonusLoan: 140 },
  { date: "2024-05-22", salaryLoan: 81, cashAdvanceLoan: 120, bonusLoan: 120 },
  { date: "2024-05-23", salaryLoan: 252, cashAdvanceLoan: 290, bonusLoan: 290 },
  { date: "2024-05-24", salaryLoan: 294, cashAdvanceLoan: 220, bonusLoan: 220 },
  { date: "2024-05-25", salaryLoan: 201, cashAdvanceLoan: 250, bonusLoan: 250 },
  { date: "2024-05-26", salaryLoan: 213, cashAdvanceLoan: 170, bonusLoan: 170 },
  { date: "2024-05-27", salaryLoan: 420, cashAdvanceLoan: 460, bonusLoan: 460 },
  { date: "2024-05-28", salaryLoan: 233, cashAdvanceLoan: 190, bonusLoan: 190 },
  { date: "2024-05-29", salaryLoan: 78, cashAdvanceLoan: 130, bonusLoan: 130 },
  { date: "2024-05-30", salaryLoan: 340, cashAdvanceLoan: 280, bonusLoan: 280 },
  { date: "2024-05-31", salaryLoan: 178, cashAdvanceLoan: 230, bonusLoan: 230 },
  { date: "2024-06-01", salaryLoan: 178, cashAdvanceLoan: 200, bonusLoan: 200 },
  { date: "2024-06-02", salaryLoan: 470, cashAdvanceLoan: 410, bonusLoan: 410 },
  { date: "2024-06-03", salaryLoan: 103, cashAdvanceLoan: 160, bonusLoan: 160 },
  { date: "2024-06-04", salaryLoan: 439, cashAdvanceLoan: 380, bonusLoan: 380 },
  { date: "2024-06-05", salaryLoan: 88, cashAdvanceLoan: 140, bonusLoan: 140 },
  { date: "2024-06-06", salaryLoan: 294, cashAdvanceLoan: 250, bonusLoan: 250 },
  { date: "2024-06-07", salaryLoan: 323, cashAdvanceLoan: 370, bonusLoan: 370 },
  { date: "2024-06-08", salaryLoan: 385, cashAdvanceLoan: 320, bonusLoan: 320 },
  { date: "2024-06-09", salaryLoan: 438, cashAdvanceLoan: 480, bonusLoan: 480 },
  { date: "2024-06-10", salaryLoan: 155, cashAdvanceLoan: 200, bonusLoan: 200 },
  { date: "2024-06-11", salaryLoan: 92, cashAdvanceLoan: 150, bonusLoan: 150 },
  { date: "2024-06-12", salaryLoan: 492, cashAdvanceLoan: 420, bonusLoan: 420 },
  { date: "2024-06-13", salaryLoan: 81, cashAdvanceLoan: 130, bonusLoan: 130 },
  { date: "2024-06-14", salaryLoan: 426, cashAdvanceLoan: 380, bonusLoan: 380 },
  { date: "2024-06-15", salaryLoan: 307, cashAdvanceLoan: 350, bonusLoan: 350 },
  { date: "2024-06-16", salaryLoan: 371, cashAdvanceLoan: 310, bonusLoan: 310 },
  { date: "2024-06-17", salaryLoan: 475, cashAdvanceLoan: 520, bonusLoan: 520 },
  { date: "2024-06-18", salaryLoan: 107, cashAdvanceLoan: 170, bonusLoan: 170 },
  { date: "2024-06-19", salaryLoan: 341, cashAdvanceLoan: 290, bonusLoan: 290 },
  { date: "2024-06-20", salaryLoan: 408, cashAdvanceLoan: 450, bonusLoan: 450 },
  { date: "2024-06-21", salaryLoan: 169, cashAdvanceLoan: 210, bonusLoan: 210 },
  { date: "2024-06-22", salaryLoan: 317, cashAdvanceLoan: 270, bonusLoan: 270 },
  { date: "2024-06-23", salaryLoan: 480, cashAdvanceLoan: 530, bonusLoan: 530 },
  { date: "2024-06-24", salaryLoan: 132, cashAdvanceLoan: 180, bonusLoan: 180 },
  { date: "2024-06-25", salaryLoan: 141, cashAdvanceLoan: 190, bonusLoan: 190 },
  { date: "2024-06-26", salaryLoan: 434, cashAdvanceLoan: 380, bonusLoan: 380 },
  { date: "2024-06-27", salaryLoan: 448, cashAdvanceLoan: 490, bonusLoan: 490 },
  { date: "2024-06-28", salaryLoan: 149, cashAdvanceLoan: 200, bonusLoan: 200 },
  { date: "2024-06-29", salaryLoan: 103, cashAdvanceLoan: 160, bonusLoan: 160 },
  { date: "2024-06-30", salaryLoan: 446, cashAdvanceLoan: 400, bonusLoan: 500 },
]

const chartConfig = {
  views: {
    label: "Page Views",
  },
  salaryLoan: {
    label: "Salary Loans",
    color: "var(--primary)",
  },
  cashAdvanceLoan: {
    label: "CA Loans",
    color: "var(--primary)",
  },
  bonusLoan: {
    label: "Bonus Loans",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartComponent() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("salaryLoan")

  const total = React.useMemo(
    () => ({
      salaryLoan: chartData.reduce((acc, curr) => acc + curr.salaryLoan, 0),
      cashAdvanceLoan: chartData.reduce((acc, curr) => acc + curr.cashAdvanceLoan, 0),
      bonusLoan: chartData.reduce((acc, curr) => acc + curr.bonusLoan, 0),
    }),
    []
  )

  return (
    <Card className="p-0">
        <CardHeader className="flex flex-col items-stretch p-0 gap-0 sm:flex-row" style={{paddingBottom: "0px", flexDirection: "column"}}>
            <div className="flex items-center gap-2 p-3">
                <ChartColumnBig width={14} height={14} className="text-[var(--muted-foreground)]" />
                <span className="text-sm text-gray-500">Chart</span>
            </div>
            <div className="flex justify-between border-y">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Total No. of Active Loans</CardTitle>
                    <CardDescription>
                        Showing total active loans for the last 3 months
                    </CardDescription>
                </div>
                <div className="flex border-l border-l-[var(--border)]">
                    {["salaryLoan", "cashAdvanceLoan", "bonusLoan"].map((key) => {
                    const chart = key as keyof typeof chartConfig
                    return (
                        <button
                        key={chart}
                        data-active={activeChart === chart}
                        className="relative z-30 flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:border-t-0 sm:px-8 sm:py-6"
                        onClick={() => setActiveChart(chart)}
                        >
                        <span className="text-xs text-muted-foreground">
                            {chartConfig[chart].label}
                        </span>
                        <span className="text-lg font-bold leading-none sm:text-3xl">
                            {total[key as keyof typeof total].toLocaleString()}
                        </span>
                        </button>
                    )
                    })}
                </div>
            </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
            <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[250px] w-full"
            >
                <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                    left: 12,
                    right: 12,
                }}
                >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                    })
                    }}
                />
                <ChartTooltip
                    content={
                    <ChartTooltipContent
                        className="w-[150px]"
                        nameKey="views"
                        labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })
                        }}
                    />
                    }
                />
                <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
                </BarChart>
            </ChartContainer>
        </CardContent>
    </Card>
  )
}
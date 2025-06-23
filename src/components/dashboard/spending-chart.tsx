"use client"

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { spendingData } from "@/lib/data"

const chartConfig = {
  value: {
    label: "Value",
  },
  groceries: {
    label: "Groceries",
    color: "hsl(var(--chart-1))",
  },
  rent: {
    label: "Rent",
    color: "hsl(var(--chart-2))",
  },
  entertainment: {
    label: "Entertainment",
    color: "hsl(var(--chart-3))",
  },
  transport: {
    label: "Transport",
    color: "hsl(var(--chart-4))",
  },
  health: {
    label: "Health",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function SpendingChart() {
  const totalValue = React.useMemo(() => {
    return spendingData.reduce((acc, curr) => acc + curr.value, 0)
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>July 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={spendingData}
              dataKey="value"
              nameKey="category"
              innerRadius="60%"
              strokeWidth={5}
            >
                {spendingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
       <CardContent className="mt-4 flex flex-col gap-2 text-sm">
        <div className="flex items-center justify-center text-center font-medium leading-none">
          Total Spent: ${totalValue.toFixed(2)}
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 p-4">
          {spendingData.map((item) => (
            <div key={item.category} className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
              <div className="flex-1 truncate">{item.category}</div>
              <div className="font-medium">${item.value.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

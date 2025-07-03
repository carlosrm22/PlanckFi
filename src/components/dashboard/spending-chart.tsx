"use client"

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"
import { format } from "date-fns"
import { es } from 'date-fns/locale';

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
import { useAppData } from "@/context/app-data-context"

export function SpendingChart() {
  const { transactions, categories } = useAppData();

  const { chartData, chartConfig, totalValue, currentMonthLabel } = React.useMemo(() => {
    const today = new Date();
    const currentMonth = format(today, 'yyyy-MM');
    const label = format(today, 'MMMM yyyy', { locale: es });

    const monthlyExpenses = transactions.filter(t => 
        t.type === 'expense' &&
        format(new Date(t.date), 'yyyy-MM') === currentMonth
    );

    const spendingByCategory = monthlyExpenses.reduce((acc, transaction) => {
        const category = transaction.category;
        const amount = Math.abs(transaction.amount);
        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category] += amount;
        return acc;
    }, {} as Record<string, number>);

    // Create a stable color map for categories
    const categoryColorMap = categories.reduce((acc, category, index) => {
        // Use the 5 predefined chart colors, cycling through them
        acc[category.name] = `var(--chart-${(index % 5) + 1})`;
        return acc;
    }, {} as Record<string, string>);

    const data = Object.entries(spendingByCategory)
        .map(([categoryName, value]) => ({
            category: categoryName,
            value: value,
            fill: categoryColorMap[categoryName] || 'hsl(var(--muted))', // Fallback color
        }))
        .sort((a, b) => b.value - a.value);

    const config: ChartConfig = data.reduce((acc, item) => {
      acc[item.category] = {
        label: item.category,
        color: item.fill,
      }
      return acc;
    }, {} as ChartConfig);
    
    const total = data.reduce((acc, curr) => acc + curr.value, 0);

    return { 
      chartData: data, 
      chartConfig: config, 
      totalValue: total,
      currentMonthLabel: label.charAt(0).toUpperCase() + label.slice(1)
    };
  }, [transactions, categories]);


  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Gastos por Categoría</CardTitle>
        <CardDescription>{currentMonthLabel}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent 
                    formatter={(value, name) => [`$${(value as number).toFixed(2)}`, name as string]}
                    hideLabel 
                />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="category"
                innerRadius="60%"
                strokeWidth={5}
              >
                  {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="mx-auto flex h-full max-h-[300px] aspect-square items-center justify-center p-4 text-center text-muted-foreground">
            No hay datos de gastos para mostrar para este mes.
          </div>
        )}
      </CardContent>
       <CardContent className="mt-4 flex flex-col gap-2 text-sm">
        <div className="flex items-center justify-center text-center font-medium leading-none">
          Gasto Total: ${totalValue.toFixed(2)}
        </div>
        {chartData.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 p-4">
            {chartData.map((item) => (
              <div key={item.category} className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                <div className="flex-1 truncate">{item.category}</div>
                <div className="font-medium">${item.value.toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

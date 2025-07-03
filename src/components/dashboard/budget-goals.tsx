
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { BudgetGoal } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAppData } from "@/context/app-data-context";

export function BudgetGoals() {
  const { budgets } = useAppData();
  const goalsToDisplay = budgets;
  
  if (goalsToDisplay.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Metas de Presupuesto</CardTitle>
                <CardDescription>Tus metas de gasto mensuales.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center text-muted-foreground p-8">
                    <p>No has creado ningún presupuesto todavía.</p>
                    <p>¡Crea uno para empezar a seguir tus gastos!</p>
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metas de Presupuesto</CardTitle>
        <CardDescription>Tus metas de gasto mensuales.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {goalsToDisplay.map((goal) => {
          const percentage = Math.min((goal.spent / goal.budgeted) * 100, 100);
          const isOverBudget = goal.spent > goal.budgeted;

          return (
            <div key={goal.category} className="space-y-2">
              <div className="flex justify-between items-baseline">
                <div className="flex items-center gap-2">
                  <goal.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{goal.category}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className={cn("font-semibold", isOverBudget ? "text-destructive" : "text-card-foreground")}>
                    {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(goal.spent)}
                  </span>
                  <span> / {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(goal.budgeted)}</span>
                </div>
              </div>
              <Progress value={percentage} indicatorClassName={isOverBudget ? "bg-destructive" : ""} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

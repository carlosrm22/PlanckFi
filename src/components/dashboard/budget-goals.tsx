import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { budgetGoals } from "@/lib/data";
import { cn } from "@/lib/utils";

export function BudgetGoals() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Goals</CardTitle>
        <CardDescription>Your monthly spending goals.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {budgetGoals.map((goal) => {
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
                    ${goal.spent.toFixed(2)}
                  </span>
                  <span> / ${goal.budgeted.toFixed(2)}</span>
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

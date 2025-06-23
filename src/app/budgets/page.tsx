import { AppShell } from "@/components/layout/app-shell";
import { BudgetGoals } from "@/components/dashboard/budget-goals";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BudgetsPage() {
  return (
    <AppShell>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
            <div className="grid gap-1">
                <h1 className="text-2xl font-bold">Presupuestos</h1>
                <p className="text-muted-foreground">Gestiona tus metas de gasto mensuales.</p>
            </div>
            <Button>Crear Presupuesto</Button>
        </div>
        <BudgetGoals />
        <BudgetGoals />
      </div>
    </AppShell>
  );
}

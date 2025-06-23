import { AppShell } from "@/components/layout/app-shell";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { BudgetGoals } from "@/components/dashboard/budget-goals";
import { UpcomingBills } from "@/components/dashboard/upcoming-bills";
import { CategoryManagement } from "@/components/dashboard/category-management";
import { AISuggestions } from "@/components/dashboard/ai-suggestions";

export default function Home() {
  return (
    <AppShell>
      <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <OverviewCards />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <SpendingChart />
          <BudgetGoals />
        </div>
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <UpcomingBills />
          </div>
          <div className="lg:col-span-2">
            <CategoryManagement />
          </div>
        </div>
        <div className="grid gap-6">
          <AISuggestions />
        </div>
      </div>
    </AppShell>
  );
}

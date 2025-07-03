import { AppShell } from "@/components/layout/app-shell";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { BudgetGoals } from "@/components/dashboard/budget-goals";
import { UpcomingPendingPayments } from "@/components/dashboard/upcoming-bills";
import { AISuggestions } from "@/components/dashboard/ai-suggestions";

export default function Home() {
  return (
    <AppShell>
      <div className="grid gap-6">
        <WelcomeBanner />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <OverviewCards />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <SpendingChart />
          <BudgetGoals />
        </div>
        <div className="grid gap-6">
          <UpcomingPendingPayments />
        </div>
        <div className="grid gap-6">
          <AISuggestions />
        </div>
      </div>
    </AppShell>
  );
}

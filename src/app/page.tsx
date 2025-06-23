import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Wallet,
  ArrowRightLeft,
  Goal,
  Settings,
  Search,
} from "lucide-react";
import { Logo } from "@/components/icons";
import { UserNav } from "@/components/user-nav";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { BudgetGoals } from "@/components/dashboard/budget-goals";
import { UpcomingBills } from "@/components/dashboard/upcoming-bills";
import { CategoryManagement } from "@/components/dashboard/category-management";
import { AISuggestions } from "@/components/dashboard/ai-suggestions";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">BudgetFlow</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Dashboard" isActive>
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Transactions">
                <ArrowRightLeft />
                <span>Transactions</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Accounts">
                <Wallet />
                <span>Accounts</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Budgets">
                <Goal />
                <span>Budgets</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
          <SidebarTrigger className="md:hidden" />
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <UserNav />
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
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
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Tag,
  ScanLine,
  CalendarClock,
} from "lucide-react";
import { Logo } from "@/components/icons";
import { UserNav } from "@/components/user-nav";

const navItems = [
  { href: "/", label: "Panel", icon: LayoutDashboard },
  { href: "/transactions", label: "Transacciones", icon: ArrowRightLeft },
  { href: "/accounts", label: "Cuentas", icon: Wallet },
  { href: "/budgets", label: "Presupuestos", icon: Goal },
  { href: "/bills", label: "Pagos Pendientes", icon: CalendarClock },
  { href: "/categories", label: "Categorías", icon: Tag },
  { href: "/scan-receipt", label: "Escanear Recibo", icon: ScanLine },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-primary" />
            <Link href="/" className="text-lg font-semibold">PlanckFi</Link>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.label}
                  isActive={pathname === item.href}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
               <SidebarMenuButton
                  asChild
                  tooltip="Configuración"
                  isActive={pathname === "/settings"}
                >
                  <Link href="/settings">
                    <Settings />
                    <span>Configuración</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1" />
          <UserNav />
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { accounts } from "@/lib/data";
import { CreditCard, Landmark, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

const accountIcons = {
  Checking: Wallet,
  Savings: Landmark,
  "Credit Card": CreditCard,
};

export default function AccountsPage() {
  return (
    <AppShell>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
            <div className="grid gap-1">
                <h1 className="text-2xl font-bold">Cuentas</h1>
                <p className="text-muted-foreground">Gestiona tus cuentas conectadas.</p>
            </div>
            <Button>Conectar una nueva cuenta</Button>
        </div>
        <div className="space-y-4">
          {accounts.map((account) => {
            const Icon = accountIcons[account.type];
            return (
              <Card key={account.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <Icon className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{account.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {account.provider} •••• {account.lastFour}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                       {new Intl.NumberFormat("es-ES", {
                          style: "currency",
                          currency: "USD",
                        }).format(account.balance)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {account.type === "Checking" ? "Cuenta Corriente" : account.type === "Savings" ? "Ahorros" : "Tarjeta de Crédito"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

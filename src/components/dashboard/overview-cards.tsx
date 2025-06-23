
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CreditCard, Wallet } from "lucide-react";
import { useAppData } from "@/context/app-data-context";
import { format } from "date-fns";

export function OverviewCards() {
  const { accounts, transactions } = useAppData();

  const { totalBalance, monthlyIncome, monthlyExpenses } = useMemo(() => {
    const totalBalance = accounts.reduce((acc, account) => acc + account.balance, 0);

    const currentMonth = format(new Date(), 'yyyy-MM');
    const monthlyIncome = transactions
        .filter(t => t.type === 'income' && format(new Date(t.date), 'yyyy-MM') === currentMonth)
        .reduce((acc, t) => acc + t.amount, 0);
    
    const monthlyExpenses = transactions
        .filter(t => t.type === 'expense' && format(new Date(t.date), 'yyyy-MM') === currentMonth)
        .reduce((acc, t) => acc + t.amount, 0);

    return { totalBalance, monthlyIncome, monthlyExpenses };
  }, [accounts, transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "USD",
    }).format(amount);
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
          <p className="text-xs text-muted-foreground">
            Saldo combinado de todas tus cuentas.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos de este mes</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(monthlyIncome)}</div>
           <p className="text-xs text-muted-foreground">
            Total de ingresos para el mes actual.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gastos de este mes</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(Math.abs(monthlyExpenses))}</div>
          <p className="text-xs text-muted-foreground">
            Total de gastos para el mes actual.
            </p>
        </CardContent>
      </Card>
    </>
  );
}

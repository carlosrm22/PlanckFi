
'use client';

import { useMemo } from 'react';
import { useAppData } from '@/context/app-data-context';
import { format, subMonths } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PiggyBank, ShieldCheck, TrendingUp, Percent, Info, Scale, ArrowRightLeft, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FinancialAnalysis() {
  const { transactions, accounts, pendingPayments } = useAppData();

  const metrics = useMemo(() => {
    const today = new Date();
    const currentMonthStr = format(today, 'yyyy-MM');
    const lastMonthStr = format(subMonths(today, 1), 'yyyy-MM');

    // Income & Expenses
    const monthlyIncome = transactions
      .filter(t => t.type === 'income' && format(new Date(t.date), 'yyyy-MM') === currentMonthStr)
      .reduce((acc, t) => acc + t.amount, 0);

    const monthlyExpenses = transactions
      .filter(t => t.type === 'expense' && format(new Date(t.date), 'yyyy-MM') === currentMonthStr)
      .reduce((acc, t) => acc + Math.abs(t.amount), 0);
    
    const lastMonthExpenses = transactions
      .filter(t => t.type === 'expense' && format(new Date(t.date), 'yyyy-MM') === lastMonthStr)
      .reduce((acc, t) => acc + Math.abs(t.amount), 0);

    // Core Metrics
    const netMonthlyCashFlow = monthlyIncome - monthlyExpenses;
    const savingsRate = monthlyIncome > 0 ? (netMonthlyCashFlow / monthlyIncome) * 100 : 0;
    
    const spendingTrend = lastMonthExpenses > 0 
      ? ((monthlyExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 
      : monthlyExpenses > 0 ? 100 : 0;

    // Balance & Debt
    const totalAssets = accounts
      .filter(a => a.type === 'Checking' || a.type === 'Savings')
      .reduce((acc, a) => acc + a.balance, 0);
      
    const totalLiabilities = accounts
      .filter(a => a.type === 'Credit Card')
      .reduce((acc, a) => acc + Math.abs(a.balance), 0); 

    const netWorth = totalAssets - totalLiabilities;
    
    // Ratios & Funds
    const emergencyFundMonths = monthlyExpenses > 0 ? totalAssets / monthlyExpenses : 0;
    
    const monthlyDebtPayments = pendingPayments.reduce((acc, p) => acc + p.amount, 0);
    const dtiRatio = monthlyIncome > 0 ? (monthlyDebtPayments / monthlyIncome) * 100 : 0;

    return {
      savingsRate,
      emergencyFundMonths,
      dtiRatio,
      netWorth,
      netMonthlyCashFlow,
      spendingTrend,
    };
  }, [transactions, accounts, pendingPayments]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "USD",
    }).format(amount);
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Análisis Financiero
        </CardTitle>
        <CardDescription>Métricas clave sobre tu salud financiera para el mes actual.</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Savings Rate */}
                <div className="flex flex-col gap-2 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <PiggyBank className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-semibold">Tasa de Ahorro</h3>
                        </div>
                         <Tooltip>
                            <TooltipTrigger asChild><Info className="h-4 w-4 text-muted-foreground cursor-pointer" /></TooltipTrigger>
                            <TooltipContent><p>El porcentaje de tus ingresos que estás ahorrando.</p></TooltipContent>
                        </Tooltip>
                    </div>
                    <p className={cn("text-3xl font-bold", metrics.savingsRate >= 20 ? "text-emerald-600" : metrics.savingsRate >= 10 ? "text-yellow-500" : "text-destructive")}>
                        {metrics.savingsRate.toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {metrics.savingsRate >= 20 ? "¡Excelente! Estás en el camino correcto." : metrics.savingsRate >= 10 ? "¡Buen trabajo! Sigue así." : "Intenta aumentar tus ahorros."}
                    </p>
                </div>

                {/* Emergency Fund */}
                 <div className="flex flex-col gap-2 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-semibold">Fondo de Emergencia</h3>
                        </div>
                         <Tooltip>
                            <TooltipTrigger asChild><Info className="h-4 w-4 text-muted-foreground cursor-pointer" /></TooltipTrigger>
                            <TooltipContent><p>Cuántos meses de gastos tienes cubiertos. Se recomienda tener de 3 a 6 meses.</p></TooltipContent>
                        </Tooltip>
                    </div>
                    <p className="text-3xl font-bold">
                        {metrics.emergencyFundMonths.toFixed(1)} <span className="text-lg font-medium text-muted-foreground">meses</span>
                    </p>
                    <Progress value={(metrics.emergencyFundMonths / 6) * 100} />
                     <p className="text-sm text-muted-foreground">Meta: 6 meses</p>
                </div>
                
                {/* DTI Ratio */}
                <div className="flex flex-col gap-2 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Percent className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-semibold">Ratio Deuda/Ingreso</h3>
                        </div>
                         <Tooltip>
                            <TooltipTrigger asChild><Info className="h-4 w-4 text-muted-foreground cursor-pointer" /></TooltipTrigger>
                            <TooltipContent><p>Porcentaje de tu ingreso que se va a pagos de deudas recurrentes. Menos de 36% es ideal.</p></TooltipContent>
                        </Tooltip>
                    </div>
                     <p className={cn("text-3xl font-bold", metrics.dtiRatio <= 36 ? "text-emerald-600" : metrics.dtiRatio <= 43 ? "text-yellow-500" : "text-destructive")}>
                        {metrics.dtiRatio.toFixed(1)}%
                    </p>
                     <p className="text-sm text-muted-foreground">
                        {metrics.dtiRatio <= 36 ? "Saludable." : metrics.dtiRatio <= 43 ? "Manejable, pero con precaución." : "Alto, considera reducir deudas."}
                    </p>
                </div>

                {/* Net Worth */}
                <div className="flex flex-col gap-2 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Scale className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-semibold">Patrimonio Neto</h3>
                        </div>
                        <Tooltip>
                            <TooltipTrigger asChild><Info className="h-4 w-4 text-muted-foreground cursor-pointer" /></TooltipTrigger>
                            <TooltipContent><p>El valor total de tus activos menos tus pasivos.</p></TooltipContent>
                        </Tooltip>
                    </div>
                    <p className={cn("text-3xl font-bold", metrics.netWorth >= 0 ? "text-emerald-600" : "text-destructive")}>
                        {formatCurrency(metrics.netWorth)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {metrics.netWorth > 10000 ? "¡Vas por un excelente camino!" : metrics.netWorth > 0 ? "¡Felicidades, es positivo!" : "Enfoque en reducir deudas."}
                    </p>
                </div>

                {/* Net Monthly Cash Flow */}
                <div className="flex flex-col gap-2 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-semibold">Flujo de Caja Neto</h3>
                        </div>
                        <Tooltip>
                            <TooltipTrigger asChild><Info className="h-4 w-4 text-muted-foreground cursor-pointer" /></TooltipTrigger>
                            <TooltipContent><p>La diferencia entre tus ingresos y gastos de este mes.</p></TooltipContent>
                        </Tooltip>
                    </div>
                    <p className={cn("text-3xl font-bold", metrics.netMonthlyCashFlow >= 0 ? "text-emerald-600" : "text-destructive")}>
                        {formatCurrency(metrics.netMonthlyCashFlow)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {metrics.netMonthlyCashFlow >= 0 ? "Estás gastando menos de lo que ganas." : "Estás gastando más de lo que ganas."}
                    </p>
                </div>

                {/* Spending Trend */}
                <div className="flex flex-col gap-2 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           {metrics.spendingTrend >= 0 ? <ArrowUpRight className="h-5 w-5 text-muted-foreground" /> : <ArrowDownRight className="h-5 w-5 text-muted-foreground" />}
                            <h3 className="font-semibold">Tendencia de Gastos</h3>
                        </div>
                        <Tooltip>
                            <TooltipTrigger asChild><Info className="h-4 w-4 text-muted-foreground cursor-pointer" /></TooltipTrigger>
                            <TooltipContent><p>Variación de tus gastos en comparación con el mes anterior.</p></TooltipContent>
                        </Tooltip>
                    </div>
                     <div className="flex items-baseline gap-2">
                        <p className={cn("text-3xl font-bold", metrics.spendingTrend > 5 ? "text-destructive" : metrics.spendingTrend < -5 ? "text-emerald-600" : "text-yellow-500")}>
                           {metrics.spendingTrend >= 0 ? '+' : ''}{metrics.spendingTrend.toFixed(1)}%
                        </p>
                         <span className="text-sm text-muted-foreground">vs. mes anterior</span>
                     </div>
                     <p className="text-sm text-muted-foreground">
                        {metrics.spendingTrend > 5 ? "Tus gastos han aumentado." : metrics.spendingTrend < -5 ? "¡Buen control! Has gastado menos." : "Tus gastos se mantienen estables."}
                    </p>
                </div>
            </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}

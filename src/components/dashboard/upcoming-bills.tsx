
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format, setDate, addMonths, isAfter, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { useAppData } from '@/context/app-data-context';

export function UpcomingPendingPayments() {
  const { pendingPayments, categories } = useAppData();

  const upcomingPayments = useMemo(() => {
    return pendingPayments
      .map(payment => {
        const today = startOfDay(new Date());
        const currentMonthDueDate = setDate(today, payment.dueDay);
        let nextDueDate = currentMonthDueDate;

        if (isAfter(today, currentMonthDueDate)) {
          nextDueDate = addMonths(currentMonthDueDate, 1);
        }
        
        const categoryInfo = categories.find(c => c.name === payment.category);
        
        return {
          ...payment,
          dueDate: nextDueDate,
          icon: categoryInfo?.icon,
        };
      })
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .slice(0, 4);
  }, [pendingPayments, categories]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximos Pagos Pendientes</CardTitle>
        <CardDescription>No te pierdas estas fechas de pago.</CardDescription>
      </CardHeader>
      <CardContent>
        {pendingPayments.length === 0 ? (
          <div className="text-center text-muted-foreground p-4">
            <p>No has añadido pagos pendientes recurrentes.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {upcomingPayments.map((payment) => {
              const Icon = payment.icon;
              return (
                <li key={payment.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {Icon && (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{payment.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Vence el {format(payment.dueDate, "dd MMM, yyyy", { locale: es })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${payment.amount.toFixed(2)}</p>
                    <Button variant="link" size="sm" className="h-auto p-0 text-primary">Marcar como Pagada</Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

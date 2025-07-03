
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format, setDate, addMonths, isAfter, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { useAppData } from '@/context/app-data-context';

export function UpcomingBills() {
  const { bills, categories } = useAppData();

  const upcomingBills = useMemo(() => {
    return bills
      .map(bill => {
        const today = startOfDay(new Date());
        const currentMonthDueDate = setDate(today, bill.dueDay);
        let nextDueDate = currentMonthDueDate;

        if (isAfter(today, currentMonthDueDate)) {
          nextDueDate = addMonths(currentMonthDueDate, 1);
        }
        
        const categoryInfo = categories.find(c => c.name === bill.category);
        
        return {
          ...bill,
          dueDate: nextDueDate,
          icon: categoryInfo?.icon,
        };
      })
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .slice(0, 4);
  }, [bills, categories]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximas Facturas</CardTitle>
        <CardDescription>No te pierdas estas fechas de pago.</CardDescription>
      </CardHeader>
      <CardContent>
        {bills.length === 0 ? (
          <div className="text-center text-muted-foreground p-4">
            <p>No has añadido facturas recurrentes.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {upcomingBills.map((bill) => {
              const Icon = bill.icon;
              return (
                <li key={bill.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {Icon && (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{bill.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Vence el {format(bill.dueDate, "dd MMM, yyyy", { locale: es })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${bill.amount.toFixed(2)}</p>
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

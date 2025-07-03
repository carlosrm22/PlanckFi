
'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format, setDate, addMonths, isAfter, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreVertical, Check, Pencil, Trash2 } from "lucide-react";
import { useAppData } from '@/context/app-data-context';
import type { PendingPayment } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function UpcomingPendingPayments() {
  const { pendingPayments, categories, addTransaction, deletePendingPayment } = useAppData();
  const { toast } = useToast();
  const router = useRouter();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<PendingPayment | null>(null);

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

  const handleMarkAsPaid = (payment: PendingPayment) => {
    addTransaction({
        description: `Pago de: ${payment.name}`,
        amount: -Math.abs(payment.amount),
        date: new Date().toISOString(),
        category: payment.category,
        type: 'expense'
    });
    toast({
        title: "¡Pago Registrado!",
        description: `El pago de "${payment.name}" se ha añadido a tus transacciones.`
    });
  }

  const handleEdit = () => {
    router.push('/bills');
  }

  const openDeleteDialog = (payment: PendingPayment) => {
    setPaymentToDelete(payment);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (paymentToDelete) {
      deletePendingPayment(paymentToDelete.id);
      setDeleteConfirmOpen(false);
      setPaymentToDelete(null);
    }
  };


  return (
    <>
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
                  <li key={payment.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
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
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
                        <p className="font-semibold text-left sm:text-right">${payment.amount.toFixed(2)}</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Abrir menú</span>
                                    <MoreVertical className="h-4 w-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleMarkAsPaid(payment)}>
                                    <Check className="mr-2 h-4 w-4" />
                                    Marcar como Pagada
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleEdit}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Editar / Gestionar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openDeleteDialog(payment)} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
      
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                      Esta acción no se puede deshacer. Esto eliminará permanentemente el pago pendiente de tu lista.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setPaymentToDelete(null)}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className={buttonVariants({ variant: "destructive" })}>Eliminar</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

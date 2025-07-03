
'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusCircle, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppData } from "@/context/app-data-context";
import type { PendingPayment } from "@/lib/types";

const pendingPaymentFormSchema = z.object({
  name: z.string().min(1, { message: "El nombre es obligatorio." }),
  amount: z.coerce.number({ required_error: "El monto es obligatorio." }).positive(),
  category: z.string({ required_error: "La categoría es obligatoria." }),
  dueDay: z.coerce.number().min(1, { message: "El día debe ser mayor o igual a 1." }).max(31, { message: "El día debe ser menor o igual a 31." }),
});

export default function BillsPage() {
  const { pendingPayments, categories, addPendingPayment, editPendingPayment, deletePendingPayment } = useAppData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editingPendingPayment, setEditingPendingPayment] = useState<PendingPayment | null>(null);
  const [pendingPaymentToDelete, setPendingPaymentToDelete] = useState<string | null>(null);
  
  const expenseCategories = categories.filter(c => c.name !== 'Ingresos');

  const form = useForm<z.infer<typeof pendingPaymentFormSchema>>({
    resolver: zodResolver(pendingPaymentFormSchema),
  });

  useEffect(() => {
    if (editingPendingPayment) {
      form.reset({ ...editingPendingPayment });
    } else {
      form.reset({
        name: "",
        amount: undefined,
        category: undefined,
        dueDay: undefined,
      });
    }
  }, [editingPendingPayment, form]);

  function onSubmit(values: z.infer<typeof pendingPaymentFormSchema>) {
    if (editingPendingPayment) {
      editPendingPayment(editingPendingPayment.id, values);
    } else {
      addPendingPayment(values);
    }
    setDialogOpen(false);
    setEditingPendingPayment(null);
  }

  const openEditDialog = (payment: PendingPayment) => {
    setEditingPendingPayment(payment);
    setDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setPendingPaymentToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (pendingPaymentToDelete) {
      deletePendingPayment(pendingPaymentToDelete);
      setDeleteConfirmOpen(false);
      setPendingPaymentToDelete(null);
    }
  };

  return (
    <AppShell>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div className="grid gap-1">
            <h1 className="text-2xl font-bold">Pagos Pendientes</h1>
            <p className="text-muted-foreground">Gestiona tus pagos recurrentes y fechas de vencimiento.</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditingPendingPayment(null); }}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Pago
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingPendingPayment ? "Editar Pago" : "Añadir Nuevo Pago"}</DialogTitle>
                <DialogDescription>
                  {editingPendingPayment ? "Actualiza los detalles de tu pago recurrente." : "Añade un nuevo pago para seguir tus vencimientos."}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 pt-4"
                >
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Pago</FormLabel>
                      <FormControl><Input placeholder="Ej. Suscripción a Netflix" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="amount" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monto Mensual</FormLabel>
                      <FormControl><Input type="number" placeholder="15.99" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="dueDay" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Día de Vencimiento</FormLabel>
                      <FormControl><Input type="number" placeholder="Día del mes (1-31)" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                       <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {expenseCategories.map(cat => <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <DialogFooter><Button type="submit">{editingPendingPayment ? "Guardar Cambios" : "Guardar Pago"}</Button></DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-4">
          {pendingPayments.map((payment) => {
            const categoryInfo = categories.find(c => c.name === payment.category);
            const Icon = categoryInfo?.icon;
            return (
              <Card key={payment.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    {Icon && <Icon className="h-8 w-8 text-muted-foreground" />}
                    <div>
                      <p className="font-semibold">{payment.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Vence el día {payment.dueDay} de cada mes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-lg font-bold">
                         {new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD" }).format(payment.amount)}
                      </p>
                       <p className="text-sm text-muted-foreground">{payment.category}</p>
                    </div>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menú</span>
                                <MoreVertical className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(payment)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDeleteDialog(payment.id)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

       <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                      Esta acción no se puede deshacer. Esto eliminará permanentemente el pago pendiente.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setPendingPaymentToDelete(null)}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

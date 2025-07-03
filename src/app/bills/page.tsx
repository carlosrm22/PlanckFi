
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
import type { Bill } from "@/lib/types";

const billFormSchema = z.object({
  name: z.string().min(1, { message: "El nombre es obligatorio." }),
  amount: z.coerce.number({ required_error: "El monto es obligatorio." }).positive(),
  category: z.string({ required_error: "La categoría es obligatoria." }),
  dueDay: z.coerce.number().min(1, { message: "El día debe ser mayor o igual a 1." }).max(31, { message: "El día debe ser menor o igual a 31." }),
});

export default function BillsPage() {
  const { bills, categories, addBill, editBill, deleteBill } = useAppData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [billToDelete, setBillToDelete] = useState<string | null>(null);
  
  const expenseCategories = categories.filter(c => c.name !== 'Ingresos');

  const form = useForm<z.infer<typeof billFormSchema>>({
    resolver: zodResolver(billFormSchema),
  });

  useEffect(() => {
    if (editingBill) {
      form.reset({ ...editingBill });
    } else {
      form.reset({
        name: "",
        amount: undefined,
        category: undefined,
        dueDay: undefined,
      });
    }
  }, [editingBill, form]);

  function onSubmit(values: z.infer<typeof billFormSchema>) {
    if (editingBill) {
      editBill(editingBill.id, values);
    } else {
      addBill(values);
    }
    setDialogOpen(false);
    setEditingBill(null);
  }

  const openEditDialog = (bill: Bill) => {
    setEditingBill(bill);
    setDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setBillToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (billToDelete) {
      deleteBill(billToDelete);
      setDeleteConfirmOpen(false);
      setBillToDelete(null);
    }
  };

  return (
    <AppShell>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div className="grid gap-1">
            <h1 className="text-2xl font-bold">Facturas Recurrentes</h1>
            <p className="text-muted-foreground">Gestiona tus pagos y facturas mensuales.</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditingBill(null); }}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Factura
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingBill ? "Editar Factura" : "Añadir Nueva Factura"}</DialogTitle>
                <DialogDescription>
                  {editingBill ? "Actualiza los detalles de tu factura recurrente." : "Añade una nueva factura para seguir tus pagos."}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 pt-4"
                >
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de la Factura</FormLabel>
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
                  <DialogFooter><Button type="submit">{editingBill ? "Guardar Cambios" : "Guardar Factura"}</Button></DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-4">
          {bills.map((bill) => {
            const categoryInfo = categories.find(c => c.name === bill.category);
            const Icon = categoryInfo?.icon;
            return (
              <Card key={bill.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    {Icon && <Icon className="h-8 w-8 text-muted-foreground" />}
                    <div>
                      <p className="font-semibold">{bill.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Vence el día {bill.dueDay} de cada mes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-lg font-bold">
                         {new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD" }).format(bill.amount)}
                      </p>
                       <p className="text-sm text-muted-foreground">{bill.category}</p>
                    </div>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menú</span>
                                <MoreVertical className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(bill)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDeleteDialog(bill.id)} className="text-destructive">
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
                      Esta acción no se puede deshacer. Esto eliminará permanentemente la factura recurrente.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setBillToDelete(null)}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

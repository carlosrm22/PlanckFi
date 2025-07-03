
'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreditCard, Landmark, Wallet, PlusCircle, MoreVertical, Pencil, Trash2 } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppData } from "@/context/app-data-context";
import type { Account } from "@/lib/types";

const accountFormSchema = z.object({
  name: z.string().min(1, { message: "El nombre de la cuenta es obligatorio." }),
  type: z.enum(["Checking", "Savings", "Credit Card"], {
    required_error: "Por favor, selecciona un tipo de cuenta.",
  }),
  provider: z.string().min(1, { message: "El proveedor es obligatorio." }),
  balance: z.coerce
    .number({ required_error: "El saldo es obligatorio." }),
  lastFour: z.string().length(4, { message: "Debe contener 4 dígitos." }).regex(/^\d{4}$/, { message: "Solo se permiten dígitos." }),
});

const accountIcons = {
  Checking: Wallet,
  Savings: Landmark,
  "Credit Card": CreditCard,
};

export default function AccountsPage() {
  const { accounts, addAccount, editAccount, deleteAccount } = useAppData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);

  const form = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
  });

  useEffect(() => {
    if (editingAccount) {
      form.reset({
        ...editingAccount,
      });
    } else {
      form.reset({
        name: "",
        type: undefined,
        provider: "",
        balance: undefined,
        lastFour: "",
      });
    }
  }, [editingAccount, form]);

  function onSubmit(values: z.infer<typeof accountFormSchema>) {
    if (editingAccount) {
      editAccount(editingAccount.id, values);
    } else {
      addAccount(values);
    }
    setDialogOpen(false);
    setEditingAccount(null);
  }

  const openEditDialog = (account: Account) => {
    setEditingAccount(account);
    setDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setAccountToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (accountToDelete) {
      deleteAccount(accountToDelete);
      setDeleteConfirmOpen(false);
      setAccountToDelete(null);
    }
  };

  return (
    <AppShell>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div className="grid gap-1">
            <h1 className="text-2xl font-bold">Cuentas</h1>
            <p className="text-muted-foreground">Gestiona tus cuentas conectadas.</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditingAccount(null); }}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Cuenta
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingAccount ? "Editar Cuenta" : "Añadir Nueva Cuenta"}</DialogTitle>
                <DialogDescription>
                  {editingAccount ? "Actualiza los detalles de tu cuenta." : "Añade una nueva cuenta para seguir tus finanzas."}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 pt-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de la Cuenta</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej. Cuenta de Ahorros" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Cuenta</FormLabel>
                         <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Checking">Cuenta Corriente</SelectItem>
                              <SelectItem value="Savings">Ahorros</SelectItem>
                              <SelectItem value="Credit Card">Tarjeta de Crédito</SelectItem>
                            </SelectContent>
                          </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="provider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proveedor / Banco</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej. Banco Ficticio" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="balance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Saldo Actual</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1000.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastFour"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Últimos 4 Dígitos</FormLabel>
                        <FormControl>
                          <Input placeholder="1234" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">{editingAccount ? "Guardar Cambios" : "Guardar Cuenta"}</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-4">
          {accounts.map((account) => {
            const Icon = accountIcons[account.type];
            return (
              <Card key={account.id}>
                <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-4">
                    <Icon className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{account.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {account.provider} •••• {account.lastFour}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-left sm:text-right">
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
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menú</span>
                                <MoreVertical className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(account)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDeleteDialog(account.id)} className="text-destructive">
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
                      Esta acción no se puede deshacer. Esto eliminará permanentemente la cuenta.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setAccountToDelete(null)}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>

    </AppShell>
  );
}

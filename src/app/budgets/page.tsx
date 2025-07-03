
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { AppShell } from "@/components/layout/app-shell";
import { BudgetGoals } from "@/components/dashboard/budget-goals";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, PlusCircle } from "lucide-react";
import { useAppData } from "@/context/app-data-context";
import { BudgetExplanation } from "@/components/budgets/budget-explanation";
import { AIBudgetAssistant } from "@/components/budgets/ai-budget-assistant";

const budgetFormSchema = z.object({
  category: z.string({ required_error: "Por favor, selecciona una categoría." }),
  amount: z.coerce
    .number({ required_error: "El monto es obligatorio." })
    .positive({ message: "El monto debe ser mayor que 0." }),
});

const categoryFormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
});


export default function BudgetsPage() {
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const { categories, addBudget, addCategory } = useAppData();
  
  const budgetCategories = categories.filter(
    (c) => c.name !== "Ingresos"
  );

  const budgetForm = useForm<z.infer<typeof budgetFormSchema>>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      amount: '' as any,
      category: undefined
    },
  });

  const categoryForm = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
    },
  });

  function onBudgetSubmit(values: z.infer<typeof budgetFormSchema>) {
    const categoryInfo = categories.find((c) => c.name === values.category);
    if (!categoryInfo) return;

    addBudget({
      category: values.category,
      icon: categoryInfo.icon,
      budgeted: values.amount,
    });

    setBudgetDialogOpen(false);
    budgetForm.reset();
  }

  function onCategorySubmit(values: z.infer<typeof categoryFormSchema>) {
    addCategory(values.name);
    budgetForm.setValue("category", values.name);
    setCategoryDialogOpen(false);
    categoryForm.reset();
  }


  return (
    <AppShell>
      <div className="grid gap-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="grid gap-1">
            <h1 className="text-2xl font-bold">Presupuestos</h1>
            <p className="text-muted-foreground">
              Gestiona tus metas de gasto mensuales.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <AIBudgetAssistant />
            <Dialog open={budgetDialogOpen} onOpenChange={setBudgetDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Crear Manualmente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Crear nuevo presupuesto</DialogTitle>
                  <DialogDescription>
                    Establece una nueva meta de gasto para una categoría.
                  </DialogDescription>
                </DialogHeader>
                <Form {...budgetForm}>
                  <form
                    onSubmit={budgetForm.handleSubmit(onBudgetSubmit)}
                    className="space-y-4 pt-4"
                  >
                      <FormField
                        control={budgetForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Categoría</FormLabel>
                            <div className="flex items-center gap-2">
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una categoría" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {budgetCategories.map((category) => (
                                    <SelectItem
                                      key={category.name}
                                      value={category.name}
                                    >
                                      <div className="flex items-center gap-2">
                                        <category.icon className="h-4 w-4" />
                                        {category.name}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="icon" className="shrink-0">
                                        <Plus className="h-4 w-4" />
                                        <span className="sr-only">Añadir nueva categoría</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Añadir Nueva Categoría</DialogTitle>
                                        <DialogDescription>Crea una nueva categoría para seguir tus gastos.</DialogDescription>
                                    </DialogHeader>
                                    <Form {...categoryForm}>
                                        <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="space-y-4 pt-4">
                                            <FormField
                                                control={categoryForm.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Nombre de la Categoría</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Ej. Viajes" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <DialogFooter>
                                                <Button type="submit">Guardar categoría</Button>
                                            </DialogFooter>
                                        </form>
                                    </Form>
                                </DialogContent>
                              </Dialog>

                            </div>
                            <FormMessage/>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={budgetForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monto</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="$500"
                                {...field}
                                value={field.value ?? ''}
                              />
                            </FormControl>
                            <FormMessage/>
                          </FormItem>
                        )}
                      />
                    <DialogFooter>
                      <Button type="submit">Guardar Presupuesto</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <BudgetExplanation />
        <BudgetGoals />
      </div>
    </AppShell>
  );
}

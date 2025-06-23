
"use client";

import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/lib/data";
import { PlusCircle } from "lucide-react";

export default function BudgetsPage() {
  const [open, setOpen] = useState(false);
  const budgetCategories = categories.filter(
    (c) => c.name !== "Ingresos" && c.name !== "Añadir Nuevo"
  );

  return (
    <AppShell>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div className="grid gap-1">
            <h1 className="text-2xl font-bold">Presupuestos</h1>
            <p className="text-muted-foreground">
              Gestiona tus metas de gasto mensuales.
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Crear Presupuesto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Crear nuevo presupuesto</DialogTitle>
                <DialogDescription>
                  Establece una nueva meta de gasto para una categoría.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Categoría
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetCategories.map((category) => (
                        <SelectItem key={category.name} value={category.name}>
                          <div className="flex items-center gap-2">
                            <category.icon className="h-4 w-4" />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Monto
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="$500"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={() => setOpen(false)}>
                  Guardar Presupuesto
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {/* En el futuro podemos iterar sobre datos de presupuestos reales aquí */}
        <BudgetGoals />
      </div>
    </AppShell>
  );
}

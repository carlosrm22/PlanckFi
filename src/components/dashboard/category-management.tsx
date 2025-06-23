"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { categories } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CategoryManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorías</CardTitle>
        <CardDescription>Gestiona tus categorías de gastos.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          category.name === "Añadir Nuevo" ? (
             <Dialog key={category.name}>
              <DialogTrigger asChild>
                <button className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg hover:bg-accent hover:border-solid transition-colors">
                  <category.icon className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">{category.name}</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Añadir Nueva Categoría</DialogTitle>
                  <DialogDescription>
                    Crea una nueva categoría para seguir tus gastos.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nombre
                    </Label>
                    <Input id="name" defaultValue="Nueva Categoría" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Guardar categoría</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <div key={category.name} className="flex flex-col items-center justify-center gap-2 p-4 border rounded-lg bg-card">
              <category.icon className={`h-6 w-6 ${category.color}`} />
              <span className="text-sm font-medium">{category.name}</span>
            </div>
          )
        ))}
      </CardContent>
    </Card>
  );
}

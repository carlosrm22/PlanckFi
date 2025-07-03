'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wand2, Loader2, Sparkles, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAppData } from '@/context/app-data-context';
import { getBudgetSuggestions, type BudgetSuggestionsOutput } from '@/ai/flows/budget-suggestions-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const aiBudgetFormSchema = z.object({
  monthlyIncome: z.coerce
    .number({ required_error: 'El ingreso mensual es obligatorio.' })
    .positive({ message: 'El ingreso debe ser mayor que 0.' }),
  financialGoals: z
    .string()
    .min(10, { message: 'Por favor, describe tus metas con más detalle.' })
    .max(500, { message: 'La descripción no puede superar los 500 caracteres.' }),
});

export function AIBudgetAssistant() {
  const { toast } = useToast();
  const { categories, addBudget, budgets } = useAppData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<BudgetSuggestionsOutput['suggestions'] | null>(null);

  const form = useForm<z.infer<typeof aiBudgetFormSchema>>({
    resolver: zodResolver(aiBudgetFormSchema),
  });

  async function onSubmit(values: z.infer<typeof aiBudgetFormSchema>) {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const existingCategories = categories
        .filter(c => c.name !== 'Ingresos')
        .map(c => c.name);

      const result = await getBudgetSuggestions({
        monthlyIncome: values.monthlyIncome,
        financialGoals: values.financialGoals,
        existingCategories,
      });
      setSuggestions(result.suggestions);
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Error de la IA',
        description: 'No se pudieron generar las sugerencias. Por favor, inténtalo de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddBudgets() {
    if (!suggestions) return;

    let addedCount = 0;
    suggestions.forEach(suggestion => {
        const categoryInfo = categories.find(c => c.name === suggestion.category);
        if (categoryInfo && !budgets.some(b => b.category === suggestion.category)) {
            addBudget({
                category: suggestion.category,
                icon: categoryInfo.icon,
                budgeted: suggestion.amount,
            });
            addedCount++;
        }
    });

    toast({
        title: '¡Presupuestos añadidos!',
        description: `Se han añadido ${addedCount} nuevos presupuestos. Los presupuestos para categorías existentes no se modificaron.`,
    });

    setSuggestions(null);
    form.reset();
    setDialogOpen(false);
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={open => { setDialogOpen(open); if(!open) { setSuggestions(null); form.reset(); }}}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto">
          <Wand2 className="mr-2 h-4 w-4" />
          Crear presupuesto con IA
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Asistente de Presupuesto con IA</DialogTitle>
          <DialogDescription>
            Deja que la IA te ayude a crear un presupuesto realista basado en tus ingresos y metas.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">La IA está analizando tu información...</p>
                <p className="text-sm text-center text-muted-foreground/80">Esto puede tardar unos segundos.</p>
            </div>
        ) : suggestions ? (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
                <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertTitle>¡Sugerencias listas!</AlertTitle>
                    <AlertDescription>
                        Aquí tienes un plan de presupuesto sugerido. Puedes añadir los que necesites.
                    </AlertDescription>
                </Alert>
                <div className="space-y-3">
                {suggestions.map((s, i) => (
                    <div key={i} className="p-3 border rounded-md">
                        <div className="flex justify-between items-center font-semibold">
                            <span>{s.category}</span>
                            <span>${s.amount.toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{s.justification}</p>
                    </div>
                ))}
                </div>
                 <DialogFooter>
                    <Button onClick={handleAddBudgets}>
                        <Plus className="mr-2 h-4 w-4" />
                        Añadir Presupuestos Sugeridos
                    </Button>
                </DialogFooter>
            </div>
        ) : (
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                control={form.control}
                name="monthlyIncome"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Ingreso Mensual Neto</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="Ej: 2500" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="financialGoals"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>¿Cuáles son tus metas financieras?</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Ej: Quiero ahorrar para el pago inicial de una casa en 3 años, pagar mi tarjeta de crédito y tener un fondo de emergencia." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <DialogFooter>
                    <Button type="submit">Generar Sugerencias</Button>
                </DialogFooter>
            </form>
            </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

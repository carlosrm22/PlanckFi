'use server';
/**
 * @fileOverview Provides AI-powered budget suggestions.
 *
 * - getBudgetSuggestions - A function that returns budget suggestions based on income and goals.
 * - BudgetSuggestionsInput - The input type for the getBudgetSuggestions function.
 * - BudgetSuggestionsOutput - The return type for the getBudgetSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BudgetSuggestionsInputSchema = z.object({
  monthlyIncome: z.number().describe('The user\'s total monthly income after taxes.'),
  financialGoals: z.string().describe('The user\'s financial goals, like saving for a car or paying off debt.'),
  existingCategories: z.array(z.string()).describe('A list of existing spending categories the user has.'),
});
export type BudgetSuggestionsInput = z.infer<typeof BudgetSuggestionsInputSchema>;

const BudgetSuggestionSchema = z.object({
    category: z.string().describe('The spending category for the budget suggestion.'),
    amount: z.number().describe('The suggested monthly budget amount for this category.'),
    justification: z.string().describe('A brief explanation for why this amount was suggested.'),
});

const BudgetSuggestionsOutputSchema = z.object({
  suggestions: z.array(BudgetSuggestionSchema).describe('A list of budget suggestions.'),
});
export type BudgetSuggestionsOutput = z.infer<typeof BudgetSuggestionsOutputSchema>;

export async function getBudgetSuggestions(
  input: BudgetSuggestionsInput
): Promise<BudgetSuggestionsOutput> {
  return budgetSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'budgetSuggestionsPrompt',
  input: {schema: BudgetSuggestionsInputSchema},
  output: {schema: BudgetSuggestionsOutputSchema},
  prompt: `Eres un asesor financiero experto. Tu tarea es crear un presupuesto mensual personalizado para un usuario basado en sus ingresos y metas financieras. Usa la regla 50/30/20 como guía (50% para Necesidades, 30% para Deseos, 20% para Ahorros/Deuda), pero sé flexible según las metas específicas del usuario.

Ingreso Mensual del Usuario (después de impuestos): \${{{monthlyIncome}}} MXN
Metas Financieras del Usuario: {{{financialGoals}}}

El usuario ya tiene las siguientes categorías de gastos, debes priorizarlas en tus sugerencias si son relevantes:
{{#each existingCategories}}
- {{{this}}}
{{/each}}

Por favor, proporciona una lista de sugerencias de presupuesto para varias categorías de gasto relevantes (como Comestibles, Transporte, Entretenimiento, etc.). Para cada sugerencia, proporciona la categoría, un monto mensual recomendado y una breve justificación para el monto. Asegúrate de que el total de todos los montos de presupuesto sugeridos no exceda el ingreso mensual del usuario.
`,
});

const budgetSuggestionsFlow = ai.defineFlow(
  {
    name: 'budgetSuggestionsFlow',
    inputSchema: BudgetSuggestionsInputSchema,
    outputSchema: BudgetSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

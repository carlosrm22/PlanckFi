'use server';

/**
 * @fileOverview Proporciona sugerencias de ahorro impulsadas por IA basadas en los hábitos de gasto del usuario.
 *
 * - getSavingsSuggestions - Una función que toma datos de gastos y devuelve sugerencias de ahorro.
 * - SavingsSuggestionsInput - El tipo de entrada para la función getSavingsSuggestions.
 * - SavingsSuggestionsOutput - El tipo de retorno para la función getSavingsSuggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SavingsSuggestionsInputSchema = z.object({
  spendingData: z
    .string()
    .describe(
      'Un desglose detallado de los hábitos de gasto del usuario, incluyendo categorías y montos.'
    ),
  financialGoals: z
    .string()
    .describe('Los objetivos financieros del usuario, como ahorrar para una casa o pagar deudas.'),
});
export type SavingsSuggestionsInput = z.infer<typeof SavingsSuggestionsInputSchema>;

const SavingsSuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('Sugerencias impulsadas por IA sobre cómo ahorrar dinero basadas en los hábitos de gasto.'),
});
export type SavingsSuggestionsOutput = z.infer<typeof SavingsSuggestionsOutputSchema>;

export async function getSavingsSuggestions(
  input: SavingsSuggestionsInput
): Promise<SavingsSuggestionsOutput> {
  return savingsSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'savingsSuggestionsPrompt',
  input: {schema: SavingsSuggestionsInputSchema},
  output: {schema: SavingsSuggestionsOutputSchema},
  prompt: `Eres un asesor financiero personal que proporciona sugerencias de ahorro a los usuarios.

  Basándote en los datos de gastos y los objetivos financieros del usuario, proporciona sugerencias de ahorro personalizadas y prácticas.

  Datos de Gastos: {{{spendingData}}}
  Objetivos Financieros: {{{financialGoals}}}

  Proporciona sugerencias sobre cómo el usuario puede reducir gastos y alcanzar sus objetivos financieros más rápido.
`,
});

const savingsSuggestionsFlow = ai.defineFlow(
  {
    name: 'savingsSuggestionsFlow',
    inputSchema: SavingsSuggestionsInputSchema,
    outputSchema: SavingsSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

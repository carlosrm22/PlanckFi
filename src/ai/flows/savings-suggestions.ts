'use server';

/**
 * @fileOverview Provides AI-powered savings suggestions based on user spending habits.
 *
 * - getSavingsSuggestions - A function that takes spending data and returns savings suggestions.
 * - SavingsSuggestionsInput - The input type for the getSavingsSuggestions function.
 * - SavingsSuggestionsOutput - The return type for the getSavingsSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SavingsSuggestionsInputSchema = z.object({
  spendingData: z
    .string()
    .describe(
      'A detailed breakdown of the user spending habits, including categories and amounts.'
    ),
  financialGoals: z
    .string()
    .describe('The financial goals of the user, such as saving for a house or paying off debt.'),
});
export type SavingsSuggestionsInput = z.infer<typeof SavingsSuggestionsInputSchema>;

const SavingsSuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('AI-powered suggestions on how to save money based on spending habits.'),
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
  prompt: `You are a personal finance advisor providing savings suggestions to users.

  Based on the user's spending data and financial goals, provide personalized and actionable savings suggestions.

  Spending Data: {{{spendingData}}}
  Financial Goals: {{{financialGoals}}}

  Provide suggestions on how the user can reduce expenses and achieve their financial goals faster.
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

'use server';
/**
 * @fileOverview Provides AI-powered budget suggestions.
 *
 * - getBudgetSuggestions - A function that returns budget suggestions based on income and goals.
 * - BudgetSuggestionsInput - The input type for the getBudgetSuggestions function.
 * - BudgetSuggestionsOutput - The return type for the getBudgetSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

export const BudgetSuggestionsInputSchema = z.object({
  monthlyIncome: z.number().describe('The user\'s total monthly income after taxes.'),
  financialGoals: z.string().describe('The user\'s financial goals, like saving for a car or paying off debt.'),
  existingCategories: z.array(z.string()).describe('A list of existing spending categories the user has.'),
});
export type BudgetSuggestionsInput = z.infer<typeof BudgetSuggestionsInputSchema>;

export const BudgetSuggestionSchema = z.object({
    category: z.string().describe('The spending category for the budget suggestion.'),
    amount: z.number().describe('The suggested monthly budget amount for this category.'),
    justification: z.string().describe('A brief explanation for why this amount was suggested.'),
});

export const BudgetSuggestionsOutputSchema = z.object({
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
  prompt: `You are an expert financial advisor. Your task is to create a personalized monthly budget for a user based on their income and financial goals. Use the 50/30/20 rule as a guideline (50% for Needs, 30% for Wants, 20% for Savings/Debt), but be flexible based on the user's specific goals.

User's Monthly Income (after tax): \${{{monthlyIncome}}}
User's Financial Goals: {{{financialGoals}}}

The user already has the following expense categories, you should prioritize these in your suggestions if they are relevant:
{{#each existingCategories}}
- {{{this}}}
{{/each}}

Please provide a list of budget suggestions for various relevant spending categories (like Groceries, Transport, Entertainment, etc.). For each suggestion, provide the category, a recommended monthly amount, and a brief justification for the amount. Ensure the total of all suggested budget amounts does not exceed the user's monthly income.
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

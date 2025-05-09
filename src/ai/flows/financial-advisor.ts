// src/ai/flows/financial-advisor.ts
'use server';
/**
 * @fileOverview An AI financial advisor that provides personalized tips and recommendations based on the user's current game state.
 *
 * - getFinancialAdvice - A function that retrieves financial advice for the user.
 * - FinancialAdviceInput - The input type for the getFinancialAdvice function.
 * - FinancialAdviceOutput - The return type for the getFinancialAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialAdviceInputSchema = z.object({
  income: z.number().describe('The user`s current income.'),
  expenses: z.number().describe('The user`s current expenses.'),
  investments: z.number().describe('The user`s current investments.'),
  debt: z.number().describe('The user`s current debt.'),
  netWorth: z.number().describe('The user`s current net worth.'),
});
export type FinancialAdviceInput = z.infer<typeof FinancialAdviceInputSchema>;

const FinancialAdviceOutputSchema = z.object({
  advice: z.string().describe('Personalized financial advice and recommendations.'),
});
export type FinancialAdviceOutput = z.infer<typeof FinancialAdviceOutputSchema>;

export async function getFinancialAdvice(input: FinancialAdviceInput): Promise<FinancialAdviceOutput> {
  return financialAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialAdvicePrompt',
  input: {schema: FinancialAdviceInputSchema},
  output: {schema: FinancialAdviceOutputSchema},
  prompt: `You are a financial advisor providing personalized tips and recommendations to the user based on their current financial situation in a financial simulation game.

Analyze the following information and provide actionable advice to help them improve their financial situation and increase their net worth. Be concise and encouraging.

Current Financial Situation:
- Income: {{income}}
- Expenses: {{expenses}}
- Investments: {{investments}}
- Debt: {{debt}}
- Net Worth: {{netWorth}}

Provide personalized advice:
`,
});

const financialAdviceFlow = ai.defineFlow(
  {
    name: 'financialAdviceFlow',
    inputSchema: FinancialAdviceInputSchema,
    outputSchema: FinancialAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

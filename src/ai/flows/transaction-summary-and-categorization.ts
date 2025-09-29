'use server';
/**
 * @fileOverview Summarizes recent transactions and categorizes them based on historical spending habits.
 *
 * - summarizeAndCategorizeTransactions - A function that summarizes recent transactions and provides categorized insights.
 * - TransactionSummaryInput - The input type for the summarizeAndCategorizeTransactions function.
 * - TransactionSummaryOutput - The return type for the summarizeAndCategorizeTransactions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TransactionSchema = z.object({
  date: z.string().describe('The date of the transaction.'),
  description: z.string().describe('A description of the transaction.'),
  amount: z.number().describe('The amount of the transaction.'),
});

const TransactionSummaryInputSchema = z.object({
  transactions: z.array(TransactionSchema).describe('An array of recent transactions.'),
  historicalSpendingData: z.string().describe('A summary of the user\'s historical spending data.'),
});
export type TransactionSummaryInput = z.infer<typeof TransactionSummaryInputSchema>;

const TransactionCategorySchema = z.object({
  category: z.string().describe('The category of the transaction.'),
  totalAmount: z.number().describe('The total amount spent in this category.'),
  percentageOfTotal: z.number().describe('The percentage of total spending this category represents.'),
  examples: z.array(z.string()).describe('Examples of transactions in this category.'),
});

const TransactionSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of recent transactions.'),
  categorizedInsights: z.array(TransactionCategorySchema).describe('Categorized insights based on historical spending data.'),
  suggestions: z.array(z.string()).describe('Suggestions for improvements based on the spending patterns.'),
});
export type TransactionSummaryOutput = z.infer<typeof TransactionSummaryOutputSchema>;

export async function summarizeAndCategorizeTransactions(input: TransactionSummaryInput): Promise<TransactionSummaryOutput> {
  return summarizeAndCategorizeTransactionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'transactionSummaryPrompt',
  input: {schema: TransactionSummaryInputSchema},
  output: {schema: TransactionSummaryOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the recent transactions provided and categorize them based on the user\'s historical spending data. Provide a summary of the transactions, categorized insights, and suggestions for improvement.

Recent Transactions:
{{#each transactions}}
- Date: {{date}}, Description: {{description}}, Amount: {{amount}}
{{/each}}

Historical Spending Data: {{{historicalSpendingData}}}

Output a summary of the transactions, categorized insights based on historical spending data, and suggestions for improvements.

Ensure the categorized insights includes the category, total amount spent in this category, the percentage of total spending this category represents, and examples of transactions in this category.
`,
});

const summarizeAndCategorizeTransactionsFlow = ai.defineFlow(
  {
    name: 'summarizeAndCategorizeTransactionsFlow',
    inputSchema: TransactionSummaryInputSchema,
    outputSchema: TransactionSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

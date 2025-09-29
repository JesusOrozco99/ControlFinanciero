"use server";

import { summarizeAndCategorizeTransactions } from "@/ai/flows/transaction-summary-and-categorization";
import { transactions } from "./data";
import type { Transaction } from "./types";

export async function runAnalysis() {
  try {
    // In a real app, you would fetch these from your database
    const recentTransactions: Transaction[] = transactions.map(t => ({...t, amount: Math.abs(t.amount)}));
    
    // Create a simple historical summary. In a real app, this would be more complex.
    const totalSpending = recentTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const historicalSpendingData = `User's total spending in the observed period is $${totalSpending.toFixed(2)}. Common spending categories include groceries, rent, and dining out.`;

    const result = await summarizeAndCategorizeTransactions({
      transactions: recentTransactions,
      historicalSpendingData,
    });
    
    return result;
  } catch (error) {
    console.error("Error running analysis:", error);
    // In a real app, you would handle this error more gracefully
    throw new Error("Failed to run analysis. Please try again later.");
  }
}

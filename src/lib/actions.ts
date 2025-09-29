"use server";

import { summarizeAndCategorizeTransactions } from "@/ai/flows/transaction-summary-and-categorization";
import { transactions } from "./data";
import type { Transaction } from "./types";

export async function runAnalysis() {
  try {
    // En una aplicación real, obtendrías esto de tu base de datos
    const recentTransactions: Transaction[] = transactions.map(t => ({...t, amount: Math.abs(t.amount)}));
    
    // Crea un resumen histórico simple. En una aplicación real, esto sería más complejo.
    const totalSpending = recentTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const historicalSpendingData = `El gasto total del usuario en el período observado es de $${totalSpending.toFixed(2)}. Las categorías de gasto comunes incluyen supermercado, alquiler y restaurantes.`;

    const result = await summarizeAndCategorizeTransactions({
      transactions: recentTransactions,
      historicalSpendingData,
    });
    
    return result;
  } catch (error) {
    console.error("Error al ejecutar el análisis:", error);
    // En una aplicación real, manejarías este error de forma más elegante
    throw new Error("No se pudo ejecutar el análisis. Por favor, inténtalo de nuevo más tarde.");
  }
}

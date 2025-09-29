'use client';

import { useState } from 'react';
import { transactions as initialTransactions } from '@/lib/data';
import type { Transaction } from '@/lib/types';
import { DataTable } from '@/components/transactions/data-table';
import { columns } from '@/components/transactions/columns';

export default function IncomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>(
    initialTransactions.filter((t) => t.type === 'income')
  );

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    setTransactions((prev) => [
      { ...transaction, id: Date.now().toString() },
      ...prev,
    ]);
  };

  const handleUpdateTransaction = (transaction: Transaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === transaction.id ? transaction : t))
    );
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Income</h1>
      <DataTable
        columns={columns({ onUpdate: handleUpdateTransaction, onDelete: handleDeleteTransaction, transactionType: 'income' })}
        data={transactions}
        transactionType="income"
        onAdd={handleAddTransaction}
      />
    </div>
  );
}

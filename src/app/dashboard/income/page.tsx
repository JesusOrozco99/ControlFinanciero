'use client';

import { useState, useEffect } from 'react';
import { transactions as initialTransactions } from '@/lib/data';
import type { Transaction } from '@/lib/types';
import { DataTable } from '@/components/transactions/data-table';
import { columns } from '@/components/transactions/columns';
import { getTransactions, addTransaction, updateTransaction, deleteTransaction } from '@/services/api-service';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function IncomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        const allTransactions = await getTransactions();
        setTransactions(allTransactions.filter((t) => t.type === 'income'));
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se pudieron cargar los ingresos.',
        });
        setTransactions(initialTransactions.filter((t) => t.type === 'income'));
      } finally {
        setLoading(false);
      }
    };
    loadTransactions();
  }, [toast]);

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction = await addTransaction(transaction);
      setTransactions((prev) => [newTransaction, ...prev]);
       toast({
        title: 'Éxito',
        description: 'Ingreso añadido correctamente.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo añadir el ingreso.',
      });
    }
  };

  const handleUpdateTransaction = async (transaction: Transaction) => {
     try {
      const updatedTransaction = await updateTransaction(transaction.id, transaction);
      setTransactions((prev) =>
        prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
      );
      toast({
        title: 'Éxito',
        description: 'Ingreso actualizado correctamente.',
      });
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo actualizar el ingreso.',
      });
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      toast({
        title: 'Éxito',
        description: 'Ingreso eliminado correctamente.',
      });
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar el ingreso.',
      });
    }
  };
  
  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold font-headline">Ingresos</h1>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Ingresos</h1>
      <DataTable
        columns={columns({ onUpdate: handleUpdateTransaction, onDelete: handleDeleteTransaction, transactionType: 'income' })}
        data={transactions}
        transactionType="income"
        onAdd={handleAddTransaction}
      />
    </div>
  );
}

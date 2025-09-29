'use client';

import { useEffect, useState } from 'react';
import type { Transaction } from '@/lib/types';
import SummaryCards from '@/components/dashboard/summary-cards';
import CategoryChart from '@/components/dashboard/category-chart';
import RecentTransactions from '@/components/dashboard/recent-transactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTransactions } from '@/services/api-service';
import { Skeleton } from '@/components/ui/skeleton';
import { transactions as fallbackTransactions } from '@/lib/data';

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        const apiTransactions = await getTransactions();
        setTransactions(apiTransactions);
      } catch (error) {
        console.error("Failed to fetch transactions, using fallback data.");
        setTransactions(fallbackTransactions);
      } finally {
        setLoading(false);
      }
    };
    loadTransactions();
  }, []);

  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const currentDate = new Date();
    return transactionDate.getMonth() === currentDate.getMonth() && transactionDate.getFullYear() === currentDate.getFullYear();
  });

  const totalIncome = monthlyTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = monthlyTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;
  
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold font-headline">Panel</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Skeleton className="h-[109px] w-full" />
          <Skeleton className="h-[109px] w-full" />
          <Skeleton className="h-[109px] w-full" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <Skeleton className="lg:col-span-3 h-[422px]" />
          <Skeleton className="lg:col-span-2 h-[422px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Panel</h1>
      
      <SummaryCards
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Categorías de Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryChart transactions={monthlyTransactions.filter(t => t.type === 'expense')} />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Transacciones Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTransactions transactions={recentTransactions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

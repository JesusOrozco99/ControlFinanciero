'use client';

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';
import type { Transaction } from '@/lib/types';
import { categories } from '@/lib/data';

type CategoryChartProps = {
  transactions: Transaction[];
};

const COLORS = ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c', '#9b59b6', '#34495e', '#1abc9c'];

export default function CategoryChart({ transactions }: CategoryChartProps) {
  const data = categories
    .filter((c) => c.type === 'expense')
    .map((category) => {
      const total = transactions
        .filter((t) => t.category === category.value)
        .reduce((sum, t) => sum + t.amount, 0);
      return { name: category.label, value: total };
    })
    .filter((d) => d.value > 0);

    if (data.length === 0) {
        return (
            <div className="flex h-[350px] w-full items-center justify-center text-muted-foreground">
                No expense data for this month.
            </div>
        )
    }

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) =>
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(value)
            }
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

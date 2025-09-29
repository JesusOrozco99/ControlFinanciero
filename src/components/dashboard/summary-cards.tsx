import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft, Scale } from 'lucide-react';

type SummaryCardsProps = {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function SummaryCards({
  totalIncome,
  totalExpenses,
  balance,
}: SummaryCardsProps) {
  const summaryData = [
    {
      title: "Ingresos de este Mes",
      amount: totalIncome,
      icon: ArrowUpRight,
      color: 'text-green-500',
    },
    {
      title: "Egresos de este Mes",
      amount: totalExpenses,
      icon: ArrowDownLeft,
      color: 'text-red-500',
    },
    {
      title: 'Saldo Actual',
      amount: balance,
      icon: Scale,
      color: balance >= 0 ? 'text-blue-500' : 'text-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {summaryData.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className={`h-4 w-4 text-muted-foreground ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${item.color}`}>
              {currencyFormatter.format(item.amount)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

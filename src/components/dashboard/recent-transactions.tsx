import type { Transaction } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type RecentTransactionsProps = {
  transactions: Transaction[];
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function RecentTransactions({
  transactions,
}: RecentTransactionsProps) {
  return (
    <div className="space-y-4">
      {transactions.length > 0 ? (
        transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                {transaction.description}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(transaction.date), 'MMM dd, yyyy')}
              </p>
            </div>
            <div
              className={cn(
                'font-medium',
                transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
              )}
            >
              {transaction.type === 'income' ? '+' : '-'}
              {currencyFormatter.format(transaction.amount)}
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No recent transactions.</p>
      )}
    </div>
  );
}

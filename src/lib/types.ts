export type TransactionType = 'income' | 'expense';

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
};

export type Category = {
  value: string;
  label: string;
  type: TransactionType;
};

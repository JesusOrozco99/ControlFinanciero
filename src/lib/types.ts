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

// Se añade el tipo para el payload de creación de usuario
export type UserPayload = {
  user: {
    email: string;
    password?: string;
    password_confirmation?: string;
    first_name: string;
    last_name: string;
  }
};

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

// Tipo para el payload de creación de usuario en la API
export type UserPayload = {
  user: {
    email: string;
    password?: string;
    password_confirmation?: string;
    first_name: string;
    last_name: string;
  }
};

// Tipo para el objeto de usuario que viene de la API
export type ApiUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  photoURL?: string; // Opcional, si tu API lo proporciona
};

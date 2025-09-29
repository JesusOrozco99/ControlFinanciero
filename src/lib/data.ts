import type { Category, Transaction } from './types';

export const categories: Category[] = [
  { value: 'salary', label: 'Salario', type: 'income' },
  { value: 'freelance', label: 'Freelance', type: 'income' },
  { value: 'investment', label: 'Inversión', type: 'income' },
  { value: 'other-income', label: 'Otros', type: 'income' },
  { value: 'groceries', label: 'Supermercado', type: 'expense' },
  { value: 'rent', label: 'Alquiler', type: 'expense' },
  { value: 'utilities', label: 'Servicios', type: 'expense' },
  { value: 'transportation', label: 'Transporte', type: 'expense' },
  { value: 'dining-out', label: 'Restaurantes', type: 'expense' },
  { value: 'entertainment', label: 'Entretenimiento', type: 'expense' },
  { value: 'shopping', label: 'Compras', type: 'expense' },
  { value: 'health', label: 'Salud', type: 'expense' },
  { value: 'other-expense', label: 'Otros', type: 'expense' },
];

// Estos datos de transacciones ahora son un respaldo en caso de que la API no responda.
// La aplicación intentará obtener los datos de tu API primero.
export const transactions: Transaction[] = [
  { id: '1', date: new Date(new Date().setDate(1)).toISOString().split('T')[0], description: 'Salario Mensual', amount: 5000, type: 'income', category: 'salary' },
  { id: '2', date: new Date(new Date().setDate(2)).toISOString().split('T')[0], description: 'Compras en el supermercado', amount: 75.50, type: 'expense', category: 'groceries' },
  { id: '3', date: new Date(new Date().setDate(1)).toISOString().split('T')[0], description: 'Alquiler de apartamento', amount: 1500, type: 'expense', category: 'rent' },
  { id: '4', date: new Date(new Date().setDate(5)).toISOString().split('T')[0], description: 'Factura de electricidad', amount: 65.00, type: 'expense', category: 'utilities' },
  { id: '5', date: new Date(new Date().setDate(7)).toISOString().split('T')[0], description: 'Proyecto Freelance A', amount: 750, type: 'income', category: 'freelance' },
  { id: '6', date: new Date(new Date().setDate(8)).toISOString().split('T')[0], description: 'Cena con amigos', amount: 120.00, type: 'expense', category: 'dining-out' },
  { id: '7', date: new Date(new Date().setDate(10)).toISOString().split('T')[0], description: 'Pase de autobús mensual', amount: 55.00, type: 'expense', category: 'transportation' },
  { id: '8', date: new Date(new Date().setDate(12)).toISOString().split('T')[0], description: 'Entradas de cine', amount: 30.00, type: 'expense', category: 'entertainment' },
  { id: '9', date: new Date(new Date().setDate(14)).toISOString().split('T')[0], description: 'Zapatos nuevos', amount: 95.00, type: 'expense', category: 'shopping' },
  { id: '10', date: new Date(new Date().setDate(15)).toISOString().split('T')[0], description: 'Dividendos de acciones', amount: 125.00, type: 'income', category: 'investment' },
  { id: '11', date: new Date(new Date().setDate(16)).toISOString().split('T')[0], description: 'Farmacia', amount: 25.50, type: 'expense', category: 'health' },
  { id: '12', date: new Date(new Date().setDate(18)).toISOString().split('T')[0], description: 'Más compras de supermercado', amount: 60.25, type: 'expense', category: 'groceries' },
];

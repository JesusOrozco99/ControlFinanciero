import type { Category, Transaction } from './types';

export const categories: Category[] = [
  { value: 'salary', label: 'Salary', type: 'income' },
  { value: 'freelance', label: 'Freelance', type: 'income' },
  { value: 'investment', label: 'Investment', type: 'income' },
  { value: 'other-income', label: 'Other', type: 'income' },
  { value: 'groceries', label: 'Groceries', type: 'expense' },
  { value: 'rent', label: 'Rent', type: 'expense' },
  { value: 'utilities', label: 'Utilities', type: 'expense' },
  { value: 'transportation', label: 'Transportation', type: 'expense' },
  { value: 'dining-out', label: 'Dining Out', type: 'expense' },
  { value: 'entertainment', label: 'Entertainment', type: 'expense' },
  { value: 'shopping', label: 'Shopping', type: 'expense' },
  { value: 'health', label: 'Health', type: 'expense' },
  { value: 'other-expense', label: 'Other', type: 'expense' },
];

export const transactions: Transaction[] = [
  { id: '1', date: new Date(new Date().setDate(1)).toISOString().split('T')[0], description: 'Monthly Salary', amount: 5000, type: 'income', category: 'salary' },
  { id: '2', date: new Date(new Date().setDate(2)).toISOString().split('T')[0], description: 'Grocery shopping at Market', amount: 75.50, type: 'expense', category: 'groceries' },
  { id: '3', date: new Date(new Date().setDate(1)).toISOString().split('T')[0], description: 'Apartment Rent', amount: 1500, type: 'expense', category: 'rent' },
  { id: '4', date: new Date(new Date().setDate(5)).toISOString().split('T')[0], description: 'Electricity Bill', amount: 65.00, type: 'expense', category: 'utilities' },
  { id: '5', date: new Date(new Date().setDate(7)).toISOString().split('T')[0], description: 'Freelance Project A', amount: 750, type: 'income', category: 'freelance' },
  { id: '6', date: new Date(new Date().setDate(8)).toISOString().split('T')[0], description: 'Dinner with friends', amount: 120.00, type: 'expense', category: 'dining-out' },
  { id: '7', date: new Date(new Date().setDate(10)).toISOString().split('T')[0], description: 'Monthly bus pass', amount: 55.00, type: 'expense', category: 'transportation' },
  { id: '8', date: new Date(new Date().setDate(12)).toISOString().split('T')[0], description: 'Movie tickets', amount: 30.00, type: 'expense', category: 'entertainment' },
  { id: '9', date: new Date(new Date().setDate(14)).toISOString().split('T')[0], description: 'New shoes', amount: 95.00, type: 'expense', category: 'shopping' },
  { id: '10', date: new Date(new Date().setDate(15)).toISOString().split('T')[0], description: 'Stock dividends', amount: 125.00, type: 'income', category: 'investment' },
  { id: '11', date: new Date(new Date().setDate(16)).toISOString().split('T')[0], description: 'Pharmacy', amount: 25.50, type: 'expense', category: 'health' },
  { id: '12', date: new Date(new Date().setDate(18)).toISOString().split('T')[0], description: 'More groceries', amount: 60.25, type: 'expense', category: 'groceries' },
];

'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Transaction, TransactionType } from '@/lib/types';
import { categories } from '@/lib/data';
import { format } from 'date-fns';
import { useState } from 'react';
import { TransactionForm } from './transaction-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

type ColumnsProps = {
  onUpdate: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  transactionType: TransactionType;
};

export const columns = ({ onUpdate, onDelete, transactionType }: ColumnsProps): ColumnDef<Transaction>[] => [
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <div className="font-medium">{row.getValue('description')}</div>
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      return <div className="text-right">{currencyFormatter.format(amount)}</div>;
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const categoryValue = row.getValue('category') as string;
      const category = categories.find((c) => c.value === categoryValue);
      return <Badge variant="outline">{category?.label || categoryValue}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      // Add timezone offset to prevent date from changing
      const adjustedDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);
      return <div>{format(adjustedDate, 'MMM dd, yyyy')}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const transaction = row.original;
      const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

      return (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(transaction.id)}
              >
                Copy transaction ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onClick={() => onDelete(transaction.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Transaction</DialogTitle>
            </DialogHeader>
            <TransactionForm
              type={transactionType}
              onSubmit={(values) => {
                onUpdate({ ...transaction, ...values });
                setIsEditDialogOpen(false);
              }}
              initialData={transaction}
            />
          </DialogContent>
        </Dialog>
      );
    },
  },
];

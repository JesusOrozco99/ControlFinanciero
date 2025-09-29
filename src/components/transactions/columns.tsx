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
    header: 'Descripción',
    cell: ({ row }) => <div className="font-medium">{row.getValue('description')}</div>
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Monto</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      return <div className="text-right">{currencyFormatter.format(amount)}</div>;
    },
  },
  {
    accessorKey: 'category',
    header: 'Categoría',
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
    header: 'Fecha',
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
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(transaction.id)}
              >
                Copiar ID de transacción
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onClick={() => onDelete(transaction.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
                <DialogTitle>Editar Transacción</DialogTitle>
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

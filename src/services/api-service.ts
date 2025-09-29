import type { Transaction } from '@/lib/types';
import { transactions as fallbackTransactions } from '@/lib/data';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchFromApi(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!API_URL) {
        console.warn("La variable de entorno NEXT_PUBLIC_API_URL no está configurada. Usando datos de respaldo.");
        return Promise.resolve(fallbackTransactions);
    }
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            console.error(`Error de API: ${response.statusText}`);
            throw new Error('La respuesta de la red no fue correcta');
        }
        return await response.json();
    } catch (error) {
        console.error('Hubo un problema con la operación de fetch:', error);
        throw error;
    }
}


export async function getTransactions(): Promise<Transaction[]> {
    try {
        const data = await fetchFromApi('/transactions');
        return data as Transaction[];
    } catch (error) {
        console.log('Error al obtener transacciones de la API, usando datos de respaldo.');
        return fallbackTransactions;
    }
}

export async function addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    return await fetchFromApi('/transactions', {
        method: 'POST',
        body: JSON.stringify(transaction),
    });
}

export async function updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
    return await fetchFromApi(`/transactions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(transaction),
    });
}

export async function deleteTransaction(id: string): Promise<void> {
    await fetchFromApi(`/transactions/${id}`, {
        method: 'DELETE',
    });
}

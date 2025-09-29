import type { Transaction, UserPayload } from '@/lib/types';
import { transactions as fallbackTransactions } from '@/lib/data';
import { apiConfig } from '@/lib/api-config';

async function fetchFromApi(endpoint: string, options: RequestInit = {}): Promise<any> {
    const { baseUrl } = apiConfig;
    
    if (!baseUrl) {
        console.warn("La URL de la API no está configurada. Usando datos de respaldo donde sea posible.");
        // Devuelve una promesa rechazada para que los llamadores puedan manejar el error.
        return Promise.reject(new Error("API URL no está configurada"));
    }
    
    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Error de API (${response.status}) en ${endpoint}: ${errorBody}`);
            throw new Error(`La respuesta de la red no fue correcta: ${response.statusText}`);
        }
        
        // Si la respuesta no tiene cuerpo (ej. DELETE), devuelve un objeto vacío.
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return await response.json();
        }
        return {};

    } catch (error) {
        console.error('Hubo un problema con la operación de fetch:', error);
        throw error;
    }
}


export async function getTransactions(): Promise<Transaction[]> {
    try {
        const data = await fetchFromApi(apiConfig.endpoints.transactions.getAll);
        return data as Transaction[];
    } catch (error) {
        console.log('Error al obtener transacciones de la API, usando datos de respaldo.');
        return fallbackTransactions;
    }
}

export async function addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
     try {
        return await fetchFromApi(apiConfig.endpoints.transactions.create, {
            method: 'POST',
            body: JSON.stringify(transaction),
        });
    } catch (error) {
        console.error("No se pudo añadir la transacción a través de la API.");
        throw error;
    }
}

export async function updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
     try {
        return await fetchFromApi(apiConfig.endpoints.transactions.update(id), {
            method: 'PUT',
            body: JSON.stringify(transaction),
        });
    } catch (error) {
        console.error("No se pudo actualizar la transacción a través de la API.");
        throw error;
    }
}

export async function deleteTransaction(id: string): Promise<void> {
    try {
        await fetchFromApi(apiConfig.endpoints.transactions.delete(id), {
            method: 'DELETE',
        });
    } catch (error) {
        console.error("No se pudo eliminar la transacción a través de la API.");
        throw error;
    }
}

export async function createUser(payload: UserPayload): Promise<any> {
    try {
        return await fetchFromApi(apiConfig.endpoints.users.create, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    } catch (error) {
        console.error("No se pudo crear el usuario a través de la API.");
        // En un caso real, podrías querer eliminar el usuario de Firebase Auth si este paso falla.
        throw error;
    }
}

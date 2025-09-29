import type { Transaction, UserPayload } from '@/lib/types';
import { transactions as fallbackTransactions } from '@/lib/data';
import { apiConfig } from '@/lib/api-config';
import axios, { type AxiosRequestConfig } from 'axios';
import { auth } from '@/lib/firebase';

const axiosInstance = axios.create({
    baseURL: apiConfig.baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para añadir el token de autenticación a cada petición
axiosInstance.interceptors.request.use(
    async (config) => {
        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


async function apiRequest(config: AxiosRequestConfig): Promise<any> {
    if (!apiConfig.baseUrl) {
        console.warn("La URL de la API no está configurada. Usando datos de respaldo donde sea posible.");
        return Promise.reject(new Error("API URL no está configurada"));
    }

    try {
        const response = await axiosInstance(config);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Error de API (${error.response?.status}) en ${config.url}:`, error.response?.data);
             // Si el error es 401 o 403, podría ser útil manejarlo de forma especial
            if (error.response?.status === 401 || error.response?.status === 403) {
                 console.error("Error de autenticación o autorización. El token puede ser inválido o haber expirado.");
                 // Podrías añadir lógica aquí para refrescar el token o redirigir al login
            }
        } else {
            console.error('Hubo un problema con la petición de axios:', error);
        }
        throw error;
    }
}


export async function getTransactions(): Promise<Transaction[]> {
    try {
        const data = await apiRequest({
            method: 'GET',
            url: apiConfig.endpoints.transactions.getAll,
        });
        return data as Transaction[];
    } catch (error) {
        console.log('Error al obtener transacciones de la API, usando datos de respaldo.');
        return fallbackTransactions;
    }
}

export async function addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
     try {
        return await apiRequest({
            method: 'POST',
            url: apiConfig.endpoints.transactions.create,
            data: { transaction },
        });
    } catch (error) {
        console.error("No se pudo añadir la transacción a través de la API.");
        throw error;
    }
}

export async function updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
     try {
        return await apiRequest({
            method: 'PUT',
            url: apiConfig.endpoints.transactions.update(id),
            data: { transaction },
        });
    } catch (error) {
        console.error("No se pudo actualizar la transacción a través de la API.");
        throw error;
    }
}

export async function deleteTransaction(id: string): Promise<void> {
    try {
        await apiRequest({
            method: 'DELETE',
            url: apiConfig.endpoints.transactions.delete(id),
        });
    } catch (error) {
        console.error("No se pudo eliminar la transacción a través de la API.");
        throw error;
    }
}

export async function createUser(payload: UserPayload): Promise<any> {
    try {
        return await apiRequest({
            method: 'POST',
            url: apiConfig.endpoints.users.create,
            data: payload,
        });
    } catch (error) {
        console.error("No se pudo crear el usuario a través de la API.");
        throw error;
    }
}

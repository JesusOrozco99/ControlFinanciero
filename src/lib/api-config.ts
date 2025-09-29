/**
 * @fileOverview Archivo de configuración central para los endpoints del API.
 */

// Lee la URL base de la API desde las variables de entorno.
// Si no está definida, usa una URL local por defecto para desarrollo.
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000/api/v1';

export const apiConfig = {
  baseUrl,
  endpoints: {
    transactions: {
      getAll: '/transactions',
      getOne: (id: string) => `/transactions/${id}`,
      create: '/transactions',
      update: (id: string) => `/transactions/${id}`,
      delete: (id: string) => `/transactions/${id}`,
    },
    users: {
      create: '/auth/register', // Endpoint para el registro de nuevos usuarios
    },
    // Puedes añadir más endpoints aquí a medida que tu aplicación crezca
    dashboard: {
      getdashboard: '/dashboard',
    }
  },
};

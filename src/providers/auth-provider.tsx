'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { ApiUser } from '@/lib/types';
import { getUserProfile } from '@/services/api-service';


type AuthContextType = {
  user: ApiUser | null;
  token: string | null;
  loading: boolean;
  login: (user: ApiUser, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        try {
          // Asumimos que tienes un endpoint para obtener el perfil del usuario
          const userProfile = await getUserProfile(); 
          setUser(userProfile);
        } catch (error) {
          console.error('La sesión expiró o es inválida.');
          logout(); // Limpia si el token es inválido
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, [logout]);
  
  const login = (newUser: ApiUser, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
  };

  if (loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Типы для контекста
interface SupabaseContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

// Создаем контекст
const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

// Провайдер контекста
interface SupabaseProviderProps {
  children: ReactNode;
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Получаем текущую сессию
    const getSession = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Ошибка при получении сессии:', error);
      } else {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      }
      
      setIsLoading(false);
    };

    // Вызываем функцию получения сессии
    getSession();

    // Подписываемся на изменения аутентификации
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsLoading(false);
      }
    );

    // Отписываемся при размонтировании компонента
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Функция для выхода из аккаунта
  const signOut = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Ошибка при выходе из аккаунта:', error);
    }
    setIsLoading(false);
  };

  const value = {
    user,
    session,
    isLoading,
    signOut,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

// Хук для использования контекста
export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}

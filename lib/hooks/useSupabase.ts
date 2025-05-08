import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

// Хук для работы с аутентификацией Supabase
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Получаем текущую сессию
    const getSession = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Ошибка при получении сессии:', error);
      } else {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      }
      
      setLoading(false);
    };

    // Вызываем функцию получения сессии
    getSession();

    // Подписываемся на изменения аутентификации
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    );

    // Отписываемся при размонтировании компонента
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Функция для выхода из аккаунта
  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Ошибка при выходе из аккаунта:', error);
    }
    setLoading(false);
  };

  return { user, session, loading, signOut };
}

// Хук для работы с книгами
export function useBooks() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Загрузка всех книг
  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setBooks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  // Загрузка книг пользователя
  const fetchUserBooks = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('user_books')
        .select(`
          *,
          books:book_id(*)
        `)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      setBooks(data?.map(item => item.books) || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  // Получение книги по ID
  const getBookById = async (bookId: number) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { books, loading, error, fetchBooks, fetchUserBooks, getBookById };
}

// Хук для работы с тегами
export function useTags() {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Загрузка всех тегов
  const fetchTags = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setTags(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  // Получение тегов для книги
  const fetchBookTags = async (bookId: number) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('book_tags')
        .select(`
          *,
          tags:tag_id(*)
        `)
        .eq('book_id', bookId);

      if (error) {
        throw error;
      }

      setTags(data?.map(item => item.tags) || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  return { tags, loading, error, fetchTags, fetchBookTags };
}

// Хук для работы со списками книг
export function useLists() {
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Загрузка всех публичных списков
  const fetchPublicLists = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('lists')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setLists(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  // Загрузка списков пользователя
  const fetchUserLists = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('lists')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setLists(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  return { lists, loading, error, fetchPublicLists, fetchUserLists };
}

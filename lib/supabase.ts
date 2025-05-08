import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Получаем URL и ключ из переменных окружения
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Создаем типизированный клиент Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Экспортируем типы для удобства использования
export type Tables = Database['public']['Tables'];

// Типы для основных таблиц
export type Book = Tables['books']['Row'];
export type InsertBook = Tables['books']['Insert'];
export type UpdateBook = Tables['books']['Update'];

export type UserBook = Tables['user_books']['Row'];
export type InsertUserBook = Tables['user_books']['Insert'];
export type UpdateUserBook = Tables['user_books']['Update'];

export type Tag = Tables['tags']['Row'];
export type InsertTag = Tables['tags']['Insert'];
export type UpdateTag = Tables['tags']['Update'];

export type BookTag = Tables['book_tags']['Row'];
export type InsertBookTag = Tables['book_tags']['Insert'];
export type UpdateBookTag = Tables['book_tags']['Update'];

export type List = Tables['lists']['Row'];
export type InsertList = Tables['lists']['Insert'];
export type UpdateList = Tables['lists']['Update'];

export type ListBook = Tables['list_books']['Row'];
export type InsertListBook = Tables['list_books']['Insert'];
export type UpdateListBook = Tables['list_books']['Update'];

export type Comment = Tables['comments']['Row'];
export type InsertComment = Tables['comments']['Insert'];
export type UpdateComment = Tables['comments']['Update'];

export type Achievement = Tables['achievements']['Row'];
export type InsertAchievement = Tables['achievements']['Insert'];
export type UpdateAchievement = Tables['achievements']['Update'];

export type UserAchievement = Tables['user_achievements']['Row'];
export type InsertUserAchievement = Tables['user_achievements']['Insert'];
export type UpdateUserAchievement = Tables['user_achievements']['Update'];

// Типы статусов книг
export type BookStatus = 'read' | 'reading' | 'want_to_read';

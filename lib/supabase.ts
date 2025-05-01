import { createClient } from '@supabase/supabase-js';

// Эти значения будут заменены на реальные после создания проекта в Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Типы для базы данных
export type User = {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
};

export type Book = {
  id: string;
  user_id: string;
  title: string;
  author: string;
  description?: string;
  cover_image_url?: string;
  file_url?: string;
  download_count: number;
  view_count: number;
  like_count: number;
  status: 'read' | 'reading' | 'want_to_read';
  rating?: number;
  created_at: string;
  updated_at: string;
};

export type BookSeries = {
  id: string;
  book_id: string;
  order_number: number;
  title: string;
  year?: number;
  created_at: string;
};

export type Comment = {
  id: string;
  book_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type Tag = {
  id: string;
  name: string;
  created_at: string;
};

export type BookTag = {
  id: string;
  book_id: string;
  tag_id: string;
};

export type Like = {
  id: string;
  book_id: string;
  user_id: string;
  created_at: string;
};

export type BookList = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type BookListItem = {
  id: string;
  list_id: string;
  book_id: string;
  created_at: string;
};

import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import BookCard from '@/components/books/BookCard';
import { supabase } from '@/lib/supabase';

// Типы для книг из Supabase
interface Book {
  id: string;
  title: string;
  author: string;
  cover_image_url?: string;
  rating?: number;
  status: 'read' | 'reading' | 'want_to_read';
  tags?: string[];
}

export default function SupabaseBooks() {
  // Состояние для хранения книг
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Состояние для фильтров
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

  // Загрузка книг из Supabase
  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true);
        
        // Получаем книги из Supabase
        const { data: booksData, error: booksError } = await supabase
          .from('books')
          .select('*');
        
        if (booksError) {
          throw booksError;
        }
        
        // Получаем теги для каждой книги
        const booksWithTags = await Promise.all(
          (booksData || []).map(async (book) => {
            // Получаем связи книги с тегами
            const { data: bookTagsData, error: bookTagsError } = await supabase
              .from('book_tags')
              .select('tag_id')
              .eq('book_id', book.id);
            
            if (bookTagsError) {
              console.error('Ошибка при получении тегов книги:', bookTagsError);
              return { ...book, tags: [] };
            }
            
            // Получаем информацию о тегах
            const tagIds = bookTagsData?.map(bt => bt.tag_id) || [];
            
            if (tagIds.length === 0) {
              return { ...book, tags: [] };
            }
            
            const { data: tagsData, error: tagsError } = await supabase
              .from('tags')
              .select('name')
              .in('id', tagIds);
            
            if (tagsError) {
              console.error('Ошибка при получении информации о тегах:', tagsError);
              return { ...book, tags: [] };
            }
            
            const tags = tagsData?.map(tag => tag.name) || [];
            
            return { ...book, tags };
          })
        );
        
        setBooks(booksWithTags);
        
        // Собираем все уникальные теги
        const allTagsSet = new Set<string>();
        booksWithTags.forEach(book => {
          (book.tags || []).forEach(tag => allTagsSet.add(tag));
        });
        
        setAllTags(Array.from(allTagsSet));
        
      } catch (err) {
        console.error('Ошибка при загрузке книг:', err);
        setError('Не удалось загрузить книги. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchBooks();
  }, []);

  // Фильтрация книг
  const filteredBooks = books.filter(book => {
    // Фильтр по поисковому запросу
    const matchesSearch = searchQuery === '' ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    // Фильтр по статусу
    const matchesStatus = selectedStatus === null || book.status === selectedStatus;

    // Фильтр по тегу
    const matchesTag = selectedTag === null || (book.tags && book.tags.includes(selectedTag));

    return matchesSearch && matchesStatus && matchesTag;
  });

  // Функция для отображения статуса на русском
  const getStatusText = (status: string) => {
    switch (status) {
      case 'read': return 'Прочитано';
      case 'reading': return 'Читаю';
      case 'want_to_read': return 'Хочу прочитать';
      default: return status;
    }
  };

  return (
    <>
      <Head>
        <title>Книги из Supabase | Трекер прочитанных книг</title>
        <meta name="description" content="Книги из базы данных Supabase" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Книги из Supabase</h1>
            <Button asChild>
              <Link href="/books/add">Добавить книгу</Link>
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p>Загрузка книг...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <>
              {/* Фильтры */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div>
                  <Input
                    placeholder="Поиск по названию или автору"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div>
                  <select
                    className="w-full p-2 border border-input rounded-md bg-background"
                    value={selectedStatus || ''}
                    onChange={(e) => setSelectedStatus(e.target.value || null)}
                  >
                    <option value="">Все статусы</option>
                    <option value="read">Прочитано</option>
                    <option value="reading">Читаю</option>
                    <option value="want_to_read">Хочу прочитать</option>
                  </select>
                </div>
                <div>
                  <select
                    className="w-full p-2 border border-input rounded-md bg-background"
                    value={selectedTag || ''}
                    onChange={(e) => setSelectedTag(e.target.value || null)}
                  >
                    <option value="">Все теги</option>
                    {allTags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Список книг */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    id={book.id}
                    title={book.title}
                    author={book.author}
                    cover={book.cover_image_url}
                    rating={book.rating}
                    status={book.status}
                    tags={book.tags}
                  />
                ))}
              </div>

              {filteredBooks.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Книги не найдены</p>
                </div>
              )}
            </>
          )}
        </div>
      </Layout>
    </>
  );
}

import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useState } from 'react';
import BookCard from '@/components/books/BookCard';

// Типы для книг
interface Book {
  id: number;
  title: string;
  author: string;
  cover?: string;
  rating?: number;
  status: 'read' | 'reading' | 'want_to_read';
  tags: string[];
}

export default function Books() {
  // Демо-данные для книг (в реальном приложении будут загружаться с сервера)
  const allBooks: Book[] = [
    {
      id: 1,
      title: 'Война и мир',
      author: 'Лев Толстой',
      cover: '/placeholder-cover.jpg',
      rating: 9.2,
      status: 'read',
      tags: ['Классика', 'Роман', 'Историческая литература']
    },
    {
      id: 2,
      title: 'Преступление и наказание',
      author: 'Федор Достоевский',
      cover: '/placeholder-cover.jpg',
      rating: 8.9,
      status: 'read',
      tags: ['Классика', 'Роман', 'Психологическая литература']
    },
    {
      id: 3,
      title: 'Мастер и Маргарита',
      author: 'Михаил Булгаков',
      cover: '/placeholder-cover.jpg',
      rating: 9.5,
      status: 'reading',
      tags: ['Классика', 'Фантастика', 'Сатира']
    },
    {
      id: 4,
      title: '1984',
      author: 'Джордж Оруэлл',
      cover: '/placeholder-cover.jpg',
      rating: 9.0,
      status: 'want_to_read',
      tags: ['Антиутопия', 'Фантастика', 'Политика']
    },
    {
      id: 5,
      title: 'Гарри Поттер и философский камень',
      author: 'Дж. К. Роулинг',
      cover: '/placeholder-cover.jpg',
      rating: 8.7,
      status: 'read',
      tags: ['Фэнтези', 'Приключения', 'Для подростков']
    },
  ];

  // Состояние для фильтров
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Получение всех уникальных тегов
  const allTags = Array.from(new Set(allBooks.flatMap(book => book.tags)));

  // Фильтрация книг
  const filteredBooks = allBooks.filter(book => {
    // Фильтр по поисковому запросу
    const matchesSearch = searchQuery === '' ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    // Фильтр по статусу
    const matchesStatus = selectedStatus === null || book.status === selectedStatus;

    // Фильтр по тегу
    const matchesTag = selectedTag === null || book.tags.includes(selectedTag);

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
        <title>Каталог книг | Трекер прочитанных книг</title>
        <meta name="description" content="Каталог книг в трекере прочитанных книг" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Каталог книг</h1>
            <Button asChild>
              <Link href="/books/add">Добавить книгу</Link>
            </Button>
          </div>

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
                cover={book.cover}
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
        </div>
      </Layout>
    </>
  );
}

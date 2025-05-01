import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/router';
import { useState } from 'react';
import BookCard from '@/components/books/BookCard';
import Link from 'next/link';

interface Book {
  id: number;
  title: string;
  author: string;
  cover?: string;
  rating?: number;
  status?: 'read' | 'reading' | 'want_to_read';
  tags?: string[];
}

interface BookList {
  id: number;
  name: string;
  description: string;
  isPublic: boolean;
  owner: {
    id: number;
    name: string;
  };
  books: Book[];
}

export default function ListDetails() {
  const router = useRouter();
  const { id } = router.query;
  
  // В реальном приложении данные будут загружаться из Supabase
  const [list, setList] = useState<BookList>({
    id: Number(id) || 1,
    name: 'Классическая литература',
    description: 'Коллекция классических произведений мировой литературы',
    isPublic: true,
    owner: {
      id: 1,
      name: 'Иван Иванов'
    },
    books: [
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
    ]
  });
  
  // Проверка, является ли текущий пользователь владельцем списка
  // В реальном приложении будет проверка с Supabase
  const isOwner = true;
  
  // Обработка удаления списка
  const handleDeleteList = async () => {
    if (!confirm('Вы уверены, что хотите удалить этот список?')) return;
    
    try {
      // В реальном приложении здесь будет отправка данных в Supabase
      console.log('Удаление списка:', list.id);
      
      // Имитация задержки запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Перенаправление на страницу списков
      router.push('/lists');
    } catch (error) {
      console.error('Ошибка при удалении списка:', error);
    }
  };
  
  // Обработка удаления книги из списка
  const handleRemoveBook = (bookId: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту книгу из списка?')) return;
    
    // В реальном приложении здесь будет отправка данных в Supabase
    console.log('Удаление книги из списка:', bookId);
    
    // Обновление локального состояния
    setList(prev => ({
      ...prev,
      books: prev.books.filter(book => book.id !== bookId)
    }));
  };

  return (
    <>
      <Head>
        <title>{list.name} | Трекер прочитанных книг</title>
        <meta name="description" content={list.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="mb-6">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              Назад
            </Button>
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{list.name}</h1>
            <p className="text-muted-foreground mb-4">{list.description}</p>
            <div className="flex items-center gap-2 mb-4">
              <span>Создатель: {list.owner.name}</span>
              <span>•</span>
              <span>{list.isPublic ? 'Публичный список' : 'Приватный список'}</span>
              <span>•</span>
              <span>{list.books.length} книг</span>
            </div>
            
            {isOwner && (
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/lists/edit/${list.id}`}>Редактировать</Link>
                </Button>
                <Button variant="destructive" onClick={handleDeleteList}>
                  Удалить список
                </Button>
              </div>
            )}
          </div>
          
          {isOwner && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Добавить книги в список</CardTitle>
                <CardDescription>Добавьте новые книги в этот список</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href={`/lists/${list.id}/add-books`}>Добавить книги</Link>
                </Button>
              </CardContent>
            </Card>
          )}
          
          {/* Список книг */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.books.map(book => (
              <div key={book.id} className="relative">
                {isOwner && (
                  <button 
                    className="absolute top-2 right-2 z-10 bg-background/80 text-destructive p-1 rounded-full"
                    onClick={() => handleRemoveBook(book.id)}
                    title="Удалить из списка"
                  >
                    ✕
                  </button>
                )}
                <BookCard
                  id={book.id}
                  title={book.title}
                  author={book.author}
                  cover={book.cover}
                  rating={book.rating}
                  status={book.status}
                  tags={book.tags}
                />
              </div>
            ))}
          </div>
          
          {list.books.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">В этом списке пока нет книг</p>
              {isOwner && (
                <Button asChild>
                  <Link href={`/lists/${list.id}/add-books`}>Добавить книги</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}

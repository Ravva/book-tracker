import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import BookCard from '@/components/books/BookCard';

export default function Profile() {
  // В реальном приложении данные будут загружаться из Supabase
  const user = {
    id: 1,
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    avatar: '/placeholder-avatar.jpg',
    registeredAt: '2023-01-15',
  };
  
  const stats = {
    totalBooks: 42,
    readBooks: 28,
    readingBooks: 5,
    wantToReadBooks: 9,
    averageRating: 8.3,
  };
  
  const books = [
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
  ];
  
  const lists = [
    { id: 1, name: 'Любимые книги', bookCount: 12, isPublic: true },
    { id: 2, name: 'Хочу прочитать летом', bookCount: 8, isPublic: true },
    { id: 3, name: 'Личный список', bookCount: 5, isPublic: false },
  ];
  
  const achievements = [
    { id: 1, name: 'Книжный марафонец', description: 'Прочитано 25 книг', icon: '📚' },
    { id: 2, name: 'Исследователь жанров', description: 'Прочитаны книги из 5 разных жанров', icon: '🔍' },
    { id: 3, name: 'Постоянный читатель', description: 'Активность в течение 3 месяцев подряд', icon: '🏆' },
  ];

  return (
    <>
      <Head>
        <title>Профиль | Трекер прочитанных книг</title>
        <meta name="description" content="Профиль пользователя в трекере прочитанных книг" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="container mx-auto py-8 px-4">
          {/* Профиль пользователя */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex flex-col items-center md:items-start">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                Изменить аватар
              </Button>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-muted-foreground mb-4">
                На сайте с {new Date(user.registeredAt).toLocaleDateString('ru-RU')}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div className="bg-muted p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">{stats.totalBooks}</div>
                  <div className="text-xs text-muted-foreground">Всего книг</div>
                </div>
                <div className="bg-muted p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">{stats.readBooks}</div>
                  <div className="text-xs text-muted-foreground">Прочитано</div>
                </div>
                <div className="bg-muted p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">{stats.readingBooks}</div>
                  <div className="text-xs text-muted-foreground">Читаю</div>
                </div>
                <div className="bg-muted p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">{stats.wantToReadBooks}</div>
                  <div className="text-xs text-muted-foreground">Хочу прочитать</div>
                </div>
                <div className="bg-muted p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold">{stats.averageRating}</div>
                  <div className="text-xs text-muted-foreground">Средний рейтинг</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/profile/settings">Настройки профиля</Link>
                </Button>
                <Button variant="outline">Выйти</Button>
              </div>
            </div>
          </div>
          
          {/* Вкладки */}
          <Tabs defaultValue="books" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="books">Мои книги</TabsTrigger>
              <TabsTrigger value="lists">Мои списки</TabsTrigger>
              <TabsTrigger value="achievements">Достижения</TabsTrigger>
            </TabsList>
            
            <TabsContent value="books">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Мои книги</h2>
                <Button asChild>
                  <Link href="/books/add">Добавить книгу</Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map(book => (
                  <BookCard
                    key={book.id}
                    id={book.id}
                    title={book.title}
                    author={book.author}
                    cover={book.cover}
                    rating={book.rating}
                    status={book.status as any}
                    tags={book.tags}
                  />
                ))}
              </div>
              
              {books.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">У вас пока нет добавленных книг</p>
                  <Button asChild>
                    <Link href="/books/add">Добавить первую книгу</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="lists">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Мои списки</h2>
                <Button>Создать список</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lists.map(list => (
                  <Card key={list.id}>
                    <CardHeader>
                      <CardTitle>{list.name}</CardTitle>
                      <CardDescription>
                        {list.bookCount} книг • {list.isPublic ? 'Публичный' : 'Приватный'}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/lists/${list.id}`}>Открыть</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {lists.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">У вас пока нет созданных списков</p>
                  <Button>Создать первый список</Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="achievements">
              <h2 className="text-2xl font-bold mb-4">Мои достижения</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map(achievement => (
                  <Card key={achievement.id}>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <div className="text-4xl">{achievement.icon}</div>
                        <CardTitle>{achievement.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p>{achievement.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {achievements.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">У вас пока нет достижений</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </>
  );
}

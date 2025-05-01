import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useState } from 'react';

interface BookList {
  id: number;
  name: string;
  description: string;
  isPublic: boolean;
  bookCount: number;
  owner: {
    id: number;
    name: string;
  };
}

export default function Lists() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // В реальном приложении данные будут загружаться из Supabase
  const allLists: BookList[] = [
    {
      id: 1,
      name: 'Классическая литература',
      description: 'Коллекция классических произведений мировой литературы',
      isPublic: true,
      bookCount: 15,
      owner: {
        id: 1,
        name: 'Иван Иванов'
      }
    },
    {
      id: 2,
      name: 'Научная фантастика',
      description: 'Лучшие научно-фантастические романы всех времен',
      isPublic: true,
      bookCount: 12,
      owner: {
        id: 2,
        name: 'Мария Петрова'
      }
    },
    {
      id: 3,
      name: 'Книги для саморазвития',
      description: 'Книги по психологии, бизнесу и личностному росту',
      isPublic: true,
      bookCount: 8,
      owner: {
        id: 3,
        name: 'Алексей Смирнов'
      }
    },
    {
      id: 4,
      name: 'Детективы',
      description: 'Захватывающие детективные истории',
      isPublic: true,
      bookCount: 10,
      owner: {
        id: 1,
        name: 'Иван Иванов'
      }
    },
    {
      id: 5,
      name: 'Мои любимые книги',
      description: 'Личная коллекция любимых произведений',
      isPublic: true,
      bookCount: 7,
      owner: {
        id: 1,
        name: 'Иван Иванов'
      }
    },
  ];
  
  // Фильтрация списков по поисковому запросу
  const filteredLists = allLists.filter(list => {
    return searchQuery === '' || 
      list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.owner.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <Head>
        <title>Списки книг | Трекер прочитанных книг</title>
        <meta name="description" content="Списки книг в трекере прочитанных книг" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Списки книг</h1>
            <Button asChild>
              <Link href="/lists/create">Создать список</Link>
            </Button>
          </div>
          
          {/* Поиск */}
          <div className="mb-8">
            <Input
              placeholder="Поиск по названию, описанию или автору"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          {/* Списки книг */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLists.map(list => (
              <Card key={list.id}>
                <CardHeader>
                  <CardTitle>{list.name}</CardTitle>
                  <CardDescription>
                    Создатель: {list.owner.name} • {list.bookCount} книг
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">{list.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/lists/${list.id}`}>Открыть</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredLists.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Списки не найдены</p>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}

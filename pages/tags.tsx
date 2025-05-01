import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import Link from 'next/link';

interface Tag {
  id: number;
  name: string;
  bookCount: number;
}

export default function Tags() {
  const [searchQuery, setSearchQuery] = useState('');
  const [newTagName, setNewTagName] = useState('');
  
  // В реальном приложении данные будут загружаться из Supabase
  const allTags: Tag[] = [
    { id: 1, name: 'Фантастика', bookCount: 325 },
    { id: 2, name: 'Роман', bookCount: 287 },
    { id: 3, name: 'Детектив', bookCount: 198 },
    { id: 4, name: 'Фэнтези', bookCount: 176 },
    { id: 5, name: 'Научно-популярная', bookCount: 145 },
    { id: 6, name: 'Классика', bookCount: 134 },
    { id: 7, name: 'Приключения', bookCount: 112 },
    { id: 8, name: 'Психология', bookCount: 98 },
    { id: 9, name: 'Биография', bookCount: 87 },
    { id: 10, name: 'История', bookCount: 76 },
    { id: 11, name: 'Философия', bookCount: 65 },
    { id: 12, name: 'Бизнес', bookCount: 54 },
    { id: 13, name: 'Саморазвитие', bookCount: 43 },
    { id: 14, name: 'Поэзия', bookCount: 32 },
    { id: 15, name: 'Ужасы', bookCount: 21 },
  ];
  
  // Фильтрация тегов по поисковому запросу
  const filteredTags = allTags.filter(tag => {
    return searchQuery === '' || tag.name.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Обработка добавления нового тега
  const handleAddTag = () => {
    if (!newTagName.trim()) return;
    
    // В реальном приложении здесь будет отправка данных в Supabase
    console.log('Добавление нового тега:', newTagName);
    
    // Сброс поля ввода
    setNewTagName('');
  };

  return (
    <>
      <Head>
        <title>Теги | Трекер прочитанных книг</title>
        <meta name="description" content="Управление тегами в трекере прочитанных книг" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-6">Теги</h1>
          
          {/* Добавление нового тега */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Добавить новый тег</CardTitle>
              <CardDescription>Создайте новый тег для категоризации книг</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Название тега"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                />
                <Button onClick={handleAddTag} disabled={!newTagName.trim()}>
                  Добавить
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Поиск тегов */}
          <div className="mb-6">
            <Input
              placeholder="Поиск по тегам"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          {/* Облако тегов */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Облако тегов</CardTitle>
              <CardDescription>Нажмите на тег, чтобы увидеть связанные книги</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {filteredTags.map(tag => (
                  <Link 
                    key={tag.id} 
                    href={`/books?tag=${tag.name}`}
                    className={`
                      px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-colors
                      ${tag.bookCount > 200 ? 'text-lg font-medium' : ''}
                      ${tag.bookCount > 100 && tag.bookCount <= 200 ? 'text-base' : ''}
                      ${tag.bookCount <= 100 ? 'text-sm' : ''}
                    `}
                  >
                    {tag.name} ({tag.bookCount})
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Список тегов */}
          <Card>
            <CardHeader>
              <CardTitle>Все теги</CardTitle>
              <CardDescription>Полный список тегов с количеством книг</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTags.map(tag => (
                  <div key={tag.id} className="flex justify-between items-center p-2 border-b border-border">
                    <Link href={`/books?tag=${tag.name}`} className="hover:text-primary">
                      {tag.name}
                    </Link>
                    <span className="text-muted-foreground">{tag.bookCount} книг</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {filteredTags.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Теги не найдены</p>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}

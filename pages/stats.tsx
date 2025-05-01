import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Stats() {
  // В реальном приложении данные будут загружаться из Supabase
  const generalStats = {
    totalBooks: 1245,
    totalUsers: 348,
    totalReviews: 5672,
    averageRating: 8.7,
    mostReadGenres: [
      { name: 'Фантастика', count: 325 },
      { name: 'Роман', count: 287 },
      { name: 'Детектив', count: 198 },
      { name: 'Фэнтези', count: 176 },
      { name: 'Научно-популярная', count: 145 },
    ],
    mostActiveUsers: [
      { name: 'Иван Иванов', booksCount: 87 },
      { name: 'Мария Петрова', booksCount: 76 },
      { name: 'Алексей Смирнов', booksCount: 65 },
      { name: 'Елена Кузнецова', booksCount: 58 },
      { name: 'Дмитрий Соколов', booksCount: 52 },
    ],
  };
  
  const personalStats = {
    totalBooks: 42,
    readBooks: 28,
    readingBooks: 5,
    wantToReadBooks: 9,
    averageRating: 8.3,
    readByMonth: [
      { month: 'Январь', count: 3 },
      { month: 'Февраль', count: 2 },
      { month: 'Март', count: 4 },
      { month: 'Апрель', count: 1 },
      { month: 'Май', count: 3 },
      { month: 'Июнь', count: 2 },
      { month: 'Июль', count: 0 },
      { month: 'Август', count: 1 },
      { month: 'Сентябрь', count: 2 },
      { month: 'Октябрь', count: 3 },
      { month: 'Ноябрь', count: 4 },
      { month: 'Декабрь', count: 3 },
    ],
    favoriteGenres: [
      { name: 'Фантастика', count: 12 },
      { name: 'Детектив', count: 8 },
      { name: 'Научно-популярная', count: 7 },
      { name: 'Роман', count: 6 },
      { name: 'Фэнтези', count: 5 },
    ],
  };

  return (
    <>
      <Head>
        <title>Статистика | Трекер прочитанных книг</title>
        <meta name="description" content="Статистика в трекере прочитанных книг" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-6">Статистика</h1>
          
          <Tabs defaultValue="general" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="general">Общая статистика</TabsTrigger>
              <TabsTrigger value="personal">Личная статистика</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl">{generalStats.totalBooks}</CardTitle>
                    <CardDescription>Книг в базе</CardDescription>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl">{generalStats.totalUsers}</CardTitle>
                    <CardDescription>Пользователей</CardDescription>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl">{generalStats.totalReviews}</CardTitle>
                    <CardDescription>Отзывов</CardDescription>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl">{generalStats.averageRating}</CardTitle>
                    <CardDescription>Средний рейтинг</CardDescription>
                  </CardHeader>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Популярные жанры</CardTitle>
                    <CardDescription>Самые читаемые жанры книг</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {generalStats.mostReadGenres.map((genre, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{genre.name}</span>
                          <span className="font-medium">{genre.count} книг</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Активные пользователи</CardTitle>
                    <CardDescription>Пользователи с наибольшим количеством книг</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {generalStats.mostActiveUsers.map((user, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{user.name}</span>
                          <span className="font-medium">{user.booksCount} книг</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="personal">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl">{personalStats.totalBooks}</CardTitle>
                    <CardDescription>Всего книг</CardDescription>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl">{personalStats.readBooks}</CardTitle>
                    <CardDescription>Прочитано</CardDescription>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl">{personalStats.readingBooks}</CardTitle>
                    <CardDescription>Читаю</CardDescription>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl">{personalStats.wantToReadBooks}</CardTitle>
                    <CardDescription>Хочу прочитать</CardDescription>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl">{personalStats.averageRating}</CardTitle>
                    <CardDescription>Средний рейтинг</CardDescription>
                  </CardHeader>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Книги по месяцам</CardTitle>
                    <CardDescription>Количество прочитанных книг по месяцам</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-end justify-between gap-1">
                      {personalStats.readByMonth.map((month, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div 
                            className="bg-primary w-8 rounded-t-sm" 
                            style={{ height: `${(month.count / 4) * 100}%` }}
                          ></div>
                          <div className="text-xs mt-1 rotate-45 origin-left">{month.month.substring(0, 3)}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Любимые жанры</CardTitle>
                    <CardDescription>Ваши самые читаемые жанры</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {personalStats.favoriteGenres.map((genre, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between">
                            <span>{genre.name}</span>
                            <span className="font-medium">{genre.count} книг</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${(genre.count / personalStats.favoriteGenres[0].count) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </>
  );
}

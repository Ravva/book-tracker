import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function Home() {
  // Данные для дашборда (в реальном приложении будут загружаться с сервера)
  const popularBooks = [
    { id: 1, title: 'Война и мир', author: 'Лев Толстой', rating: 9.2 },
    { id: 2, title: 'Преступление и наказание', author: 'Федор Достоевский', rating: 8.9 },
    { id: 3, title: 'Мастер и Маргарита', author: 'Михаил Булгаков', rating: 9.5 },
  ];

  const recentActivity = [
    { id: 1, user: 'Анна', action: 'прочитала книгу', book: 'Гордость и предубеждение' },
    { id: 2, user: 'Иван', action: 'добавил в список', book: '1984' },
    { id: 3, user: 'Мария', action: 'оценила книгу', book: 'Три товарища' },
  ];

  const recentComments = [
    { id: 1, user: 'Петр', book: 'Идиот', comment: 'Потрясающая книга, очень глубокая и философская.' },
    { id: 2, user: 'Елена', book: 'Анна Каренина', comment: 'Классика, которая не устаревает.' },
  ];

  return (
    <>
      <Head>
        <title>Трекер прочитанных книг</title>
        <meta name="description" content="Трекер для отслеживания прочитанных книг" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-4xl font-bold mb-8">Дашборд</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {/* Популярные книги */}
            <Card>
              <CardHeader>
                <CardTitle>Популярные книги</CardTitle>
                <CardDescription>Книги с высоким рейтингом</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {popularBooks.map((book) => (
                    <li key={book.id} className="border-b border-input pb-2">
                      <div className="font-medium">{book.title}</div>
                      <div className="text-sm text-muted-foreground">{book.author}</div>
                      <div className="text-sm">Рейтинг: <span className="font-semibold text-primary">{book.rating}/10</span></div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/books">Смотреть все книги</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Активность пользователей */}
            <Card>
              <CardHeader>
                <CardTitle>Активность</CardTitle>
                <CardDescription>Недавние действия пользователей</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {recentActivity.map((activity) => (
                    <li key={activity.id} className="border-b border-input pb-2">
                      <div>
                        <span className="font-medium">{activity.user}</span>{' '}
                        <span className="text-muted-foreground">{activity.action}</span>{' '}
                        <span className="font-medium">{activity.book}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Последние комментарии */}
            <Card>
              <CardHeader>
                <CardTitle>Комментарии</CardTitle>
                <CardDescription>Последние отзывы о книгах</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {recentComments.map((comment) => (
                    <li key={comment.id} className="border-b border-input pb-2">
                      <div className="font-medium">{comment.user} о книге "{comment.book}"</div>
                      <div className="text-sm text-muted-foreground">{comment.comment}</div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Статистика */}
          <Card>
            <CardHeader>
              <CardTitle>Общая статистика</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold">1,245</div>
                  <div className="text-sm text-muted-foreground">Книг в базе</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold">348</div>
                  <div className="text-sm text-muted-foreground">Пользователей</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold">5,672</div>
                  <div className="text-sm text-muted-foreground">Отзывов</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold">8.7</div>
                  <div className="text-sm text-muted-foreground">Средний рейтинг</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </>
  );
}

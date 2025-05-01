import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ServerError() {
  return (
    <>
      <Head>
        <title>Ошибка сервера | Трекер прочитанных книг</title>
        <meta name="description" content="Ошибка сервера" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="container mx-auto py-16 px-4 text-center">
          <h1 className="text-6xl font-bold mb-4">500</h1>
          <h2 className="text-2xl font-medium mb-6">Ошибка сервера</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Извините, но на сервере произошла ошибка. Мы уже работаем над её устранением.
          </p>
          <Button asChild>
            <Link href="/">Вернуться на главную</Link>
          </Button>
        </div>
      </Layout>
    </>
  );
}

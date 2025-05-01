import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Страница не найдена | Трекер прочитанных книг</title>
        <meta name="description" content="Страница не найдена" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="container mx-auto py-16 px-4 text-center">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-medium mb-6">Страница не найдена</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Извините, но страница, которую вы ищете, не существует или была перемещена.
          </p>
          <Button asChild>
            <Link href="/">Вернуться на главную</Link>
          </Button>
        </div>
      </Layout>
    </>
  );
}

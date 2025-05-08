import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Typography, Button, Result } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';

const { Title, Text } = Typography;

interface NotFoundProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function NotFound({ isDarkMode, toggleTheme }: NotFoundProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Страница не найдена | Трекер прочитанных книг</title>
        <meta name="description" content="Страница не найдена" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 16px', textAlign: 'center' }}>
          <Result
            status="404"
            title="404"
            subTitle="Извините, страница, которую вы посетили, не существует."
            extra={
              <Button type="primary">
                <Link href="/">Вернуться на главную</Link>
              </Button>
            }
          />
        </div>
      </Layout>
    </>
  );
}

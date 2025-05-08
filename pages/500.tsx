import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Typography, Button, Result } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';

const { Title, Text } = Typography;

interface ServerErrorProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function ServerError({ isDarkMode, toggleTheme }: ServerErrorProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Ошибка сервера | Трекер прочитанных книг</title>
        <meta name="description" content="Ошибка сервера" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 16px', textAlign: 'center' }}>
          <Result
            status="500"
            title="500"
            subTitle="Извините, что-то пошло не так на сервере."
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

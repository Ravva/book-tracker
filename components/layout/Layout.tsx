import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Layout as AntLayout, Menu, Button, Space, Typography } from 'antd';
import ThemeToggle from './ThemeToggle';

const { Header, Content, Footer } = AntLayout;
const { Title, Text } = Typography;

interface LayoutProps {
  children: React.ReactNode;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function Layout({ children, isDarkMode, toggleTheme }: LayoutProps) {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  // Определяем активный пункт меню
  const getSelectedKey = () => {
    if (router.pathname === '/') return ['home'];
    if (router.pathname === '/books' || router.pathname.startsWith('/books/')) return ['books'];
    return [];
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        width: '100%',
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/">
            <Title level={4} style={{ margin: 0, color: 'white' }}>
              Трекер книг
            </Title>
          </Link>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={getSelectedKey()}
            style={{ marginLeft: 30, minWidth: 400 }}
            items={[
              {
                key: 'home',
                label: <Link href="/">Главная</Link>,
              },
              {
                key: 'books',
                label: <Link href="/books">Книги</Link>,
              },
            ]}
          />
        </div>
        <Space>
          <Button type="link" href="/auth/signin">
            Войти
          </Button>
          <Button type="primary" href="/auth/signup">
            Регистрация
          </Button>
        </Space>
      </Header>
      <Content style={{ padding: '0 50px', marginTop: 24 }}>
        {children}
      </Content>
      <Footer style={{ textAlign: 'center', padding: '24px 50px' }}>
        <Text type="secondary">© {currentYear} Трекер прочитанных книг</Text>
      </Footer>
      <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    </AntLayout>
  );
}

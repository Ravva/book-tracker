import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Layout as AntLayout, Menu, Button, Space, Typography, Avatar, Dropdown, Badge } from 'antd';
import { UserOutlined, BellOutlined, BookOutlined, HomeOutlined, UnorderedListOutlined, UserSwitchOutlined } from '@ant-design/icons';
import ThemeToggle from './ThemeToggle';

const { Header, Content, Footer, Sider } = AntLayout;
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
    if (router.pathname === '/lists' || router.pathname.startsWith('/lists/')) return ['lists'];
    if (router.pathname === '/profile' || router.pathname.startsWith('/profile/')) return ['profile'];
    return [];
  };

  // Меню пользователя
  const userMenuItems = [
    {
      key: 'profile',
      label: <Link href="/profile">Мой профиль</Link>,
      icon: <UserOutlined />,
    },
    {
      key: 'settings',
      label: <Link href="/profile/settings">Настройки</Link>,
      icon: <UserSwitchOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Выйти',
      danger: true,
    },
  ];

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <BookOutlined style={{ fontSize: 24, marginRight: 8, color: isDarkMode ? 'white' : '#1677ff' }} />
              <Title level={4} style={{ margin: 0, color: isDarkMode ? 'white' : 'inherit' }}>
                Трекер книг
              </Title>
            </div>
          </Link>
          <Menu
            mode="horizontal"
            selectedKeys={getSelectedKey()}
            style={{
              marginLeft: 40,
              minWidth: 400,
              border: 'none',
              background: 'transparent',
            }}
            items={[
              {
                key: 'home',
                label: <Link href="/">Главная</Link>,
                icon: <HomeOutlined />,
              },
              {
                key: 'books',
                label: <Link href="/books">Книги</Link>,
                icon: <BookOutlined />,
              },
              {
                key: 'lists',
                label: <Link href="/lists">Списки</Link>,
                icon: <UnorderedListOutlined />,
              },
            ]}
          />
        </div>
        <Space size="large">
          <Badge count={5} size="small">
            <Button
              type="text"
              icon={<BellOutlined style={{ fontSize: 20 }} />}
              shape="circle"
              size="large"
            />
          </Badge>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
            <Button type="text" style={{ height: 40 }}>
              <Space>
                <Avatar size="small" icon={<UserOutlined />} />
                <span>Гость</span>
              </Space>
            </Button>
          </Dropdown>

          <Button type="primary" href="/auth/signup" shape="round">
            Регистрация
          </Button>
        </Space>
      </Header>
      <Content style={{ padding: '24px 50px', background: isDarkMode ? '#141414' : '#f5f5f5' }}>
        {children}
      </Content>
      <Footer style={{
        textAlign: 'center',
        padding: '24px 50px',
        background: isDarkMode ? '#1f1f1f' : '#fff',
        boxShadow: '0 -1px 2px rgba(0, 0, 0, 0.03)'
      }}>
        <Text type="secondary">© {currentYear} Трекер прочитанных книг</Text>
      </Footer>
      <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    </AntLayout>
  );
}

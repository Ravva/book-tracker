import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Typography, Button, Card, Tabs, Avatar, List, Space, Statistic, Row, Col, Spin, Empty } from 'antd';
import { UserOutlined, BookOutlined, SettingOutlined, ReadOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface ProfileProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function Profile({ isDarkMode, toggleTheme }: ProfileProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [lists, setLists] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        
        // Получаем текущего пользователя
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (!currentUser) {
          setError('Пользователь не авторизован');
          setLoading(false);
          return;
        }
        
        // Получаем профиль пользователя
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();
        
        if (profileError) {
          console.error('Ошибка при получении профиля:', profileError);
        }
        
        // Получаем книги пользователя
        const { data: booksData, error: booksError } = await supabase
          .from('books')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false });
        
        if (booksError) {
          console.error('Ошибка при получении книг:', booksError);
        }
        
        // Получаем списки пользователя
        const { data: listsData, error: listsError } = await supabase
          .from('book_lists')
          .select(`
            id,
            title,
            created_at,
            is_public,
            book_list_items:book_list_items (id)
          `)
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false });
        
        if (listsError) {
          console.error('Ошибка при получении списков:', listsError);
        }
        
        // Рассчитываем статистику
        const readBooks = booksData?.filter(book => book.status === 'read') || [];
        const readingBooks = booksData?.filter(book => book.status === 'reading') || [];
        const wantToReadBooks = booksData?.filter(book => book.status === 'want_to_read') || [];
        
        const avgRating = readBooks.length > 0
          ? readBooks.reduce((sum, book) => sum + (book.rating || 0), 0) / readBooks.length
          : 0;
        
        setUser({
          ...currentUser,
          profile: profileData || {}
        });
        setBooks(booksData || []);
        setLists(listsData || []);
        setStats({
          totalBooks: booksData?.length || 0,
          readBooks: readBooks.length,
          readingBooks: readingBooks.length,
          wantToReadBooks: wantToReadBooks.length,
          avgRating: avgRating.toFixed(1),
          totalLists: listsData?.length || 0
        });
        
      } catch (err) {
        console.error('Ошибка при загрузке данных пользователя:', err);
        setError('Не удалось загрузить данные пользователя');
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, []);

  return (
    <>
      <Head>
        <title>Профиль | Трекер прочитанных книг</title>
        <meta name="description" content="Профиль пользователя в трекере прочитанных книг" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <Spin size="large" />
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <Empty
                description={error}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
              <Button style={{ marginTop: 16 }}>
                <Link href="/auth/signin">Войти</Link>
              </Button>
            </div>
          ) : user ? (
            <>
              <Card style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                  <Avatar 
                    size={80} 
                    icon={<UserOutlined />} 
                    src={user.profile?.avatar_url}
                  />
                  <div style={{ marginLeft: 24 }}>
                    <Title level={3} style={{ margin: 0 }}>
                      {user.profile?.username || user.email}
                    </Title>
                    <Text type="secondary">
                      Участник с {formatDate(user.created_at)}
                    </Text>
                    <div style={{ marginTop: 16 }}>
                      <Button type="primary" icon={<SettingOutlined />}>
                        <Link href="/profile/settings">Настройки профиля</Link>
                      </Button>
                    </div>
                  </div>
                </div>

                <Row gutter={[16, 16]}>
                  <Col xs={12} sm={8} md={4}>
                    <Statistic 
                      title="Всего книг" 
                      value={stats.totalBooks} 
                      prefix={<BookOutlined />} 
                    />
                  </Col>
                  <Col xs={12} sm={8} md={4}>
                    <Statistic 
                      title="Прочитано" 
                      value={stats.readBooks} 
                      prefix={<ReadOutlined />} 
                    />
                  </Col>
                  <Col xs={12} sm={8} md={4}>
                    <Statistic 
                      title="Читаю" 
                      value={stats.readingBooks} 
                      prefix={<BookOutlined />} 
                    />
                  </Col>
                  <Col xs={12} sm={8} md={4}>
                    <Statistic 
                      title="Хочу прочитать" 
                      value={stats.wantToReadBooks} 
                      prefix={<ClockCircleOutlined />} 
                    />
                  </Col>
                  <Col xs={12} sm={8} md={4}>
                    <Statistic 
                      title="Средний рейтинг" 
                      value={stats.avgRating} 
                      suffix="/10" 
                    />
                  </Col>
                  <Col xs={12} sm={8} md={4}>
                    <Statistic 
                      title="Списков" 
                      value={stats.totalLists} 
                    />
                  </Col>
                </Row>
              </Card>

              <Tabs defaultActiveKey="books">
                <TabPane tab="Мои книги" key="books">
                  {books.length === 0 ? (
                    <Empty description="У вас пока нет книг" />
                  ) : (
                    <List
                      grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
                      dataSource={books}
                      renderItem={(book) => (
                        <List.Item>
                          <Card
                            hoverable
                            cover={book.cover_url ? (
                              <img
                                alt={`Обложка ${book.title}`}
                                src={book.cover_url}
                                style={{ height: 200, objectFit: 'cover' }}
                              />
                            ) : (
                              <div style={{ 
                                height: 200, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                background: '#f0f0f0'
                              }}>
                                <BookOutlined style={{ fontSize: 48, opacity: 0.5 }} />
                              </div>
                            )}
                          >
                            <Card.Meta
                              title={<Link href={`/books/${book.id}`}>{book.title}</Link>}
                              description={book.author}
                            />
                          </Card>
                        </List.Item>
                      )}
                    />
                  )}
                </TabPane>
                <TabPane tab="Мои списки" key="lists">
                  {lists.length === 0 ? (
                    <Empty description="У вас пока нет списков" />
                  ) : (
                    <List
                      itemLayout="horizontal"
                      dataSource={lists}
                      renderItem={(list) => (
                        <List.Item
                          actions={[
                            <Button key="view" type="link">
                              <Link href={`/lists/${list.id}`}>Просмотр</Link>
                            </Button>
                          ]}
                        >
                          <List.Item.Meta
                            title={<Link href={`/lists/${list.id}`}>{list.title}</Link>}
                            description={
                              <Space>
                                <Text type="secondary">
                                  {formatDate(list.created_at)}
                                </Text>
                                <Text>
                                  {list.book_list_items?.length || 0} книг
                                </Text>
                                {list.is_public && (
                                  <Tag color="blue">Публичный</Tag>
                                )}
                              </Space>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  )}
                </TabPane>
              </Tabs>
            </>
          ) : null}
        </div>
      </Layout>
    </>
  );
}

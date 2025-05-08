import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Typography, Row, Col, Card, List, Statistic, Spin, Empty, Button, Space } from 'antd';
import { BookOutlined, UserOutlined, CommentOutlined, StarOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const { Title, Text, Paragraph } = Typography;

interface HomeProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function Home({ isDarkMode, toggleTheme }: HomeProps) {
  // Состояние для хранения данных из Supabase
  const [popularBooks, setPopularBooks] = useState<any[]>([]);
  const [recentComments, setRecentComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка данных из Supabase
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Получаем книги с высоким рейтингом
        const { data: booksData, error: booksError } = await supabase
          .from('books')
          .select('id, title, author, rating')
          .order('rating', { ascending: false })
          .limit(3);

        if (booksError) {
          console.error('Ошибка при загрузке книг:', booksError);
        } else {
          setPopularBooks(booksData || []);
        }

        // Получаем последние комментарии
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select(`
            id,
            content,
            books:book_id (title),
            users:user_id (id)
          `)
          .order('created_at', { ascending: false })
          .limit(3);

        if (commentsError) {
          console.error('Ошибка при загрузке комментариев:', commentsError);
        } else {
          // Преобразуем данные в нужный формат
          const formattedComments = commentsData?.map(comment => ({
            id: comment.id,
            user: 'Пользователь', // В реальном приложении здесь будет имя пользователя
            book: comment.books?.title || 'Неизвестная книга',
            comment: comment.content
          })) || [];

          setRecentComments(formattedComments);
        }

      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Демо-данные для активности пользователей (в реальном приложении будут загружаться с сервера)
  const recentActivity = [
    { id: 1, user: 'Анна', action: 'прочитала книгу', book: 'Гордость и предубеждение' },
    { id: 2, user: 'Иван', action: 'добавил в список', book: '1984' },
    { id: 3, user: 'Мария', action: 'оценила книгу', book: 'Три товарища' },
  ];

  return (
    <>
      <Head>
        <title>Трекер прочитанных книг</title>
        <meta name="description" content="Трекер для отслеживания прочитанных книг" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
          <Title level={2} style={{ marginBottom: 32, fontWeight: 600 }}>Дашборд</Title>

          <Row gutter={[24, 24]}>
            {/* Популярные книги */}
            <Col xs={24} md={12} lg={8}>
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookOutlined style={{ color: '#1677ff' }} />
                    <span>Популярные книги</span>
                  </div>
                }
                extra={<Link href="/books" style={{ color: '#1677ff' }}>Все книги</Link>}
                style={{
                  borderRadius: '8px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
                  height: '100%'
                }}
                styles={{
                  header: {
                    borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0',
                    padding: '16px 24px'
                  },
                  body: {
                    padding: '16px 24px'
                  }
                }}
              >
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Spin />
                  </div>
                ) : popularBooks.length === 0 ? (
                  <Empty
                    description="Нет данных о книгах"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ) : (
                  <List
                    itemLayout="horizontal"
                    dataSource={popularBooks}
                    renderItem={(book) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<BookOutlined style={{ fontSize: 20, color: '#1677ff' }} />}
                          title={
                            <Link
                              href={`/books/${book.id}`}
                              style={{
                                fontSize: '16px',
                                fontWeight: 500,
                                color: isDarkMode ? '#e6f4ff' : '#1677ff'
                              }}
                            >
                              {book.title}
                            </Link>
                          }
                          description={
                            <Space direction="vertical" size={2} style={{ width: '100%' }}>
                              <Text type="secondary">{book.author}</Text>
                              <div>
                                <Text>Рейтинг: </Text>
                                <Text strong style={{ color: '#faad14' }}>{book.rating}/10</Text>
                              </div>
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                )}
              </Card>
            </Col>

            {/* Активность пользователей */}
            <Col xs={24} md={12} lg={8}>
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserOutlined style={{ color: '#1677ff' }} />
                    <span>Активность пользователей</span>
                  </div>
                }
                style={{
                  borderRadius: '8px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
                  height: '100%'
                }}
                styles={{
                  header: {
                    borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0',
                    padding: '16px 24px'
                  },
                  body: {
                    padding: '16px 24px'
                  }
                }}
              >
                <List
                  itemLayout="horizontal"
                  dataSource={recentActivity}
                  renderItem={(activity) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<UserOutlined style={{ fontSize: 20, color: '#1677ff' }} />}
                        description={
                          <Paragraph style={{ margin: 0 }}>
                            <Text strong style={{ color: isDarkMode ? '#e6f4ff' : 'inherit' }}>{activity.user}</Text>{' '}
                            <Text type="secondary">{activity.action}</Text>{' '}
                            <Text strong style={{ color: isDarkMode ? '#e6f4ff' : 'inherit' }}>{activity.book}</Text>
                          </Paragraph>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            {/* Последние комментарии */}
            <Col xs={24} md={12} lg={8}>
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CommentOutlined style={{ color: '#1677ff' }} />
                    <span>Комментарии</span>
                  </div>
                }
                style={{
                  borderRadius: '8px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
                  height: '100%'
                }}
                styles={{
                  header: {
                    borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0',
                    padding: '16px 24px'
                  },
                  body: {
                    padding: '16px 24px'
                  }
                }}
              >
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Spin />
                  </div>
                ) : recentComments.length === 0 ? (
                  <Empty
                    description="Нет комментариев"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ) : (
                  <List
                    itemLayout="horizontal"
                    dataSource={recentComments}
                    renderItem={(comment) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<CommentOutlined style={{ fontSize: 20, color: '#1677ff' }} />}
                          title={
                            <Text style={{ fontSize: '14px' }}>
                              <Text strong style={{ color: isDarkMode ? '#e6f4ff' : 'inherit' }}>{comment.user}</Text> о книге "
                              <Text strong style={{ color: isDarkMode ? '#e6f4ff' : 'inherit' }}>{comment.book}</Text>"
                            </Text>
                          }
                          description={<Text type="secondary">{comment.comment}</Text>}
                        />
                      </List.Item>
                    )}
                  />
                )}
              </Card>
            </Col>
          </Row>

          {/* Статистика */}
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <StarOutlined style={{ color: '#1677ff' }} />
                <span>Общая статистика</span>
              </div>
            }
            style={{
              marginTop: 24,
              borderRadius: '8px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)'
            }}
            styles={{
              header: {
                borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0',
                padding: '16px 24px'
              },
              body: {
                padding: '24px'
              }
            }}
          >
            <Row gutter={[32, 32]}>
              <Col xs={12} md={6}>
                <Statistic
                  title={
                    <Text style={{ fontSize: '14px', color: isDarkMode ? '#a6a6a6' : 'rgba(0, 0, 0, 0.45)' }}>
                      Книг в базе
                    </Text>
                  }
                  value={1245}
                  valueStyle={{
                    color: isDarkMode ? '#e6f4ff' : '#1677ff',
                    fontWeight: 600
                  }}
                  prefix={<BookOutlined style={{ marginRight: '8px' }} />}
                />
              </Col>
              <Col xs={12} md={6}>
                <Statistic
                  title={
                    <Text style={{ fontSize: '14px', color: isDarkMode ? '#a6a6a6' : 'rgba(0, 0, 0, 0.45)' }}>
                      Пользователей
                    </Text>
                  }
                  value={348}
                  valueStyle={{
                    color: isDarkMode ? '#e6f4ff' : '#1677ff',
                    fontWeight: 600
                  }}
                  prefix={<UserOutlined style={{ marginRight: '8px' }} />}
                />
              </Col>
              <Col xs={12} md={6}>
                <Statistic
                  title={
                    <Text style={{ fontSize: '14px', color: isDarkMode ? '#a6a6a6' : 'rgba(0, 0, 0, 0.45)' }}>
                      Отзывов
                    </Text>
                  }
                  value={5672}
                  valueStyle={{
                    color: isDarkMode ? '#e6f4ff' : '#1677ff',
                    fontWeight: 600
                  }}
                  prefix={<CommentOutlined style={{ marginRight: '8px' }} />}
                />
              </Col>
              <Col xs={12} md={6}>
                <Statistic
                  title={
                    <Text style={{ fontSize: '14px', color: isDarkMode ? '#a6a6a6' : 'rgba(0, 0, 0, 0.45)' }}>
                      Средний рейтинг
                    </Text>
                  }
                  value={8.7}
                  precision={1}
                  valueStyle={{
                    color: '#faad14',
                    fontWeight: 600
                  }}
                  prefix={<StarOutlined style={{ marginRight: '8px' }} />}
                  suffix="/10"
                />
              </Col>
            </Row>
          </Card>
        </div>
      </Layout>
    </>
  );
}

import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Typography, Row, Col, Card, List, Statistic, Spin, Empty, Button } from 'antd';
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
          <Title level={2} style={{ marginBottom: 24 }}>Дашборд</Title>

          <Row gutter={[24, 24]}>
            {/* Популярные книги */}
            <Col xs={24} md={12} lg={8}>
              <Card
                title="Популярные книги"
                extra={<Link href="/books">Все книги</Link>}
              >
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <Spin />
                  </div>
                ) : popularBooks.length === 0 ? (
                  <Empty description="Нет данных о книгах" />
                ) : (
                  <List
                    itemLayout="horizontal"
                    dataSource={popularBooks}
                    renderItem={(book) => (
                      <List.Item>
                        <List.Item.Meta
                          title={<Link href={`/books/${book.id}`}>{book.title}</Link>}
                          description={
                            <>
                              <Text type="secondary">{book.author}</Text>
                              <div>
                                <Text>Рейтинг: </Text>
                                <Text strong>{book.rating}/10</Text>
                              </div>
                            </>
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
              <Card title="Активность пользователей">
                <List
                  itemLayout="horizontal"
                  dataSource={recentActivity}
                  renderItem={(activity) => (
                    <List.Item>
                      <List.Item.Meta
                        description={
                          <Paragraph>
                            <Text strong>{activity.user}</Text>{' '}
                            <Text type="secondary">{activity.action}</Text>{' '}
                            <Text strong>{activity.book}</Text>
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
              <Card title="Комментарии">
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <Spin />
                  </div>
                ) : recentComments.length === 0 ? (
                  <Empty description="Нет комментариев" />
                ) : (
                  <List
                    itemLayout="horizontal"
                    dataSource={recentComments}
                    renderItem={(comment) => (
                      <List.Item>
                        <List.Item.Meta
                          title={<Text>{comment.user} о книге "{comment.book}"</Text>}
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
          <Card title="Общая статистика" style={{ marginTop: 24 }}>
            <Row gutter={[16, 16]}>
              <Col xs={12} md={6}>
                <Statistic
                  title="Книг в базе"
                  value={1245}
                  prefix={<BookOutlined />}
                />
              </Col>
              <Col xs={12} md={6}>
                <Statistic
                  title="Пользователей"
                  value={348}
                  prefix={<UserOutlined />}
                />
              </Col>
              <Col xs={12} md={6}>
                <Statistic
                  title="Отзывов"
                  value={5672}
                  prefix={<CommentOutlined />}
                />
              </Col>
              <Col xs={12} md={6}>
                <Statistic
                  title="Средний рейтинг"
                  value={8.7}
                  precision={1}
                  prefix={<StarOutlined />}
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

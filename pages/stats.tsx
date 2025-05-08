import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Typography, Card, Tabs, Statistic, Row, Col, Spin, Empty } from 'antd';
import { BookOutlined, ReadOutlined, ClockCircleOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface StatsProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function Stats({ isDarkMode, toggleTheme }: StatsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        
        // Получаем статистику по книгам
        const { data: booksData, error: booksError } = await supabase
          .from('books')
          .select('id, rating, status');
        
        if (booksError) {
          throw booksError;
        }
        
        // Получаем количество пользователей
        const { count: usersCount, error: usersError } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true });
        
        if (usersError) {
          console.error('Ошибка при получении количества пользователей:', usersError);
        }
        
        // Получаем количество комментариев
        const { count: commentsCount, error: commentsError } = await supabase
          .from('comments')
          .select('id', { count: 'exact', head: true });
        
        if (commentsError) {
          console.error('Ошибка при получении количества комментариев:', commentsError);
        }
        
        // Рассчитываем статистику
        const books = booksData || [];
        const readBooks = books.filter(book => book.status === 'read');
        const readingBooks = books.filter(book => book.status === 'reading');
        const wantToReadBooks = books.filter(book => book.status === 'want_to_read');
        
        const avgRating = readBooks.length > 0
          ? readBooks.reduce((sum, book) => sum + (book.rating || 0), 0) / readBooks.length
          : 0;
        
        setStats({
          totalBooks: books.length,
          readBooks: readBooks.length,
          readingBooks: readingBooks.length,
          wantToReadBooks: wantToReadBooks.length,
          avgRating: avgRating.toFixed(1),
          usersCount: usersCount || 0,
          commentsCount: commentsCount || 0
        });
        
      } catch (err) {
        console.error('Ошибка при загрузке статистики:', err);
        setError('Не удалось загрузить статистику');
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, []);

  return (
    <>
      <Head>
        <title>Статистика | Трекер прочитанных книг</title>
        <meta name="description" content="Статистика трекера прочитанных книг" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
          <Title level={2}>Статистика</Title>
          
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
            </div>
          ) : (
            <Tabs defaultActiveKey="general">
              <TabPane tab="Общая статистика" key="general">
                <Card>
                  <Row gutter={[24, 24]}>
                    <Col xs={12} sm={8} md={6}>
                      <Statistic 
                        title="Всего книг" 
                        value={stats.totalBooks} 
                        prefix={<BookOutlined />} 
                      />
                    </Col>
                    <Col xs={12} sm={8} md={6}>
                      <Statistic 
                        title="Прочитано" 
                        value={stats.readBooks} 
                        prefix={<ReadOutlined />} 
                      />
                    </Col>
                    <Col xs={12} sm={8} md={6}>
                      <Statistic 
                        title="Читают" 
                        value={stats.readingBooks} 
                        prefix={<BookOutlined />} 
                      />
                    </Col>
                    <Col xs={12} sm={8} md={6}>
                      <Statistic 
                        title="Хотят прочитать" 
                        value={stats.wantToReadBooks} 
                        prefix={<ClockCircleOutlined />} 
                      />
                    </Col>
                    <Col xs={12} sm={8} md={6}>
                      <Statistic 
                        title="Средний рейтинг" 
                        value={stats.avgRating} 
                        prefix={<StarOutlined />}
                        suffix="/10" 
                      />
                    </Col>
                    <Col xs={12} sm={8} md={6}>
                      <Statistic 
                        title="Пользователей" 
                        value={stats.usersCount} 
                        prefix={<UserOutlined />} 
                      />
                    </Col>
                    <Col xs={12} sm={8} md={6}>
                      <Statistic 
                        title="Комментариев" 
                        value={stats.commentsCount} 
                      />
                    </Col>
                  </Row>
                </Card>
              </TabPane>
              
              <TabPane tab="Статистика по книгам" key="books">
                <Card>
                  <Empty description="Статистика по книгам в разработке" />
                </Card>
              </TabPane>
              
              <TabPane tab="Статистика по пользователям" key="users">
                <Card>
                  <Empty description="Статистика по пользователям в разработке" />
                </Card>
              </TabPane>
            </Tabs>
          )}
        </div>
      </Layout>
    </>
  );
}

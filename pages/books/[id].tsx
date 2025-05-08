import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Typography, Button, Card, Row, Col, Tag, Divider, Space, Rate, Spin, Empty, App } from 'antd';
import { BookOutlined, EditOutlined, DeleteOutlined, DownloadOutlined, ReadOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';

const { Title, Text, Paragraph } = Typography;

interface BookDetailsProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function BookDetails({ isDarkMode, toggleTheme }: BookDetailsProps) {
  const router = useRouter();
  const { id } = router.query;

  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { message } = App.useApp();

  useEffect(() => {
    async function fetchBook() {
      if (!id) return;

      try {
        setLoading(true);

        // Получаем информацию о книге
        const { data: bookData, error: bookError } = await supabase
          .from('books')
          .select('*')
          .eq('id', id)
          .single();

        if (bookError) {
          throw bookError;
        }

        if (!bookData) {
          setError('Книга не найдена');
          setLoading(false);
          return;
        }

        // Получаем теги для книги
        const { data: bookTagsData, error: bookTagsError } = await supabase
          .from('book_tags')
          .select('tag_id')
          .eq('book_id', bookData.id);

        if (bookTagsError) {
          console.error('Ошибка при получении тегов книги:', bookTagsError);
        }

        // Получаем информацию о тегах
        let tags: string[] = [];
        if (bookTagsData && bookTagsData.length > 0) {
          const tagIds = bookTagsData.map(bt => bt.tag_id);

          const { data: tagsData, error: tagsError } = await supabase
            .from('tags')
            .select('name')
            .in('id', tagIds);

          if (tagsError) {
            console.error('Ошибка при получении информации о тегах:', tagsError);
          } else {
            tags = tagsData?.map(tag => tag.name) || [];
          }
        }

        // Получаем комментарии к книге
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select(`
            id,
            content,
            created_at,
            users:user_id (id, email)
          `)
          .eq('book_id', bookData.id)
          .order('created_at', { ascending: false });

        if (commentsError) {
          console.error('Ошибка при получении комментариев:', commentsError);
        }

        setBook({
          ...bookData,
          tags,
          comments: commentsData || []
        });

      } catch (err) {
        console.error('Ошибка при загрузке книги:', err);
        setError('Не удалось загрузить информацию о книге');
      } finally {
        setLoading(false);
      }
    }

    fetchBook();
  }, [id]);

  // Функция для отображения статуса на русском
  const getStatusText = (status?: string) => {
    if (!status) return null;

    switch (status) {
      case 'read': return 'Прочитано';
      case 'reading': return 'Читаю';
      case 'want_to_read': return 'Хочу прочитать';
      default: return status;
    }
  };

  // Функция для получения иконки статуса
  const getStatusIcon = (status?: string) => {
    if (!status) return null;

    switch (status) {
      case 'read': return <ReadOutlined />;
      case 'reading': return <BookOutlined />;
      case 'want_to_read': return <ClockCircleOutlined />;
      default: return null;
    }
  };

  return (
    <>
      <Head>
        <title>{book ? `${book.title} | Трекер прочитанных книг` : 'Загрузка книги...'}</title>
        <meta name="description" content={book ? `${book.title} от ${book.author}` : 'Информация о книге'} />
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
                <Link href="/books">Вернуться к списку книг</Link>
              </Button>
            </div>
          ) : book ? (
            <>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={8} lg={6}>
                  <div style={{ marginBottom: 16 }}>
                    {book.cover_url ? (
                      <img
                        src={book.cover_url}
                        alt={`Обложка ${book.title}`}
                        style={{ width: '100%', borderRadius: 8 }}
                      />
                    ) : (
                      <div style={{
                        height: 300,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f0f0f0',
                        borderRadius: 8
                      }}>
                        <BookOutlined style={{ fontSize: 64, opacity: 0.5 }} />
                      </div>
                    )}
                  </div>

                  <Space direction="vertical" style={{ width: '100%' }}>
                    {book.status && (
                      <Card size="small">
                        <Space>
                          {getStatusIcon(book.status)}
                          <Text>{getStatusText(book.status)}</Text>
                        </Space>
                      </Card>
                    )}

                    {book.rating !== undefined && (
                      <Card size="small">
                        <div>
                          <Text>Рейтинг:</Text>
                          <div>
                            <Rate disabled defaultValue={book.rating / 2} allowHalf />
                            <Text style={{ marginLeft: 8 }}>{book.rating}/10</Text>
                          </div>
                        </div>
                      </Card>
                    )}

                    <Card size="small">
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Button type="primary" icon={<EditOutlined />} block>
                          <Link href={`/books/edit/${book.id}`}>Редактировать</Link>
                        </Button>

                        {book.file_url && (
                          <Button icon={<DownloadOutlined />} block>
                            <a href={book.file_url} download>Скачать книгу</a>
                          </Button>
                        )}

                        <Button danger icon={<DeleteOutlined />} block>
                          Удалить
                        </Button>
                      </Space>
                    </Card>
                  </Space>
                </Col>

                <Col xs={24} md={16} lg={18}>
                  <Card>
                    <Title level={2}>{book.title}</Title>
                    <Title level={4} type="secondary" style={{ marginTop: 0 }}>{book.author}</Title>

                    {book.tags && book.tags.length > 0 && (
                      <div style={{ margin: '16px 0' }}>
                        {book.tags.map((tag: string) => (
                          <Tag key={tag} style={{ marginBottom: 8 }}>{tag}</Tag>
                        ))}
                      </div>
                    )}

                    <Divider />

                    <Title level={4}>Описание</Title>
                    <Paragraph>
                      {book.description || 'Описание отсутствует'}
                    </Paragraph>

                    <Divider />

                    <Title level={4}>Комментарии</Title>
                    {book.comments && book.comments.length > 0 ? (
                      <Space direction="vertical" style={{ width: '100%' }}>
                        {book.comments.map((comment: any) => (
                          <Card key={comment.id} size="small" style={{ marginBottom: 16 }}>
                            <div>
                              <Text strong>{comment.users?.email ? comment.users.email.split('@')[0] : 'Пользователь'}</Text>
                              <Text type="secondary" style={{ marginLeft: 8 }}>
                                {formatDate(comment.created_at)}
                              </Text>
                            </div>
                            <Paragraph style={{ marginTop: 8 }}>
                              {comment.content}
                            </Paragraph>
                          </Card>
                        ))}
                      </Space>
                    ) : (
                      <Empty description="Нет комментариев" />
                    )}
                  </Card>
                </Col>
              </Row>
            </>
          ) : null}
        </div>
      </Layout>
    </>
  );
}

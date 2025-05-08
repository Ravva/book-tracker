import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Typography, Button, Card, List, Space, Tag, Divider, Spin, Empty, Popconfirm, App } from 'antd';
import { EditOutlined, DeleteOutlined, ShareAltOutlined, BookOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';

const { Title, Text, Paragraph } = Typography;

interface ListDetailsProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function ListDetails({ isDarkMode, toggleTheme }: ListDetailsProps) {
  const router = useRouter();
  const { id } = router.query;

  const [list, setList] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const { message } = App.useApp();

  useEffect(() => {
    async function fetchList() {
      if (!id) return;

      try {
        setLoading(true);

        // Получаем текущего пользователя
        const { data: { user: currentUser } } = await supabase.auth.getUser();

        // Получаем информацию о списке
        const { data: listData, error: listError } = await supabase
          .from('book_lists')
          .select(`
            id,
            title,
            description,
            created_at,
            is_public,
            user_id,
            users:user_id (id, email)
          `)
          .eq('id', id)
          .single();

        if (listError) {
          throw listError;
        }

        if (!listData) {
          setError('Список не найден');
          setLoading(false);
          return;
        }

        // Проверяем, является ли текущий пользователь владельцем списка
        if (currentUser && listData.user_id === currentUser.id) {
          setIsOwner(true);
        } else if (!listData.is_public && (!currentUser || listData.user_id !== currentUser.id)) {
          setError('У вас нет доступа к этому списку');
          setLoading(false);
          return;
        }

        // Получаем книги из списка
        const { data: listItemsData, error: listItemsError } = await supabase
          .from('book_list_items')
          .select(`
            id,
            books:book_id (
              id,
              title,
              author,
              cover_url,
              rating
            )
          `)
          .eq('list_id', id)
          .order('created_at', { ascending: false });

        if (listItemsError) {
          console.error('Ошибка при получении книг из списка:', listItemsError);
        }

        setList({
          ...listData,
          items: listItemsData || []
        });

      } catch (err) {
        console.error('Ошибка при загрузке списка:', err);
        setError('Не удалось загрузить информацию о списке');
      } finally {
        setLoading(false);
      }
    }

    fetchList();
  }, [id]);

  const handleDelete = async () => {
    try {
      if (!list || !isOwner) return;

      // Удаляем список
      const { error } = await supabase
        .from('book_lists')
        .delete()
        .eq('id', list.id);

      if (error) {
        throw error;
      }

      message.success('Список успешно удален!');
      router.push('/lists');

    } catch (error) {
      console.error('Ошибка при удалении списка:', error);
      message.error('Произошла ошибка при удалении списка');
    }
  };

  return (
    <>
      <Head>
        <title>{list ? `${list.title} | Трекер прочитанных книг` : 'Загрузка списка...'}</title>
        <meta name="description" content={list ? list.description : 'Информация о списке книг'} />
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
                <Link href="/lists">Вернуться к спискам</Link>
              </Button>
            </div>
          ) : list ? (
            <>
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                  <div>
                    <Title level={2}>{list.title}</Title>
                    <Space>
                      <Text type="secondary">
                        Создан: {formatDate(list.created_at)}
                      </Text>
                      <Text>
                        <UserOutlined /> {list.users?.username || 'Пользователь'}
                      </Text>
                      {list.is_public && (
                        <Tag color="blue" icon={<ShareAltOutlined />}>
                          Публичный
                        </Tag>
                      )}
                    </Space>
                  </div>

                  {isOwner && (
                    <Space>
                      <Button type="primary" icon={<EditOutlined />}>
                        <Link href={`/lists/edit/${list.id}`}>Редактировать</Link>
                      </Button>
                      <Popconfirm
                        title="Удалить список"
                        description="Вы уверены, что хотите удалить этот список?"
                        onConfirm={handleDelete}
                        okText="Да"
                        cancelText="Нет"
                      >
                        <Button danger icon={<DeleteOutlined />}>
                          Удалить
                        </Button>
                      </Popconfirm>
                    </Space>
                  )}
                </div>

                {list.description && (
                  <Paragraph style={{ marginBottom: 24 }}>
                    {list.description}
                  </Paragraph>
                )}

                <Divider />

                <Title level={4}>Книги в списке ({list.items?.length || 0})</Title>

                {list.items?.length === 0 ? (
                  <Empty description="В этом списке пока нет книг" />
                ) : (
                  <List
                    grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
                    dataSource={list.items}
                    renderItem={(item: any) => (
                      <List.Item>
                        <Card
                          hoverable
                          cover={item.books?.cover_url ? (
                            <img
                              alt={`Обложка ${item.books.title}`}
                              src={item.books.cover_url}
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
                            title={<Link href={`/books/${item.books?.id}`}>{item.books?.title}</Link>}
                            description={
                              <Space direction="vertical">
                                <Text type="secondary">{item.books?.author}</Text>
                                {item.books?.rating && (
                                  <Text>Рейтинг: {item.books.rating}/10</Text>
                                )}
                              </Space>
                            }
                          />
                        </Card>
                      </List.Item>
                    )}
                  />
                )}
              </Card>
            </>
          ) : null}
        </div>
      </Layout>
    </>
  );
}

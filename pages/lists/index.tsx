import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Typography, Button, Card, List, Input, Space, Spin, Empty, Tag, Divider } from 'antd';
import { PlusOutlined, BookOutlined, UserOutlined, ShareAltOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

interface ListsProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function Lists({ isDarkMode, toggleTheme }: ListsProps) {
  const router = useRouter();
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchLists() {
      try {
        setLoading(true);

        // Получаем списки книг
        const { data: listsData, error: listsError } = await supabase
          .from('book_lists')
          .select(`
            id,
            title,
            description,
            created_at,
            is_public,
            users:user_id (id, email),
            book_list_items:book_list_items (
              id,
              books:book_id (id, title, author)
            )
          `)
          .order('created_at', { ascending: false });

        if (listsError) {
          throw listsError;
        }

        setLists(listsData || []);

      } catch (err) {
        console.error('Ошибка при загрузке списков:', err);
        setError('Не удалось загрузить списки книг');
      } finally {
        setLoading(false);
      }
    }

    fetchLists();
  }, []);

  // Фильтрация списков по поисковому запросу
  const filteredLists = lists.filter(list =>
    searchQuery === '' ||
    list.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (list.description && list.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <Head>
        <title>Списки книг | Трекер прочитанных книг</title>
        <meta name="description" content="Списки книг в трекере прочитанных книг" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <Title level={2}>Списки книг</Title>
            <Button type="primary" icon={<PlusOutlined />}>
              <Link href="/lists/create">Создать список</Link>
            </Button>
          </div>

          <Card style={{ marginBottom: 24 }}>
            <Search
              placeholder="Поиск по названию или описанию"
              allowClear
              enterButton
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ maxWidth: 500 }}
            />
          </Card>

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
          ) : filteredLists.length === 0 ? (
            <Empty description="Списки не найдены" />
          ) : (
            <List
              itemLayout="vertical"
              dataSource={filteredLists}
              renderItem={(list) => (
                <List.Item
                  key={list.id}
                  actions={[
                    <Space key="books">
                      <BookOutlined />
                      <Text>{list.book_list_items?.length || 0} книг</Text>
                    </Space>,
                    <Space key="user">
                      <UserOutlined />
                      <Text>{list.users?.email ? list.users.email.split('@')[0] : 'Пользователь'}</Text>
                    </Space>,
                    list.is_public && (
                      <Space key="public">
                        <ShareAltOutlined />
                        <Text>Публичный</Text>
                      </Space>
                    ),
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Link href={`/lists/${list.id}`}>
                        <Title level={4}>{list.title}</Title>
                      </Link>
                    }
                    description={
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Text type="secondary">
                          Создан: {formatDate(list.created_at)}
                        </Text>
                        {list.description && (
                          <Paragraph ellipsis={{ rows: 2 }}>
                            {list.description}
                          </Paragraph>
                        )}
                      </Space>
                    }
                  />
                  {list.book_list_items && list.book_list_items.length > 0 && (
                    <>
                      <Divider style={{ margin: '12px 0' }} />
                      <div>
                        {list.book_list_items.slice(0, 3).map((item: any) => (
                          <Tag key={item.id} style={{ marginBottom: 8 }}>
                            {item.books?.title || 'Неизвестная книга'}
                          </Tag>
                        ))}
                        {list.book_list_items.length > 3 && (
                          <Tag style={{ marginBottom: 8 }}>
                            +{list.book_list_items.length - 3} еще
                          </Tag>
                        )}
                      </div>
                    </>
                  )}
                </List.Item>
              )}
            />
          )}
        </div>
      </Layout>
    </>
  );
}

import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Typography, Row, Col, Card, Input, Select, Button, Space, Spin, Empty, Pagination, Tag, Rate } from 'antd';
import { PlusOutlined, BookOutlined, ReadOutlined, ClockCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

// Типы для книг из Supabase
interface Book {
  id: string | number;
  title: string;
  author: string;
  cover_url?: string;
  rating?: number;
  status?: 'read' | 'reading' | 'want_to_read';
  tags?: string[];
  created_at?: string;
  description?: string;
}

interface BooksProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function Books({ isDarkMode, toggleTheme }: BooksProps) {
  // Состояние для хранения книг
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Состояние для фильтров
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

  // Состояние для пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  // Загрузка книг из Supabase
  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true);

        // Получаем книги из Supabase
        const { data: booksData, error: booksError } = await supabase
          .from('books')
          .select('*');

        if (booksError) {
          throw booksError;
        }

        // Получаем теги для каждой книги
        const booksWithTags = await Promise.all(
          (booksData || []).map(async (book) => {
            // Получаем связи книги с тегами
            const { data: bookTagsData, error: bookTagsError } = await supabase
              .from('book_tags')
              .select('tag_id')
              .eq('book_id', book.id);

            if (bookTagsError) {
              console.error('Ошибка при получении тегов книги:', bookTagsError);
              return { ...book, tags: [] };
            }

            // Получаем информацию о тегах
            const tagIds = bookTagsData?.map(bt => bt.tag_id) || [];

            if (tagIds.length === 0) {
              return { ...book, tags: [] };
            }

            const { data: tagsData, error: tagsError } = await supabase
              .from('tags')
              .select('name')
              .in('id', tagIds);

            if (tagsError) {
              console.error('Ошибка при получении информации о тегах:', tagsError);
              return { ...book, tags: [] };
            }

            const tags = tagsData?.map(tag => tag.name) || [];

            return { ...book, tags };
          })
        );

        setBooks(booksWithTags);

        // Собираем все уникальные теги
        const allTagsSet = new Set<string>();
        booksWithTags.forEach(book => {
          (book.tags || []).forEach(tag => allTagsSet.add(tag));
        });

        setAllTags(Array.from(allTagsSet));

      } catch (err) {
        console.error('Ошибка при загрузке книг:', err);
        setError('Не удалось загрузить книги. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  // Фильтрация книг
  const filteredBooks = books.filter(book => {
    // Фильтр по поисковому запросу
    const matchesSearch = searchQuery === '' ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    // Фильтр по статусу
    const matchesStatus = selectedStatus === null || book.status === selectedStatus;

    // Фильтр по тегу
    const matchesTag = selectedTag === null || (book.tags && book.tags.includes(selectedTag));

    return matchesSearch && matchesStatus && matchesTag;
  });

  // Пагинация
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Обработчик изменения страницы
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

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

  // Функция для получения цвета статуса
  const getStatusColor = (status?: string) => {
    if (!status) return '';

    switch (status) {
      case 'read': return '#52c41a';
      case 'reading': return '#1677ff';
      case 'want_to_read': return '#faad14';
      default: return '';
    }
  };

  return (
    <>
      <Head>
        <title>Каталог книг | Трекер прочитанных книг</title>
        <meta name="description" content="Каталог книг в трекере прочитанных книг" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <Title level={2} style={{ margin: 0 }}>Каталог книг</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              shape="round"
            >
              <Link href="/books/add">Добавить книгу</Link>
            </Button>
          </div>

          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 0',
              background: isDarkMode ? '#1f1f1f' : '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)'
            }}>
              <Spin size="large" />
            </div>
          ) : error ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 0',
              background: isDarkMode ? '#1f1f1f' : '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)'
            }}>
              <Text type="danger" style={{ fontSize: 16 }}>{error}</Text>
            </div>
          ) : (
            <>
              {/* Фильтры */}
              <Card
                style={{
                  marginBottom: 24,
                  borderRadius: '8px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)'
                }}
              >
                <Row gutter={[24, 24]}>
                  <Col xs={24} md={8}>
                    <Search
                      placeholder="Поиск по названию или автору"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      allowClear
                      size="large"
                    />
                  </Col>
                  <Col xs={24} md={8}>
                    <Select
                      placeholder="Выберите статус"
                      style={{ width: '100%' }}
                      value={selectedStatus}
                      onChange={(value) => setSelectedStatus(value)}
                      allowClear
                      size="large"
                      optionLabelProp="label"
                    >
                      <Option value="read" label="Прочитано">
                        <Space>
                          <ReadOutlined style={{ color: '#52c41a' }} />
                          <span>Прочитано</span>
                        </Space>
                      </Option>
                      <Option value="reading" label="Читаю">
                        <Space>
                          <BookOutlined style={{ color: '#1677ff' }} />
                          <span>Читаю</span>
                        </Space>
                      </Option>
                      <Option value="want_to_read" label="Хочу прочитать">
                        <Space>
                          <ClockCircleOutlined style={{ color: '#faad14' }} />
                          <span>Хочу прочитать</span>
                        </Space>
                      </Option>
                    </Select>
                  </Col>
                  <Col xs={24} md={8}>
                    <Select
                      placeholder="Выберите тег"
                      style={{ width: '100%' }}
                      value={selectedTag}
                      onChange={(value) => setSelectedTag(value)}
                      allowClear
                      size="large"
                    >
                      {allTags.map(tag => (
                        <Option key={tag} value={tag}>{tag}</Option>
                      ))}
                    </Select>
                  </Col>
                </Row>
              </Card>

              {/* Список книг */}
              {filteredBooks.length === 0 ? (
                <Empty
                  description="Книги не найдены"
                  style={{
                    margin: '48px 0',
                    padding: '40px',
                    background: isDarkMode ? '#1f1f1f' : '#ffffff',
                    borderRadius: '8px',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)'
                  }}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <>
                  <Row gutter={[24, 24]}>
                    {paginatedBooks.map((book) => (
                      <Col xs={24} sm={12} lg={8} key={book.id}>
                        <Card
                          hoverable
                          style={{
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
                            transition: 'all 0.3s',
                          }}
                          cover={book.cover_url ? (
                            <div style={{ position: 'relative' }}>
                              <img
                                alt={`Обложка ${book.title}`}
                                src={book.cover_url}
                                style={{
                                  height: 200,
                                  objectFit: 'cover',
                                  width: '100%',
                                }}
                              />
                              {book.status && (
                                <Tag
                                  style={{
                                    position: 'absolute',
                                    top: 12,
                                    right: 12,
                                    backgroundColor: getStatusColor(book.status),
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '16px',
                                    padding: '0 8px',
                                  }}
                                >
                                  {getStatusText(book.status)}
                                </Tag>
                              )}
                            </div>
                          ) : (
                            <div style={{
                              height: 200,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: '#f5f5f5',
                              position: 'relative',
                            }}>
                              <BookOutlined style={{ fontSize: 48, opacity: 0.5 }} />
                              {book.status && (
                                <Tag
                                  style={{
                                    position: 'absolute',
                                    top: 12,
                                    right: 12,
                                    backgroundColor: getStatusColor(book.status),
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '16px',
                                    padding: '0 8px',
                                  }}
                                >
                                  {getStatusText(book.status)}
                                </Tag>
                              )}
                            </div>
                          )}
                          actions={[
                            <Button key="details" type="link" icon={<ArrowRightOutlined />}>
                              <Link href={`/books/${book.id}`}>Подробнее</Link>
                            </Button>
                          ]}
                        >
                          <Card.Meta
                            title={<Title level={5} ellipsis={{ rows: 1 }}>{book.title}</Title>}
                            description={
                              <Space direction="vertical" style={{ width: '100%' }}>
                                <Text type="secondary">{book.author}</Text>

                                {book.rating !== undefined && (
                                  <div>
                                    <Rate disabled defaultValue={book.rating / 2} allowHalf />
                                    <Text style={{ marginLeft: 8 }}>{book.rating}/10</Text>
                                  </div>
                                )}

                                {book.tags && book.tags.length > 0 && (
                                  <div>
                                    {book.tags.map(tag => (
                                      <Tag
                                        key={tag}
                                        style={{
                                          marginBottom: 4,
                                          borderRadius: '16px',
                                          padding: '0 8px',
                                        }}
                                      >
                                        {tag}
                                      </Tag>
                                    ))}
                                  </div>
                                )}

                                {book.created_at && (
                                  <Text type="secondary" style={{ fontSize: '12px' }}>
                                    Добавлено: {formatDate(book.created_at)}
                                  </Text>
                                )}
                              </Space>
                            }
                          />
                        </Card>
                      </Col>
                    ))}
                  </Row>

                  {/* Пагинация */}
                  {filteredBooks.length > pageSize && (
                    <div style={{
                      textAlign: 'center',
                      marginTop: 32,
                      padding: '16px',
                      background: isDarkMode ? '#1f1f1f' : '#ffffff',
                      borderRadius: '8px',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)'
                    }}>
                      <Pagination
                        current={currentPage}
                        total={filteredBooks.length}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </Layout>
    </>
  );
}

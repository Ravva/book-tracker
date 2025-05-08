import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Typography, Button, Card, List, Input, Space, Tag, Spin, Empty, Popconfirm, App } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, BookOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const { Title, Text } = Typography;
const { Search } = Input;

interface TagsProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function Tags({ isDarkMode, toggleTheme }: TagsProps) {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [addingTag, setAddingTag] = useState(false);
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [editingTagName, setEditingTagName] = useState('');
  const { message } = App.useApp();

  useEffect(() => {
    fetchTags();
  }, []);

  async function fetchTags() {
    try {
      setLoading(true);

      // Получаем теги с количеством книг
      const { data: tagsData, error: tagsError } = await supabase
        .from('tags')
        .select(`
          id,
          name,
          book_tags:book_tags (
            id,
            book_id
          )
        `)
        .order('name');

      if (tagsError) {
        throw tagsError;
      }

      // Преобразуем данные для отображения
      const formattedTags = tagsData?.map(tag => ({
        id: tag.id,
        name: tag.name,
        bookCount: tag.book_tags?.length || 0
      })) || [];

      setTags(formattedTags);

    } catch (err) {
      console.error('Ошибка при загрузке тегов:', err);
      setError('Не удалось загрузить теги');
    } finally {
      setLoading(false);
    }
  }

  // Фильтрация тегов по поисковому запросу
  const filteredTags = tags.filter(tag =>
    searchQuery === '' ||
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTag = async () => {
    if (!newTagName.trim()) {
      message.error('Название тега не может быть пустым');
      return;
    }

    try {
      setAddingTag(true);

      // Проверяем, существует ли тег с таким именем
      const { data: existingTag, error: checkError } = await supabase
        .from('tags')
        .select('id')
        .eq('name', newTagName.trim())
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existingTag) {
        message.error('Тег с таким названием уже существует');
        return;
      }

      // Добавляем новый тег
      const { data: newTag, error: addError } = await supabase
        .from('tags')
        .insert([{ name: newTagName.trim() }])
        .select();

      if (addError) {
        throw addError;
      }

      message.success('Тег успешно добавлен');
      setNewTagName('');

      // Обновляем список тегов
      fetchTags();

    } catch (error) {
      console.error('Ошибка при добавлении тега:', error);
      message.error('Произошла ошибка при добавлении тега');
    } finally {
      setAddingTag(false);
    }
  };

  const handleEditTag = async (tagId: number) => {
    if (!editingTagName.trim()) {
      message.error('Название тега не может быть пустым');
      return;
    }

    try {
      // Проверяем, существует ли тег с таким именем
      const { data: existingTag, error: checkError } = await supabase
        .from('tags')
        .select('id')
        .eq('name', editingTagName.trim())
        .neq('id', tagId)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existingTag) {
        message.error('Тег с таким названием уже существует');
        return;
      }

      // Обновляем тег
      const { error: updateError } = await supabase
        .from('tags')
        .update({ name: editingTagName.trim() })
        .eq('id', tagId);

      if (updateError) {
        throw updateError;
      }

      message.success('Тег успешно обновлен');
      setEditingTagId(null);
      setEditingTagName('');

      // Обновляем список тегов
      fetchTags();

    } catch (error) {
      console.error('Ошибка при обновлении тега:', error);
      message.error('Произошла ошибка при обновлении тега');
    }
  };

  const handleDeleteTag = async (tagId: number) => {
    try {
      // Удаляем тег
      const { error: deleteError } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId);

      if (deleteError) {
        throw deleteError;
      }

      message.success('Тег успешно удален');

      // Обновляем список тегов
      fetchTags();

    } catch (error) {
      console.error('Ошибка при удалении тега:', error);
      message.error('Произошла ошибка при удалении тега');
    }
  };

  return (
    <>
      <Head>
        <title>Теги | Трекер прочитанных книг</title>
        <meta name="description" content="Управление тегами в трекере прочитанных книг" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
          <Title level={2}>Управление тегами</Title>

          <Card style={{ marginBottom: 24 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Search
                placeholder="Поиск по тегам"
                allowClear
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ maxWidth: 500 }}
              />

              <Space>
                <Input
                  placeholder="Новый тег"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onPressEnter={handleAddTag}
                  style={{ width: 200 }}
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddTag}
                  loading={addingTag}
                >
                  Добавить тег
                </Button>
              </Space>
            </Space>
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
          ) : filteredTags.length === 0 ? (
            <Empty description="Теги не найдены" />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={filteredTags}
              renderItem={(tag) => (
                <List.Item
                  actions={[
                    <Button
                      key="edit"
                      icon={<EditOutlined />}
                      onClick={() => {
                        setEditingTagId(tag.id);
                        setEditingTagName(tag.name);
                      }}
                    >
                      Редактировать
                    </Button>,
                    <Popconfirm
                      key="delete"
                      title="Удалить тег"
                      description="Вы уверены, что хотите удалить этот тег?"
                      onConfirm={() => handleDeleteTag(tag.id)}
                      okText="Да"
                      cancelText="Нет"
                    >
                      <Button danger icon={<DeleteOutlined />}>
                        Удалить
                      </Button>
                    </Popconfirm>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      editingTagId === tag.id ? (
                        <Space>
                          <Input
                            value={editingTagName}
                            onChange={(e) => setEditingTagName(e.target.value)}
                            onPressEnter={() => handleEditTag(tag.id)}
                            style={{ width: 200 }}
                          />
                          <Button
                            type="primary"
                            onClick={() => handleEditTag(tag.id)}
                          >
                            Сохранить
                          </Button>
                          <Button
                            onClick={() => {
                              setEditingTagId(null);
                              setEditingTagName('');
                            }}
                          >
                            Отмена
                          </Button>
                        </Space>
                      ) : (
                        <Link href={`/books?tag=${tag.name}`}>
                          <Tag color="blue" style={{ fontSize: 16, padding: '4px 8px' }}>
                            {tag.name}
                          </Tag>
                        </Link>
                      )
                    }
                    description={
                      <Space>
                        <BookOutlined />
                        <Text>{tag.bookCount} книг</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </div>
      </Layout>
    </>
  );
}

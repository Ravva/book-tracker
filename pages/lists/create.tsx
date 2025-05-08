import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Typography, Form, Input, Button, Card, Select, Switch, App } from 'antd';
import { PlusOutlined, BookOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface CreateListProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function CreateList({ isDarkMode, toggleTheme }: CreateListProps) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      // Получаем текущего пользователя
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        message.error('Пользователь не авторизован');
        return;
      }

      // Создаем список
      const { data: listData, error: listError } = await supabase
        .from('book_lists')
        .insert([
          {
            title: values.title,
            description: values.description,
            is_public: values.is_public,
            user_id: user.id
          }
        ])
        .select();

      if (listError) {
        throw listError;
      }

      const listId = listData?.[0]?.id;

      if (!listId) {
        throw new Error('Не удалось получить ID созданного списка');
      }

      // Добавляем книги в список, если они были выбраны
      if (values.books && values.books.length > 0) {
        const bookItems = values.books.map((bookId: number) => ({
          book_id: bookId,
          list_id: listId
        }));

        const { error: booksError } = await supabase
          .from('book_list_items')
          .insert(bookItems);

        if (booksError) {
          console.error('Ошибка при добавлении книг в список:', booksError);
        }
      }

      message.success('Список успешно создан!');
      router.push(`/lists/${listId}`);

    } catch (error) {
      console.error('Ошибка при создании списка:', error);
      message.error('Произошла ошибка при создании списка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Создание списка | Трекер прочитанных книг</title>
        <meta name="description" content="Создание нового списка книг" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
          <Card>
            <Title level={2}>Создание списка книг</Title>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                is_public: true
              }}
            >
              <Form.Item
                name="title"
                label="Название списка"
                rules={[{ required: true, message: 'Пожалуйста, введите название списка' }]}
              >
                <Input placeholder="Введите название списка" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Описание"
              >
                <TextArea rows={4} placeholder="Введите описание списка" />
              </Form.Item>

              <Form.Item
                name="books"
                label="Книги"
              >
                <Select
                  mode="multiple"
                  placeholder="Выберите книги для добавления в список"
                  style={{ width: '100%' }}
                  loading={loading}
                >
                  {/* Здесь будут опции с книгами из базы данных */}
                </Select>
              </Form.Item>

              <Form.Item
                name="is_public"
                label="Публичный список"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} icon={<PlusOutlined />}>
                  Создать список
                </Button>
                <Button style={{ marginLeft: 8 }}>
                  <Link href="/lists">Отмена</Link>
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </Layout>
    </>
  );
}

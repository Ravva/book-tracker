import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Typography, Form, Input, Button, Card, Select, Upload, Rate, App, Space } from 'antd';
import { UploadOutlined, BookOutlined, PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import type { UploadFile, UploadProps } from 'antd';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface AddBookProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function AddBook({ isDarkMode, toggleTheme }: AddBookProps) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [coverFileList, setCoverFileList] = useState<UploadFile[]>([]);
  const { message } = App.useApp();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      // Создаем запись о книге
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .insert([
          {
            title: values.title,
            author: values.author,
            description: values.description,
            rating: values.rating,
            status: values.status,
          }
        ])
        .select();

      if (bookError) {
        throw bookError;
      }

      const bookId = bookData?.[0]?.id;

      if (!bookId) {
        throw new Error('Не удалось получить ID созданной книги');
      }

      // Добавляем теги
      if (values.tags && values.tags.length > 0) {
        for (const tag of values.tags) {
          // Проверяем, существует ли тег
          const { data: existingTag, error: tagError } = await supabase
            .from('tags')
            .select('id')
            .eq('name', tag)
            .single();

          let tagId;

          if (tagError || !existingTag) {
            // Создаем новый тег
            const { data: newTag, error: newTagError } = await supabase
              .from('tags')
              .insert([{ name: tag }])
              .select();

            if (newTagError) {
              console.error('Ошибка при создании тега:', newTagError);
              continue;
            }

            tagId = newTag?.[0]?.id;
          } else {
            tagId = existingTag.id;
          }

          // Связываем книгу с тегом
          if (tagId) {
            await supabase
              .from('book_tags')
              .insert([{ book_id: bookId, tag_id: tagId }]);
          }
        }
      }

      // Загружаем обложку, если она есть
      if (coverFileList.length > 0) {
        const coverFile = coverFileList[0].originFileObj;
        if (coverFile) {
          const coverFileName = `${bookId}_cover_${Date.now()}`;
          const { error: uploadError } = await supabase.storage
            .from('covers')
            .upload(coverFileName, coverFile);

          if (uploadError) {
            console.error('Ошибка при загрузке обложки:', uploadError);
          } else {
            // Получаем URL обложки
            const { data: coverUrl } = supabase.storage
              .from('covers')
              .getPublicUrl(coverFileName);

            // Обновляем запись о книге с URL обложки
            await supabase
              .from('books')
              .update({ cover_url: coverUrl.publicUrl })
              .eq('id', bookId);
          }
        }
      }

      // Загружаем файл книги, если он есть
      if (fileList.length > 0) {
        const bookFile = fileList[0].originFileObj;
        if (bookFile) {
          const bookFileName = `${bookId}_${Date.now()}`;
          const { error: uploadError } = await supabase.storage
            .from('books')
            .upload(bookFileName, bookFile);

          if (uploadError) {
            console.error('Ошибка при загрузке файла книги:', uploadError);
          } else {
            // Получаем URL файла
            const { data: fileUrl } = supabase.storage
              .from('books')
              .getPublicUrl(bookFileName);

            // Обновляем запись о книге с URL файла
            await supabase
              .from('books')
              .update({ file_url: fileUrl.publicUrl })
              .eq('id', bookId);
          }
        }
      }

      message.success('Книга успешно добавлена!');
      router.push(`/books/${bookId}`);

    } catch (error) {
      console.error('Ошибка при добавлении книги:', error);
      message.error('Произошла ошибка при добавлении книги');
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (file: File) => {
    // Проверка типа файла
    const isValidType = file.type === 'application/epub+zip' ||
                        file.type === 'application/x-fictionbook+xml' ||
                        file.name.endsWith('.fb2') ||
                        file.name.endsWith('.zip');

    if (!isValidType) {
      message.error('Поддерживаются только файлы FB2 и ZIP!');
    }

    // Проверка размера файла (20MB)
    const isLessThan20MB = file.size / 1024 / 1024 < 20;
    if (!isLessThan20MB) {
      message.error('Размер файла не должен превышать 20MB!');
    }

    return isValidType && isLessThan20MB;
  };

  const beforeUploadCover = (file: File) => {
    // Проверка типа файла
    const isValidType = file.type === 'image/jpeg' ||
                        file.type === 'image/png' ||
                        file.type === 'image/webp';

    if (!isValidType) {
      message.error('Поддерживаются только изображения JPG, PNG и WEBP!');
    }

    // Проверка размера файла (5MB)
    const isLessThan5MB = file.size / 1024 / 1024 < 5;
    if (!isLessThan5MB) {
      message.error('Размер изображения не должен превышать 5MB!');
    }

    return isValidType && isLessThan5MB;
  };

  return (
    <>
      <Head>
        <title>Добавление книги | Трекер прочитанных книг</title>
        <meta name="description" content="Добавление новой книги в трекер" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
          <Card>
            <Title level={2}>Добавление книги</Title>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                status: 'want_to_read',
                rating: 0,
              }}
            >
              <Form.Item
                name="title"
                label="Название книги"
                rules={[{ required: true, message: 'Пожалуйста, введите название книги' }]}
              >
                <Input placeholder="Введите название книги" />
              </Form.Item>

              <Form.Item
                name="author"
                label="Автор"
                rules={[{ required: true, message: 'Пожалуйста, введите автора книги' }]}
              >
                <Input placeholder="Введите автора книги" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Описание"
              >
                <TextArea rows={4} placeholder="Введите описание книги" />
              </Form.Item>

              <Form.Item
                name="status"
                label="Статус"
                rules={[{ required: true, message: 'Пожалуйста, выберите статус' }]}
              >
                <Select placeholder="Выберите статус">
                  <Option value="read">Прочитано</Option>
                  <Option value="reading">Читаю</Option>
                  <Option value="want_to_read">Хочу прочитать</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="rating"
                label="Рейтинг"
              >
                <Rate count={10} />
              </Form.Item>

              <Form.Item
                name="tags"
                label="Теги"
              >
                <Select
                  mode="tags"
                  placeholder="Добавьте теги"
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item
                name="cover"
                label="Обложка"
              >
                <Upload
                  listType="picture"
                  fileList={coverFileList}
                  beforeUpload={beforeUploadCover}
                  onChange={({ fileList }) => setCoverFileList(fileList)}
                  maxCount={1}
                  accept="image/jpeg,image/png,image/webp"
                >
                  <Button icon={<UploadOutlined />}>Загрузить обложку</Button>
                </Upload>
              </Form.Item>

              <Form.Item
                name="file"
                label="Файл книги (FB2, ZIP до 20 МБ)"
              >
                <Upload
                  fileList={fileList}
                  beforeUpload={beforeUpload}
                  onChange={({ fileList }) => setFileList(fileList)}
                  maxCount={1}
                  accept=".fb2,.zip"
                >
                  <Button icon={<UploadOutlined />}>Загрузить файл</Button>
                </Upload>
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Добавить книгу
                  </Button>
                  <Button>
                    <Link href="/books">Отмена</Link>
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </Layout>
    </>
  );
}

import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Typography, Form, Input, Button, Card, Upload, Tabs, Space, Switch, Divider, Spin, Empty, App } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, UploadOutlined, SaveOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import type { UploadFile } from 'antd';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface SettingsProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function Settings({ isDarkMode, toggleTheme }: SettingsProps) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<UploadFile[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { message } = App.useApp();

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoadingUser(true);

        // Получаем текущего пользователя
        const { data: { user: currentUser } } = await supabase.auth.getUser();

        if (!currentUser) {
          setError('Пользователь не авторизован');
          setLoadingUser(false);
          return;
        }

        // Получаем профиль пользователя
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        if (profileError) {
          console.error('Ошибка при получении профиля:', profileError);
        }

        setUser({
          ...currentUser,
          profile: profileData || {}
        });

        if (profileData?.avatar_url) {
          setAvatarUrl(profileData.avatar_url);
        }

        // Заполняем форму данными пользователя
        form.setFieldsValue({
          email: currentUser.email,
          username: profileData?.username || '',
          bio: profileData?.bio || '',
          website: profileData?.website || '',
          notifications_enabled: profileData?.notifications_enabled || false
        });

      } catch (err) {
        console.error('Ошибка при загрузке данных пользователя:', err);
        setError('Не удалось загрузить данные пользователя');
      } finally {
        setLoadingUser(false);
      }
    }

    fetchUserData();
  }, [form]);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      if (!user) {
        message.error('Пользователь не авторизован');
        return;
      }

      // Обновляем профиль пользователя
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username: values.username,
          bio: values.bio,
          website: values.website,
          notifications_enabled: values.notifications_enabled
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Загружаем аватар, если он был изменен
      if (avatarFile.length > 0 && avatarFile[0].originFileObj) {
        const file = avatarFile[0].originFileObj;
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Ошибка при загрузке аватара:', uploadError);
        } else {
          // Получаем URL аватара
          const { data: avatarData } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

          // Обновляем URL аватара в профиле
          await supabase
            .from('profiles')
            .update({ avatar_url: avatarData.publicUrl })
            .eq('id', user.id);

          setAvatarUrl(avatarData.publicUrl);
        }
      }

      message.success('Профиль успешно обновлен!');

    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      message.error('Произошла ошибка при обновлении профиля');
    } finally {
      setLoading(false);
    }
  };

  const onPasswordChange = async (values: any) => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: values.newPassword
      });

      if (error) {
        throw error;
      }

      message.success('Пароль успешно изменен!');
      passwordForm.resetFields();

    } catch (error) {
      console.error('Ошибка при изменении пароля:', error);
      message.error('Произошла ошибка при изменении пароля');
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Вы можете загрузить только JPG/PNG файл!');
    }
    const isLessThan2MB = file.size / 1024 / 1024 < 2;
    if (!isLessThan2MB) {
      message.error('Изображение должно быть меньше 2MB!');
    }
    return isJpgOrPng && isLessThan2MB;
  };

  return (
    <>
      <Head>
        <title>Настройки профиля | Трекер прочитанных книг</title>
        <meta name="description" content="Настройки профиля в трекере прочитанных книг" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
          <Title level={2}>Настройки профиля</Title>

          {loadingUser ? (
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
                <Link href="/auth/signin">Войти</Link>
              </Button>
            </div>
          ) : user ? (
            <Tabs defaultActiveKey="profile">
              <TabPane tab="Профиль" key="profile">
                <Card>
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                  >
                    <Form.Item label="Аватар">
                      <Space align="start">
                        {avatarUrl && (
                          <img
                            src={avatarUrl}
                            alt="Аватар"
                            style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '50%' }}
                          />
                        )}
                        <Upload
                          listType="picture"
                          fileList={avatarFile}
                          beforeUpload={beforeUpload}
                          onChange={({ fileList }) => setAvatarFile(fileList)}
                          maxCount={1}
                          accept="image/jpeg,image/png"
                        >
                          <Button icon={<UploadOutlined />}>Загрузить аватар</Button>
                        </Upload>
                      </Space>
                    </Form.Item>

                    <Form.Item
                      name="email"
                      label="Email"
                    >
                      <Input prefix={<MailOutlined />} disabled />
                    </Form.Item>

                    <Form.Item
                      name="username"
                      label="Имя пользователя"
                      rules={[{ required: true, message: 'Пожалуйста, введите имя пользователя' }]}
                    >
                      <Input prefix={<UserOutlined />} placeholder="Имя пользователя" />
                    </Form.Item>

                    <Form.Item
                      name="bio"
                      label="О себе"
                    >
                      <Input.TextArea rows={4} placeholder="Расскажите о себе" />
                    </Form.Item>

                    <Form.Item
                      name="website"
                      label="Веб-сайт"
                    >
                      <Input placeholder="https://example.com" />
                    </Form.Item>

                    <Form.Item
                      name="notifications_enabled"
                      label="Уведомления"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>

                    <Form.Item>
                      <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                        Сохранить изменения
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </TabPane>

              <TabPane tab="Безопасность" key="security">
                <Card>
                  <Title level={4}>Изменение пароля</Title>
                  <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={onPasswordChange}
                  >
                    <Form.Item
                      name="newPassword"
                      label="Новый пароль"
                      rules={[
                        { required: true, message: 'Пожалуйста, введите новый пароль' },
                        { min: 6, message: 'Пароль должен быть не менее 6 символов' }
                      ]}
                    >
                      <Input.Password prefix={<LockOutlined />} placeholder="Новый пароль" />
                    </Form.Item>

                    <Form.Item
                      name="confirmPassword"
                      label="Подтверждение пароля"
                      dependencies={['newPassword']}
                      rules={[
                        { required: true, message: 'Пожалуйста, подтвердите пароль' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Пароли не совпадают'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password prefix={<LockOutlined />} placeholder="Подтверждение пароля" />
                    </Form.Item>

                    <Form.Item>
                      <Button type="primary" htmlType="submit" loading={loading}>
                        Изменить пароль
                      </Button>
                    </Form.Item>
                  </Form>

                  <Divider />

                  <Title level={4}>Удаление аккаунта</Title>
                  <Paragraph>
                    Удаление аккаунта приведет к безвозвратной потере всех ваших данных.
                  </Paragraph>
                  <Button danger>
                    Удалить аккаунт
                  </Button>
                </Card>
              </TabPane>
            </Tabs>
          ) : null}
        </div>
      </Layout>
    </>
  );
}

import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Typography, Form, Input, Button, Card, Divider, Space, App, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, GithubOutlined, GoogleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

const { Title, Text, Paragraph } = Typography;

interface SignUpProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function SignUp({ isDarkMode, toggleTheme }: SignUpProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  const onFinish = async (values: { email: string; password: string; username: string }) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            username: values.username,
          },
        },
      });

      if (error) {
        message.error(error.message);
        return;
      }

      message.success('Регистрация успешна! Проверьте вашу почту для подтверждения аккаунта.');
      router.push('/auth/signin');
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      message.error('Произошла ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  const signUpWithGithub = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
      });

      if (error) {
        message.error(error.message);
      }
    } catch (error) {
      console.error('Ошибка при входе через GitHub:', error);
      message.error('Произошла ошибка при входе через GitHub');
    } finally {
      setLoading(false);
    }
  };

  const signUpWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        message.error(error.message);
      }
    } catch (error) {
      console.error('Ошибка при входе через Google:', error);
      message.error('Произошла ошибка при входе через Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Регистрация | Трекер прочитанных книг</title>
        <meta name="description" content="Регистрация в трекере прочитанных книг" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
        <div style={{ maxWidth: 400, margin: '48px auto', padding: '0 16px' }}>
          <Card>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
              Регистрация
            </Title>

            <Form
              name="signup"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              layout="vertical"
            >
              <Form.Item
                name="username"
                label="Имя пользователя"
                rules={[{ required: true, message: 'Пожалуйста, введите имя пользователя' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Имя пользователя" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Пожалуйста, введите email' },
                  { type: 'email', message: 'Пожалуйста, введите корректный email' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Пароль"
                rules={[
                  { required: true, message: 'Пожалуйста, введите пароль' },
                  { min: 6, message: 'Пароль должен быть не менее 6 символов' }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
              </Form.Item>

              <Form.Item
                name="confirm"
                label="Подтверждение пароля"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Пожалуйста, подтвердите пароль' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Пароли не совпадают'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Подтверждение пароля" />
              </Form.Item>

              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject(new Error('Необходимо принять условия')),
                  },
                ]}
              >
                <Checkbox>
                  Я согласен с <a href="#">условиями использования</a>
                </Checkbox>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Зарегистрироваться
                </Button>
              </Form.Item>
            </Form>

            <Divider>или</Divider>

            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                icon={<GithubOutlined />}
                onClick={signUpWithGithub}
                loading={loading}
                block
              >
                Регистрация через GitHub
              </Button>
              <Button
                icon={<GoogleOutlined />}
                onClick={signUpWithGoogle}
                loading={loading}
                block
              >
                Регистрация через Google
              </Button>
            </Space>

            <Paragraph style={{ marginTop: 24, textAlign: 'center' }}>
              <Text>Уже есть аккаунт? </Text>
              <Link href="/auth/signin">
                <Text type="primary">Войти</Text>
              </Link>
            </Paragraph>
          </Card>
        </div>
      </Layout>
    </>
  );
}

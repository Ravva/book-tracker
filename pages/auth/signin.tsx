import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Typography, Form, Input, Button, Card, Divider, Space, App } from 'antd';
import { UserOutlined, LockOutlined, GithubOutlined, GoogleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

const { Title, Text, Paragraph } = Typography;

interface SignInProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function SignIn({ isDarkMode, toggleTheme }: SignInProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        message.error(error.message);
        return;
      }

      message.success('Вход выполнен успешно!');
      router.push('/');
    } catch (error) {
      console.error('Ошибка при входе:', error);
      message.error('Произошла ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGithub = async () => {
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

  const signInWithGoogle = async () => {
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
        <title>Вход | Трекер прочитанных книг</title>
        <meta name="description" content="Вход в аккаунт трекера прочитанных книг" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
        <div style={{ maxWidth: 400, margin: '48px auto', padding: '0 16px' }}>
          <Card>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
              Вход в аккаунт
            </Title>

            <Form
              name="signin"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              layout="vertical"
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Пожалуйста, введите email' },
                  { type: 'email', message: 'Пожалуйста, введите корректный email' }
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Email" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Пароль"
                rules={[{ required: true, message: 'Пожалуйста, введите пароль' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Войти
                </Button>
              </Form.Item>
            </Form>

            <Divider>или</Divider>

            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                icon={<GithubOutlined />}
                onClick={signInWithGithub}
                loading={loading}
                block
              >
                Войти через GitHub
              </Button>
              <Button
                icon={<GoogleOutlined />}
                onClick={signInWithGoogle}
                loading={loading}
                block
              >
                Войти через Google
              </Button>
            </Space>

            <Paragraph style={{ marginTop: 24, textAlign: 'center' }}>
              <Text>Еще нет аккаунта? </Text>
              <Link href="/auth/signup">
                <Text type="primary">Зарегистрироваться</Text>
              </Link>
            </Paragraph>
          </Card>
        </div>
      </Layout>
    </>
  );
}

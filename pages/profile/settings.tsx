import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ProfileSettings() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // В реальном приложении данные будут загружаться из Supabase
  const [formData, setFormData] = useState({
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Обработка изменений в форме
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Обработка отправки формы профиля
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // В реальном приложении здесь будет отправка данных в Supabase
      console.log('Отправка данных профиля:', { name: formData.name, email: formData.email });
      
      // Имитация задержки запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Профиль успешно обновлен');
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Обработка отправки формы пароля
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Новый пароль и подтверждение не совпадают');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // В реальном приложении здесь будет отправка данных в Supabase
      console.log('Отправка данных пароля');
      
      // Имитация задержки запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Сброс полей пароля
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      
      alert('Пароль успешно обновлен');
    } catch (error) {
      console.error('Ошибка при обновлении пароля:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Настройки профиля | Трекер прочитанных книг</title>
        <meta name="description" content="Настройки профиля в трекере прочитанных книг" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center mb-6">
            <Button variant="outline" size="sm" onClick={() => router.back()} className="mr-4">
              Назад
            </Button>
            <h1 className="text-3xl font-bold">Настройки профиля</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Настройки профиля */}
            <Card>
              <CardHeader>
                <CardTitle>Основная информация</CardTitle>
                <CardDescription>Обновите свои личные данные</CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileSubmit}>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Имя</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
            
            {/* Изменение пароля */}
            <Card>
              <CardHeader>
                <CardTitle>Изменение пароля</CardTitle>
                <CardDescription>Обновите свой пароль</CardDescription>
              </CardHeader>
              <form onSubmit={handlePasswordSubmit}>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="currentPassword">Текущий пароль</Label>
                    <Input 
                      id="currentPassword" 
                      name="currentPassword" 
                      type="password" 
                      value={formData.currentPassword} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">Новый пароль</Label>
                    <Input 
                      id="newPassword" 
                      name="newPassword" 
                      type="password" 
                      value={formData.newPassword} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      type="password" 
                      value={formData.confirmPassword} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Обновление...' : 'Обновить пароль'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
            
            {/* Удаление аккаунта */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Удаление аккаунта</CardTitle>
                <CardDescription>Удаление аккаунта приведет к потере всех данных</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Это действие необратимо. После удаления аккаунта все ваши данные, включая списки книг, комментарии и рейтинги, будут удалены.
                </p>
                <Button variant="destructive">
                  Удалить аккаунт
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </>
  );
}

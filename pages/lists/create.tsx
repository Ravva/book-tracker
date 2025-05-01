import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function CreateList() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Состояние формы
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: true,
  });

  // Обработка изменений в форме
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Обработка изменения чекбокса
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Обработка отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // В реальном приложении здесь будет отправка данных в Supabase
      console.log('Отправка данных:', formData);
      
      // Имитация задержки запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Перенаправление на страницу списков
      router.push('/lists');
    } catch (error) {
      console.error('Ошибка при создании списка:', error);
    } finally {
      setIsSubmitting(false);
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
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center mb-6">
            <Button variant="outline" size="sm" onClick={() => router.back()} className="mr-4">
              Назад
            </Button>
            <h1 className="text-3xl font-bold">Создание списка книг</h1>
          </div>
          
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Новый список</CardTitle>
              <CardDescription>Создайте новый список для организации ваших книг</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Название списка *</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Описание</Label>
                  <textarea 
                    id="description" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="isPublic" 
                    name="isPublic" 
                    checked={formData.isPublic} 
                    onChange={handleCheckboxChange} 
                    className="rounded border-input h-4 w-4"
                  />
                  <Label htmlFor="isPublic">Публичный список (виден всем пользователям)</Label>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.back()}
                >
                  Отмена
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Создание...' : 'Создать список'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </Layout>
    </>
  );
}

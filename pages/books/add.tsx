import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AddBook() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Состояние формы
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    status: 'want_to_read',
    rating: '',
    tags: '',
  });

  // Обработка изменений в форме
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      
      // Перенаправление на страницу книг
      router.push('/books');
    } catch (error) {
      console.error('Ошибка при добавлении книги:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Добавление книги | Трекер прочитанных книг</title>
        <meta name="description" content="Добавление новой книги в трекер" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-6">Добавление книги</h1>
          
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Информация о книге</CardTitle>
              <CardDescription>Заполните информацию о книге, которую хотите добавить</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Название книги *</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="author">Автор *</Label>
                  <Input 
                    id="author" 
                    name="author" 
                    value={formData.author} 
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
                
                <div className="grid gap-2">
                  <Label htmlFor="status">Статус *</Label>
                  <select 
                    id="status" 
                    name="status" 
                    value={formData.status} 
                    onChange={handleChange}
                    className="w-full p-2 border border-input rounded-md bg-background"
                    required
                  >
                    <option value="read">Прочитано</option>
                    <option value="reading">Читаю</option>
                    <option value="want_to_read">Хочу прочитать</option>
                  </select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="rating">Рейтинг (1-10)</Label>
                  <Input 
                    id="rating" 
                    name="rating" 
                    type="number" 
                    min="1" 
                    max="10" 
                    value={formData.rating} 
                    onChange={handleChange} 
                  />
                  <p className="text-xs text-muted-foreground">Оставьте пустым, если не хотите ставить оценку</p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="tags">Теги</Label>
                  <Input 
                    id="tags" 
                    name="tags" 
                    value={formData.tags} 
                    onChange={handleChange} 
                    placeholder="Введите теги через запятую" 
                  />
                  <p className="text-xs text-muted-foreground">Например: Фантастика, Приключения, Роман</p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="cover">Обложка</Label>
                  <Input 
                    id="cover" 
                    name="cover" 
                    type="file" 
                    accept="image/*" 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="file">Файл книги (fb2, zip, до 20 МБ)</Label>
                  <Input 
                    id="file" 
                    name="file" 
                    type="file" 
                    accept=".fb2,.zip" 
                  />
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
                  {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </Layout>
    </>
  );
}

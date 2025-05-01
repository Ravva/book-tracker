import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';

// Типы для книги и комментариев
interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  cover?: string;
  file?: string;
  rating?: number;
  status: 'read' | 'reading' | 'want_to_read';
  tags: string[];
  viewCount: number;
  downloadCount: number;
  likeCount: number;
}

interface Comment {
  id: number;
  userId: number;
  userName: string;
  content: string;
  createdAt: string;
}

export default function BookDetails() {
  const router = useRouter();
  const { id } = router.query;
  
  // В реальном приложении данные будут загружаться из Supabase
  const [book, setBook] = useState<Book>({
    id: Number(id) || 1,
    title: 'Мастер и Маргарита',
    author: 'Михаил Булгаков',
    description: 'Роман Михаила Афанасьевича Булгакова, работа над которым началась в конце 1920-х годов и продолжалась вплоть до смерти писателя. Роман относится к незавершённым произведениям; редактирование и сведение воедино черновых записей производилось уже после смерти Булгакова.',
    cover: '/placeholder-cover.jpg',
    file: '/placeholder-file.fb2',
    rating: 9.5,
    status: 'reading',
    tags: ['Классика', 'Фантастика', 'Сатира'],
    viewCount: 1245,
    downloadCount: 567,
    likeCount: 890
  });
  
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      userId: 1,
      userName: 'Иван Иванов',
      content: 'Одна из лучших книг, которые я когда-либо читал. Глубокий смысл, интересный сюжет, яркие персонажи.',
      createdAt: '2023-05-15T14:30:00Z'
    },
    {
      id: 2,
      userId: 2,
      userName: 'Мария Петрова',
      content: 'Перечитываю уже третий раз, и каждый раз нахожу что-то новое. Настоящая классика!',
      createdAt: '2023-06-20T09:15:00Z'
    }
  ]);
  
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  
  // Функция для отображения статуса на русском
  const getStatusText = (status: string) => {
    switch (status) {
      case 'read': return 'Прочитано';
      case 'reading': return 'Читаю';
      case 'want_to_read': return 'Хочу прочитать';
      default: return status;
    }
  };
  
  // Обработка добавления комментария
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: comments.length + 1,
      userId: 3, // В реальном приложении будет ID текущего пользователя
      userName: 'Текущий пользователь', // В реальном приложении будет имя текущего пользователя
      content: newComment,
      createdAt: new Date().toISOString()
    };
    
    setComments([...comments, comment]);
    setNewComment('');
  };
  
  // Обработка лайка
  const handleLike = () => {
    setIsLiked(!isLiked);
    setBook(prev => ({
      ...prev,
      likeCount: isLiked ? prev.likeCount - 1 : prev.likeCount + 1
    }));
  };
  
  // Обработка скачивания
  const handleDownload = () => {
    // В реальном приложении здесь будет логика скачивания файла
    setBook(prev => ({
      ...prev,
      downloadCount: prev.downloadCount + 1
    }));
    alert('Скачивание файла...');
  };
  
  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Head>
        <title>{book.title} | Трекер прочитанных книг</title>
        <meta name="description" content={`${book.title} - ${book.author}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="mb-6">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              Назад
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* Обложка и основная информация */}
            <div className="md:col-span-1">
              <div className="bg-muted rounded-lg overflow-hidden mb-4 aspect-[2/3] flex items-center justify-center">
                {book.cover ? (
                  <img 
                    src={book.cover} 
                    alt={`Обложка ${book.title}`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-muted-foreground">Нет обложки</div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Button 
                    variant={isLiked ? "default" : "outline"} 
                    size="sm"
                    onClick={handleLike}
                  >
                    {isLiked ? 'Понравилось' : 'Нравится'} ({book.likeCount})
                  </Button>
                  
                  {book.file && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleDownload}
                    >
                      Скачать ({book.downloadCount})
                    </Button>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Просмотров: {book.viewCount}
                </div>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {book.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 bg-muted text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Детали книги */}
            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
              <h2 className="text-xl text-muted-foreground mb-4">{book.author}</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm font-medium">Статус</div>
                  <div>{getStatusText(book.status)}</div>
                </div>
                
                {book.rating && (
                  <div>
                    <div className="text-sm font-medium">Рейтинг</div>
                    <div>{book.rating}/10</div>
                  </div>
                )}
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-2">Описание</h3>
                <p className="text-muted-foreground">{book.description}</p>
              </div>
              
              {/* Комментарии */}
              <Card>
                <CardHeader>
                  <CardTitle>Комментарии ({comments.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    {comments.map(comment => (
                      <div key={comment.id} className="border-b border-border pb-4">
                        <div className="flex justify-between mb-1">
                          <div className="font-medium">{comment.userName}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </div>
                        </div>
                        <p>{comment.content}</p>
                      </div>
                    ))}
                    
                    {comments.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        Нет комментариев
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <textarea 
                      className="w-full min-h-[100px] p-2 border border-input rounded-md bg-background"
                      placeholder="Добавьте комментарий..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button 
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                    >
                      Отправить
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Похожие книги */}
          <Card>
            <CardHeader>
              <CardTitle>Похожие книги</CardTitle>
              <CardDescription>Книги с похожими тегами</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="border border-border rounded-lg p-4">
                    <div className="font-medium mb-1">Книга {i}</div>
                    <div className="text-sm text-muted-foreground mb-2">Автор {i}</div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/books/${i}`}>Подробнее</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </>
  );
}

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface BookCardProps {
  id: number | string;
  title: string;
  author: string;
  cover?: string;
  rating?: number;
  status?: 'read' | 'reading' | 'want_to_read';
  tags?: string[];
}

export default function BookCard({ id, title, author, cover, rating, status, tags }: BookCardProps) {
  // Функция для отображения статуса на русском
  const getStatusText = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case 'read': return 'Прочитано';
      case 'reading': return 'Читаю';
      case 'want_to_read': return 'Хочу прочитать';
      default: return status;
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="h-40 bg-muted flex items-center justify-center">
        {cover ? (
          <img 
            src={cover} 
            alt={`Обложка ${title}`} 
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-muted-foreground">Нет обложки</div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{author}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        {status && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">Статус:</span>
            <span className="text-sm">{getStatusText(status)}</span>
          </div>
        )}
        {rating !== undefined && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">Рейтинг:</span>
            <span className="text-sm">{rating}/10</span>
          </div>
        )}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map(tag => (
              <span 
                key={tag} 
                className="px-2 py-1 bg-muted text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/books/${id}`}>Подробнее</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

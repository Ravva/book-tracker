import React from 'react';
import { Card, Typography, Tag, Rate, Button, Space } from 'antd';
import { BookOutlined, ReadOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

const { Meta } = Card;
const { Text, Title } = Typography;

interface BookCardProps {
  id: number | string;
  title: string;
  author: string;
  cover?: string;
  rating?: number;
  status?: 'read' | 'reading' | 'want_to_read';
  tags?: string[];
  created_at?: string;
}

export default function BookCard({ 
  id, 
  title, 
  author, 
  cover, 
  rating, 
  status, 
  tags,
  created_at
}: BookCardProps) {
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

  // Функция для получения иконки статуса
  const getStatusIcon = (status?: string) => {
    if (!status) return null;

    switch (status) {
      case 'read': return <ReadOutlined />;
      case 'reading': return <BookOutlined />;
      case 'want_to_read': return <ClockCircleOutlined />;
      default: return null;
    }
  };

  // Преобразование рейтинга из 10-балльной шкалы в 5-балльную для Rate
  const normalizedRating = rating ? rating / 2 : 0;

  return (
    <Card
      hoverable
      cover={cover ? (
        <img
          alt={`Обложка ${title}`}
          src={cover}
          style={{ height: 200, objectFit: 'cover' }}
        />
      ) : (
        <div style={{ 
          height: 200, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#f0f0f0'
        }}>
          <BookOutlined style={{ fontSize: 48, opacity: 0.5 }} />
        </div>
      )}
      actions={[
        <Button key="details" type="link">
          <Link href={`/books/${id}`}>Подробнее</Link>
        </Button>
      ]}
    >
      <Meta
        title={<Title level={5} ellipsis={{ rows: 1 }}>{title}</Title>}
        description={
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text type="secondary">{author}</Text>
            
            {status && (
              <Text>
                {getStatusIcon(status)} {getStatusText(status)}
              </Text>
            )}
            
            {rating !== undefined && (
              <div>
                <Rate disabled defaultValue={normalizedRating} allowHalf />
                <Text style={{ marginLeft: 8 }}>{rating}/10</Text>
              </div>
            )}
            
            {tags && tags.length > 0 && (
              <div>
                {tags.map(tag => (
                  <Tag key={tag} style={{ marginBottom: 4 }}>{tag}</Tag>
                ))}
              </div>
            )}
            
            {created_at && (
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Добавлено: {formatDate(created_at)}
              </Text>
            )}
          </Space>
        }
      />
    </Card>
  );
}

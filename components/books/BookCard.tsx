import React from 'react';
import { Card, Typography, Tag, Rate, Button, Space, Badge } from 'antd';
import { BookOutlined, ReadOutlined, ClockCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
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

  // Функция для получения цвета статуса
  const getStatusColor = (status?: string) => {
    if (!status) return '';

    switch (status) {
      case 'read': return '#52c41a';
      case 'reading': return '#1677ff';
      case 'want_to_read': return '#faad14';
      default: return '';
    }
  };

  // Преобразование рейтинга из 10-балльной шкалы в 5-балльную для Rate
  const normalizedRating = rating ? rating / 2 : 0;

  return (
    <Card
      hoverable
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s',
      }}
      cover={cover ? (
        <div style={{ position: 'relative' }}>
          <img
            alt={`Обложка ${title}`}
            src={cover}
            style={{
              height: 200,
              objectFit: 'cover',
              width: '100%',
            }}
          />
          {status && (
            <Badge
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                backgroundColor: getStatusColor(status),
              }}
              count={getStatusText(status)}
            />
          )}
        </div>
      ) : (
        <div style={{
          height: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f5',
          position: 'relative',
        }}>
          <BookOutlined style={{ fontSize: 48, opacity: 0.5 }} />
          {status && (
            <Badge
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                backgroundColor: getStatusColor(status),
              }}
              count={getStatusText(status)}
            />
          )}
        </div>
      )}
      actions={[
        <Button key="details" type="link" icon={<ArrowRightOutlined />}>
          <Link href={`/books/${id}`}>Подробнее</Link>
        </Button>
      ]}
    >
      <Meta
        title={<Title level={5} ellipsis={{ rows: 1 }}>{title}</Title>}
        description={
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text type="secondary">{author}</Text>

            {rating !== undefined && (
              <div>
                <Rate disabled defaultValue={normalizedRating} allowHalf />
                <Text style={{ marginLeft: 8 }}>{rating}/10</Text>
              </div>
            )}

            {tags && tags.length > 0 && (
              <div>
                {tags.map(tag => (
                  <Tag
                    key={tag}
                    style={{
                      marginBottom: 4,
                      borderRadius: '16px',
                      padding: '0 8px',
                    }}
                  >
                    {tag}
                  </Tag>
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

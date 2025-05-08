import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
import type { Database } from '../lib/database.types';

// Загружаем переменные окружения из .env.local
dotenv.config({ path: '.env.local' });

// Получаем URL и ключ из переменных окружения
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Ошибка: Не найдены переменные окружения NEXT_PUBLIC_SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Создаем клиент Supabase с сервисным ключом
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

async function fetchData() {
  try {
    console.log('Получение данных из Supabase...');

    // Создаем объект для хранения данных
    const data: Record<string, any> = {};

    // Получаем данные из таблицы books
    console.log('Получение данных из таблицы books...');
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('*');

    if (booksError) {
      console.error('Ошибка при получении данных из таблицы books:', booksError);
    } else {
      data.books = books;
      console.log(`Получено ${books?.length || 0} записей из таблицы books`);
    }

    // Получаем данные из таблицы tags
    console.log('Получение данных из таблицы tags...');
    const { data: tags, error: tagsError } = await supabase
      .from('tags')
      .select('*');

    if (tagsError) {
      console.error('Ошибка при получении данных из таблицы tags:', tagsError);
    } else {
      data.tags = tags;
      console.log(`Получено ${tags?.length || 0} записей из таблицы tags`);
    }

    // Получаем данные из таблицы book_tags
    console.log('Получение данных из таблицы book_tags...');
    const { data: bookTags, error: bookTagsError } = await supabase
      .from('book_tags')
      .select('*');

    if (bookTagsError) {
      console.error('Ошибка при получении данных из таблицы book_tags:', bookTagsError);
    } else {
      data.book_tags = bookTags;
      console.log(`Получено ${bookTags?.length || 0} записей из таблицы book_tags`);
    }

    // Получаем данные из таблицы lists
    console.log('Получение данных из таблицы lists...');
    const { data: lists, error: listsError } = await supabase
      .from('lists')
      .select('*');

    if (listsError) {
      console.error('Ошибка при получении данных из таблицы lists:', listsError);
    } else {
      data.lists = lists;
      console.log(`Получено ${lists?.length || 0} записей из таблицы lists`);
    }

    // Получаем данные из таблицы list_books
    console.log('Получение данных из таблицы list_books...');
    const { data: listBooks, error: listBooksError } = await supabase
      .from('list_books')
      .select('*');

    if (listBooksError) {
      console.error('Ошибка при получении данных из таблицы list_books:', listBooksError);
    } else {
      data.list_books = listBooks;
      console.log(`Получено ${listBooks?.length || 0} записей из таблицы list_books`);
    }

    // Получаем данные из таблицы comments
    console.log('Получение данных из таблицы comments...');
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('*');

    if (commentsError) {
      console.error('Ошибка при получении данных из таблицы comments:', commentsError);
    } else {
      data.comments = comments;
      console.log(`Получено ${comments?.length || 0} записей из таблицы comments`);
    }

    // Получаем данные из таблицы user_books
    console.log('Получение данных из таблицы user_books...');
    const { data: userBooks, error: userBooksError } = await supabase
      .from('user_books')
      .select('*');

    if (userBooksError) {
      console.error('Ошибка при получении данных из таблицы user_books:', userBooksError);
    } else {
      data.user_books = userBooks;
      console.log(`Получено ${userBooks?.length || 0} записей из таблицы user_books`);
    }

    // Получаем данные из таблицы achievements
    console.log('Получение данных из таблицы achievements...');
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*');

    if (achievementsError) {
      console.error('Ошибка при получении данных из таблицы achievements:', achievementsError);
    } else {
      data.achievements = achievements;
      console.log(`Получено ${achievements?.length || 0} записей из таблицы achievements`);
    }

    // Получаем данные из таблицы user_achievements
    console.log('Получение данных из таблицы user_achievements...');
    const { data: userAchievements, error: userAchievementsError } = await supabase
      .from('user_achievements')
      .select('*');

    if (userAchievementsError) {
      console.error('Ошибка при получении данных из таблицы user_achievements:', userAchievementsError);
    } else {
      data.user_achievements = userAchievements;
      console.log(`Получено ${userAchievements?.length || 0} записей из таблицы user_achievements`);
    }

    // Получаем информацию о бакетах в Storage
    console.log('Получение информации о бакетах в Storage...');
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (bucketsError) {
      console.error('Ошибка при получении информации о бакетах в Storage:', bucketsError);
    } else {
      data.storage = { buckets };
      console.log(`Получено ${buckets?.length || 0} бакетов в Storage`);

      // Для каждого бакета получаем список файлов
      for (const bucket of buckets || []) {
        console.log(`Получение списка файлов в бакете ${bucket.name}...`);
        const { data: files, error: filesError } = await supabase
          .storage
          .from(bucket.name)
          .list();

        if (filesError) {
          console.error(`Ошибка при получении списка файлов в бакете ${bucket.name}:`, filesError);
        } else {
          if (!data.storage[bucket.name]) {
            data.storage[bucket.name] = [];
          }
          data.storage[bucket.name] = files;
          console.log(`Получено ${files?.length || 0} файлов в бакете ${bucket.name}`);
        }
      }
    }

    // Сохраняем данные в файл
    const dataPath = path.join(process.cwd(), 'lib', 'supabase-data.json');
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    console.log(`Данные сохранены в ${dataPath}`);

  } catch (error) {
    console.error('Ошибка при получении данных из Supabase:', error);
  }
}

// Запускаем функцию получения данных
fetchData();

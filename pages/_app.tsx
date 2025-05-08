import { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { ConfigProvider, App as AntApp, theme } from 'antd';
import { SupabaseProvider } from '@/lib/context/SupabaseContext';
import { getTheme } from '@/lib/theme';
import ruRU from 'antd/locale/ru_RU';
import '../styles/globals.css';
export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Этот эффект запускается только на клиенте после монтирования компонента
  useEffect(() => {
    // Проверяем предпочтения пользователя по теме
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    setIsDarkMode(savedTheme === 'dark' || (!savedTheme && prefersDark));
    setMounted(true);
  }, []);

  // Функция для переключения темы
  const toggleTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    setIsDarkMode(!isDarkMode);

    // Добавляем или удаляем класс dark для body
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Передаем функцию переключения темы через контекст
  const themeContextValue = {
    isDarkMode,
    toggleTheme
  };

  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        ...getTheme(isDarkMode),
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
      // Добавляем поддержку React 19
      warning={{ version: false }}
    >
      <AntApp>
        <SupabaseProvider>
          <div style={{
            visibility: mounted ? 'visible' : 'hidden',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Component {...pageProps} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
          </div>
        </SupabaseProvider>
      </AntApp>
    </ConfigProvider>
  );
}

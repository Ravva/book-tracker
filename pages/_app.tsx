import { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { SupabaseProvider } from '@/lib/context/SupabaseContext';
import '../styles/globals.css';
import ThemeToggle from '@/components/layout/ThemeToggle';

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  // Этот эффект запускается только на клиенте после монтирования компонента
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SupabaseProvider>
      <div className={mounted ? "min-h-screen flex flex-col" : "min-h-screen flex flex-col invisible"}>
        <Component {...pageProps} />
        <ThemeToggle />
      </div>
    </SupabaseProvider>
  );
}

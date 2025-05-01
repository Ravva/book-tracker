import { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import '../styles/globals.css';
import ThemeToggle from '@/components/layout/ThemeToggle';

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  // Этот эффект запускается только на клиенте после монтирования компонента
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={mounted ? "min-h-screen flex flex-col" : "min-h-screen flex flex-col invisible"}>
      <Component {...pageProps} />
      <ThemeToggle />
    </div>
  );
}

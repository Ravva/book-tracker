import { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  // Этот эффект запускается только на клиенте после монтирования компонента
  useEffect(() => {
    setMounted(true);
  }, []);

  // Предотвращаем гидратацию с неправильной темой
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}><Component {...pageProps} /></div>;
  }

  return <Component {...pageProps} />;
}

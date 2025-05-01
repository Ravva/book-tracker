import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Трекер книг
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link href="/" className={`${router.pathname === '/' ? 'text-primary' : 'text-foreground'}`}>
              Главная
            </Link>
            <Link href="/books" className={`${router.pathname === '/books' ? 'text-primary' : 'text-foreground'}`}>
              Книги
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth/signin">Войти</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/signup">Регистрация</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Трекер прочитанных книг</p>
        </div>
      </footer>
    </div>
  );
}

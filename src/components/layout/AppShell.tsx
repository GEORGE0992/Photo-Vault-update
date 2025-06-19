"use client";
import type React from 'react';
import { AppHeader } from './AppHeader';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="sticky top-0 z-40 w-full border-b bg-card">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-32" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Skeleton className="h-96 w-full" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}


import { Logo } from '../layout/Logo';
import type React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <div className="bg-card p-8 rounded-lg shadow-xl">
          <h1 className="text-3xl font-headline font-semibold text-center text-foreground mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground text-center mb-6">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </main>
  );
}

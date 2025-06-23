import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { CategoriesProvider } from '@/context/categories-context';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'PlanckFi',
  description: 'Tu asistente financiero personal impulsado por IA.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable} suppressHydrationWarning>
      <body className={cn('font-body antialiased')} suppressHydrationWarning>
        <CategoriesProvider>{children}</CategoriesProvider>
        <Toaster />
      </body>
    </html>
  );
}

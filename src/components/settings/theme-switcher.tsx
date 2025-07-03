'use client';

import { useTheme } from 'next-themes';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const themes = [
  { name: 'Verde', class: 'theme-green', color: '#279d80' },
  { name: 'Azul', class: 'theme-blue', color: '#3b82f6' },
  { name: 'Rosa', class: 'theme-rose', color: '#f43f5e' },
  { name: 'Naranja', class: 'theme-orange', color: '#f97316' },
  { name: 'Violeta', class: 'theme-violet', color: '#8b5cf6' },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
      {themes.map((t) => (
        <div key={t.class} className="flex flex-col items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className={cn(
              'h-12 w-12 rounded-full border-2',
              theme === t.class && 'border-primary ring-2 ring-ring'
            )}
            style={{ backgroundColor: t.color }}
            onClick={() => setTheme(t.class)}
          >
            {theme === t.class && <Check className="h-6 w-6 text-primary-foreground" />}
            <span className="sr-only">{t.name}</span>
          </Button>
          <span className="text-xs text-muted-foreground">{t.name}</span>
        </div>
      ))}
    </div>
  );
}

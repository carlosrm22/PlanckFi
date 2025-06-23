'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type { Category } from '@/lib/types';
import { categories as initialCategories } from '@/lib/data';
import { Tag } from 'lucide-react';

interface CategoryContextType {
  categories: Category[];
  addCategory: (name: string) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const addCategory = (name: string) => {
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        console.warn("La categoría ya existe");
        // Aquí podrías mostrar una notificación (toast) al usuario.
        return;
    }
    
    const newCategory: Category = {
      name,
      icon: Tag,
      color: 'text-gray-500',
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const value = { categories, addCategory };

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories debe ser usado dentro de un CategoriesProvider');
  }
  return context;
}

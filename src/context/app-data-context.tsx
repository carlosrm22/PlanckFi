
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type { Category, BudgetGoal, Transaction } from '@/lib/types';
import {
  categories as initialCategories,
  budgetGoals as initialBudgetGoals,
  transactions as initialTransactions,
} from '@/lib/data';
import { Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AppDataContextType {
  categories: Category[];
  addCategory: (name: string) => void;
  editCategory: (oldName: string, newName: string) => void;
  budgets: BudgetGoal[];
  addBudget: (budget: Omit<BudgetGoal, 'spent' | 'color'>) => void;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, updatedTransaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [budgets, setBudgets] = useState<BudgetGoal[]>(initialBudgetGoals);
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const { toast } = useToast();

  const addCategory = (name: string) => {
    if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      toast({
        title: 'Error',
        description: 'La categoría ya existe.',
        variant: 'destructive',
      });
      return;
    }

    const newCategory: Category = {
      name,
      icon: Tag,
      color: 'text-gray-500',
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const editCategory = (oldName: string, newName: string) => {
    if (
      categories.some(
        (c) =>
          c.name.toLowerCase() === newName.toLowerCase() &&
          oldName.toLowerCase() !== newName.toLowerCase()
      )
    ) {
      toast({
        title: 'Error',
        description: 'Una categoría con ese nombre ya existe.',
        variant: 'destructive',
      });
      return;
    }
    setCategories((prev) =>
      prev.map((category) =>
        category.name === oldName ? { ...category, name: newName } : category
      )
    );
    setBudgets((prev) =>
      prev.map((budget) =>
        budget.category === oldName ? { ...budget, category: newName } : budget
      )
    );
    toast({
      title: 'Éxito',
      description: 'Categoría actualizada correctamente.',
    });
  };

  const addBudget = (budget: Omit<BudgetGoal, 'spent' | 'color'>) => {
    const newBudget: BudgetGoal = {
      ...budget,
      spent: 0,
      color: `var(--chart-${(budgets.length % 5) + 1})`,
    };
    setBudgets((prev) => [...prev, newBudget]);
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: new Date().getTime().toString(),
    };
    setTransactions((prev) => [newTransaction, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    toast({
      title: 'Éxito',
      description: 'Transacción añadida correctamente.',
    });
  };

  const editTransaction = (id: string, updatedTransaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { id, ...updatedTransaction } : t)
    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    toast({
      title: 'Éxito',
      description: 'Transacción actualizada correctamente.',
    });
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast({
      title: 'Éxito',
      description: 'Transacción eliminada correctamente.',
    });
  };

  const value = {
    categories,
    addCategory,
    editCategory,
    budgets,
    addBudget,
    transactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
  };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData debe ser usado dentro de un AppDataProvider');
  }
  return context;
}

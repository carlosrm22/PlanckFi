
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo } from 'react';
import { format } from 'date-fns';
import type { Category, BudgetGoal, Transaction, Account, Bill } from '@/lib/types';
import {
  categories as initialCategories,
  budgetGoals as initialBudgetGoals,
  transactions as initialTransactions,
  accounts as initialAccounts,
  bills as initialBills,
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
  accounts: Account[];
  addAccount: (account: Omit<Account, 'id'>) => void;
  editAccount: (id: string, updatedAccount: Omit<Account, 'id'>) => void;
  deleteAccount: (id: string) => void;
  bills: Bill[];
  addBill: (bill: Omit<Bill, 'id'>) => void;
  editBill: (id: string, updatedBill: Omit<Bill, 'id'>) => void;
  deleteBill: (id: string) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [budgets, setBudgets] = useState<BudgetGoal[]>(initialBudgetGoals);
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const { toast } = useToast();

  const processedBudgets = useMemo(() => {
    return budgets.map(budget => {
      const currentMonth = format(new Date(), 'yyyy-MM');
      const spent = transactions
        .filter(t => 
          t.category === budget.category && 
          t.type === 'expense' &&
          format(new Date(t.date), 'yyyy-MM') === currentMonth
        )
        .reduce((acc, t) => acc + Math.abs(t.amount), 0);
      
      return { ...budget, spent };
    });
  }, [budgets, transactions]);


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
     if (budgets.some(b => b.category === budget.category)) {
       toast({
        title: 'Error',
        description: 'Ya existe un presupuesto para esta categoría.',
        variant: 'destructive',
      });
      return;
    }
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

  const addAccount = (account: Omit<Account, 'id'>) => {
    const newAccount: Account = {
      ...account,
      id: new Date().getTime().toString(),
    };
    setAccounts(prev => [...prev, newAccount]);
    toast({
      title: 'Éxito',
      description: 'Cuenta añadida correctamente.',
    });
  };

  const editAccount = (id: string, updatedAccount: Omit<Account, 'id'>) => {
    setAccounts(prev => prev.map(acc => acc.id === id ? { id, ...updatedAccount } : acc));
    toast({
      title: 'Éxito',
      description: 'Cuenta actualizada correctamente.',
    });
  };

  const deleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== id));
    toast({
      title: 'Éxito',
      description: 'Cuenta eliminada correctamente.',
    });
  };

  const addBill = (bill: Omit<Bill, 'id'>) => {
    const newBill: Bill = {
      ...bill,
      id: new Date().getTime().toString(),
    };
    setBills(prev => [...prev, newBill].sort((a, b) => a.dueDay - b.dueDay));
    toast({
      title: 'Éxito',
      description: 'Factura recurrente añadida correctamente.',
    });
  };

  const editBill = (id: string, updatedBill: Omit<Bill, 'id'>) => {
    setBills(prev => prev.map(b => b.id === id ? { id, ...updatedBill } : b).sort((a, b) => a.dueDay - b.dueDay));
    toast({
      title: 'Éxito',
      description: 'Factura recurrente actualizada correctamente.',
    });
  };

  const deleteBill = (id: string) => {
    setBills(prev => prev.filter(b => b.id !== id));
    toast({
      title: 'Éxito',
      description: 'Factura recurrente eliminada correctamente.',
    });
  };


  const value = {
    categories,
    addCategory,
    editCategory,
    budgets: processedBudgets,
    addBudget,
    transactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
    accounts,
    addAccount,
    editAccount,
    deleteAccount,
    bills,
    addBill,
    editBill,
    deleteBill,
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

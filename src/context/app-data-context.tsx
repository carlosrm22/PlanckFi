
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { format } from 'date-fns';
import { ShoppingCart, Home, Clapperboard, Car, HeartPulse, Receipt, Plus, Utensils, Landmark, Tag, Loader2, AlertTriangle } from "lucide-react";
import type { Category, BudgetGoal, Transaction, Account, PendingPayment } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { auth, db, isConfigured, firebaseConfig } from '@/lib/firebase';
import { type User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  runTransaction
} from 'firebase/firestore';


const iconMap = {
    ShoppingCart, Home, Clapperboard, Car, HeartPulse, Receipt, Plus, Utensils, Landmark, Tag
};

interface AppDataContextType {
  user: User | null;
  signOut: () => void;
  categories: Category[];
  addCategory: (name: string) => Promise<void>;
  editCategory: (id: string, newName: string) => Promise<void>;
  budgets: BudgetGoal[];
  addBudget: (budget: Omit<BudgetGoal, 'id' | 'spent' | 'color'>) => Promise<void>;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  editTransaction: (id: string, updatedTransaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  accounts: Account[];
  addAccount: (account: Omit<Account, 'id'>) => Promise<void>;
  editAccount: (id: string, updatedAccount: Omit<Account, 'id'>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  pendingPayments: PendingPayment[];
  addPendingPayment: (payment: Omit<PendingPayment, 'id'>) => Promise<void>;
  editPendingPayment: (id: string, updatedPayment: Omit<PendingPayment, 'id'>) => Promise<void>;
  deletePendingPayment: (id: string) => Promise<void>;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);


function GlobalLoader() {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
}

function FirebaseNotConfigured() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="max-w-2xl w-full rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
                <h1 className="text-2xl font-bold text-destructive">Firebase no está configurado</h1>
                <p className="mt-2 text-destructive-foreground/80">
                    Parece que no has configurado las credenciales de Firebase. Para que la aplicación funcione, necesitas crear un proyecto en Firebase y añadir las claves a tu archivo <strong>.env</strong>.
                </p>
                <div className="mt-6 text-left bg-destructive/20 p-4 rounded-md text-sm font-mono text-destructive-foreground overflow-x-auto">
                    <p>NEXT_PUBLIC_FIREBASE_API_KEY=...
                    </p>
                    <p>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...</p>
                    <p>NEXT_PUBLIC_FIREBASE_PROJECT_ID=...</p>
                    <p>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...</p>
                    <p>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...</p>
                    <p>NEXT_PUBLIC_FIREBASE_APP_ID=...</p>
                </div>
                 <p className="mt-4 text-sm text-destructive-foreground/80">
                    Puedes obtener estas claves en la configuración de tu proyecto de Firebase.
                </p>
            </div>
        </div>
    );
}


export function AppDataProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<BudgetGoal[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  // --- Auth Effect ---
  useEffect(() => {
    if (!isConfigured || !auth) {
        setLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- Data Fetching Effect ---
  useEffect(() => {
    if (user && db) {
        const fetchData = async () => {
            const [
                categoriesSnapshot, 
                accountsSnapshot, 
                pendingPaymentsSnapshot, 
                budgetsSnapshot, 
                transactionsSnapshot
            ] = await Promise.all([
                getDocs(query(collection(db, 'users', user.uid, 'categories'), orderBy('name'))),
                getDocs(query(collection(db, 'users', user.uid, 'accounts'), orderBy('name'))),
                getDocs(query(collection(db, 'users', user.uid, 'pendingPayments'), orderBy('dueDay'))),
                getDocs(query(collection(db, 'users', user.uid, 'budgets'))),
                getDocs(query(collection(db, 'users', user.uid, 'transactions'), orderBy('date', 'desc')))
            ]);

            const categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as { name: string; color: string; icon: string } }));
            setCategories(categoriesData.map(c => ({...c, icon: iconMap[c.icon as keyof typeof iconMap] || Tag })));
            
            setAccounts(accountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Account)));
            setPendingPayments(pendingPaymentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PendingPayment)));
            setBudgets(budgetsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), icon: iconMap[doc.data().icon as keyof typeof iconMap] || Tag } as BudgetGoal)));
            setTransactions(transactionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction)));
        };
        fetchData();
    } else {
        // Clear data on logout
        setCategories([]);
        setAccounts([]);
        setPendingPayments([]);
        setBudgets([]);
        setTransactions([]);
    }
  }, [user]);

  // Auth Guard
  useEffect(() => {
    if (loading || !isConfigured) return;
    const isAuthPage = pathname === '/login' || pathname === '/register';
    if (!user && !isAuthPage) {
      router.push('/login');
    }
    if (user && isAuthPage) {
      router.push('/');
    }
  }, [user, loading, pathname, router, isConfigured]);

  const signOut = async () => {
    if (auth) {
      await firebaseSignOut(auth);
      router.push('/login');
    }
  };

  // --- Firestore Data Management ---
  const addCategory = async (name: string) => {
    if (!user || !db) return;
    if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
        toast({ title: 'Error', description: 'La categoría ya existe.', variant: 'destructive' });
        return;
    }
    const newCategory = { name, icon: 'Tag', color: 'text-gray-500' };
    const docRef = await addDoc(collection(db, 'users', user.uid, 'categories'), newCategory);
    setCategories(prev => [...prev, { ...newCategory, id: docRef.id, icon: Tag }].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const editCategory = async (id: string, newName: string) => {
     if (!user || !db) return;
     const existingCategory = categories.find(c => c.name.toLowerCase() === newName.toLowerCase() && c.id !== id);
     if (existingCategory) {
        toast({ title: 'Error', description: 'Una categoría con ese nombre ya existe.', variant: 'destructive' });
        return;
     }
     const docRef = doc(db, 'users', user.uid, 'categories', id);
     await updateDoc(docRef, { name: newName });
     setCategories(prev => prev.map(c => c.id === id ? { ...c, name: newName } : c).sort((a, b) => a.name.localeCompare(b.name)));
     toast({ title: 'Éxito', description: 'Categoría actualizada.' });
  }
  
  const addBudget = async (budget: Omit<BudgetGoal, 'id' | 'spent' | 'color'>) => {
      if (!user || !db) return;
      if (budgets.some(b => b.category === budget.category)) {
          toast({ title: 'Error', description: 'Ya existe un presupuesto para esta categoría.', variant: 'destructive' });
          return;
      }
      const newBudget = { ...budget, color: `var(--chart-${(budgets.length % 5) + 1})` };
      const docRef = await addDoc(collection(db, 'users', user.uid, 'budgets'), newBudget);
      setBudgets(prev => [...prev, { ...newBudget, id: docRef.id, spent: 0 }]);
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!user || !db) return;
    const docRef = await addDoc(collection(db, 'users', user.uid, 'transactions'), transaction);
    setTransactions(prev => [{ ...transaction, id: docRef.id }, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    toast({ title: 'Éxito', description: 'Transacción añadida.' });
  };
  
  const editTransaction = async (id: string, updatedTransaction: Omit<Transaction, 'id'>) => {
      if (!user || !db) return;
      const docRef = doc(db, 'users', user.uid, 'transactions', id);
      await updateDoc(docRef, updatedTransaction);
      setTransactions(prev => prev.map(t => t.id === id ? { ...updatedTransaction, id } : t).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      toast({ title: 'Éxito', description: 'Transacción actualizada.' });
  };

  const deleteTransaction = async (id: string) => {
      if (!user || !db) return;
      await deleteDoc(doc(db, 'users', user.uid, 'transactions', id));
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast({ title: 'Éxito', description: 'Transacción eliminada.' });
  };
  
  const addAccount = async (account: Omit<Account, 'id'>) => {
      if (!user || !db) return;
      const docRef = await addDoc(collection(db, 'users', user.uid, 'accounts'), account);
      setAccounts(prev => [...prev, { ...account, id: docRef.id }].sort((a, b) => a.name.localeCompare(b.name)));
  };
  
  const editAccount = async (id: string, updatedAccount: Omit<Account, 'id'>) => {
      if (!user || !db) return;
      await updateDoc(doc(db, 'users', user.uid, 'accounts', id), updatedAccount);
      setAccounts(prev => prev.map(acc => acc.id === id ? { id, ...updatedAccount } : acc).sort((a, b) => a.name.localeCompare(b.name)));
  };
  
  const deleteAccount = async (id: string) => {
      if (!user || !db) return;
      await deleteDoc(doc(db, 'users', user.uid, 'accounts', id));
      setAccounts(prev => prev.filter(acc => acc.id !== id));
  };
  
  const addPendingPayment = async (payment: Omit<PendingPayment, 'id'>) => {
      if (!user || !db) return;
      const docRef = await addDoc(collection(db, 'users', user.uid, 'pendingPayments'), payment);
      setPendingPayments(prev => [...prev, { ...payment, id: docRef.id }].sort((a, b) => a.dueDay - b.dueDay));
  };
  
  const editPendingPayment = async (id: string, updatedPayment: Omit<PendingPayment, 'id'>) => {
      if (!user || !db) return;
      await updateDoc(doc(db, 'users', user.uid, 'pendingPayments', id), updatedPayment);
      setPendingPayments(prev => prev.map(p => p.id === id ? { id, ...updatedPayment } : p).sort((a, b) => a.dueDay - b.dueDay));
  };
  
  const deletePendingPayment = async (id: string) => {
      if (!user || !db) return;
      await deleteDoc(doc(db, 'users', user.uid, 'pendingPayments', id));
      setPendingPayments(prev => prev.filter(p => p.id !== id));
  };


  const processedBudgets = useMemo(() => {
    return budgets.map(budget => {
      const currentMonth = format(new Date(), 'yyyy-MM');
      const spent = transactions
        .filter(t => t.category === budget.category && t.type === 'expense' && format(new Date(t.date), 'yyyy-MM') === currentMonth)
        .reduce((acc, t) => acc + Math.abs(t.amount), 0);
      return { ...budget, spent };
    });
  }, [budgets, transactions]);
  
  if (!isConfigured) return <FirebaseNotConfigured />;
  if (loading) return <GlobalLoader />;
  
  const value = {
    user,
    signOut,
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
    pendingPayments,
    addPendingPayment,
    editPendingPayment,
    deletePendingPayment,
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

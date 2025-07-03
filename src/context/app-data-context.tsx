
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { format } from 'date-fns';
import { ShoppingCart, Home, Clapperboard, Car, HeartPulse, Receipt, Plus, Utensils, Landmark, Tag, Loader2, AlertTriangle } from "lucide-react";
import type { Category, BudgetGoal, Transaction, Account, PendingPayment } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { auth, db, isConfigured } from '@/lib/firebase';
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
  writeBatch
} from 'firebase/firestore';
import { initialCategoriesData } from '@/lib/data';

// --- Demo Data ---
const iconMap = { ShoppingCart, Home, Clapperboard, Car, HeartPulse, Receipt, Plus, Utensils, Landmark, Tag };
const demoCategories = initialCategoriesData.map((c, i) => ({ ...c, id: `cat-${i}`, icon: iconMap[c.icon as keyof typeof iconMap] || Tag }));
const demoAccounts: Account[] = [
  { id: 'acc1', name: 'Cuenta de Prueba', type: 'Checking', provider: 'Banco Demo', balance: 2540.50, lastFour: '1234' },
  { id: 'acc2', name: 'Ahorros Demo', type: 'Savings', provider: 'Banco Demo', balance: 8200.00, lastFour: '5678' },
];
const demoTransactions: Transaction[] = [
    { id: 't1', description: 'Ingreso de demostración', amount: 3500, date: new Date(new Date().setDate(1)).toISOString(), category: 'Ingresos', type: 'income' },
    { id: 't2', description: 'Compra en supermercado', amount: -125.50, date: new Date(new Date().setDate(5)).toISOString(), category: 'Comestibles', type: 'expense' },
    { id: 't3', description: 'Pago de alquiler', amount: -1200, date: new Date(new Date().setDate(2)).toISOString(), category: 'Alquiler', type: 'expense' },
];
const demoPendingPayments: PendingPayment[] = [
    { id: 'pp1', name: 'Suscripción de prueba', amount: 15.00, dueDay: 15, category: 'Entretenimiento' },
];
const demoBudgets: Omit<BudgetGoal, 'id' | 'spent'>[] = [
    { category: 'Comestibles', icon: ShoppingCart, budgeted: 400, color: 'var(--chart-1)'},
    { category: 'Transporte', icon: Car, budgeted: 150, color: 'var(--chart-2)'},
];
// --- End Demo Data ---


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
  isDemoMode: boolean;
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
                 <p className="mt-4 text-sm text-destructive-foreground/80">
                    Puedes obtener estas claves en la configuración de tu proyecto de Firebase.
                </p>
            </div>
        </div>
    );
}

// Helper para limpiar datos para Firestore
function cleanDataForFirestore(data: any) {
    const cleanedData: any = {};
    for (const key in data) {
        if (data[key] !== undefined) {
            cleanedData[key] = data[key];
        }
    }
    return cleanedData;
}


export function AppDataProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  // Local/Demo state
  const [localCategories, setLocalCategories] = useState<Category[]>(demoCategories);
  const [localAccounts, setLocalAccounts] = useState<Account[]>(demoAccounts);
  const [localTransactions, setLocalTransactions] = useState<Transaction[]>(demoTransactions);
  const [localPendingPayments, setLocalPendingPayments] = useState<PendingPayment[]>(demoPendingPayments);
  const [localBudgets, setLocalBudgets] = useState<Omit<BudgetGoal, 'id' | 'spent'>[]>(demoBudgets);

  // Firebase state
  const [fbCategories, setFbCategories] = useState<Category[]>([]);
  const [fbAccounts, setFbAccounts] = useState<Account[]>([]);
  const [fbTransactions, setFbTransactions] = useState<Transaction[]>([]);
  const [fbPendingPayments, setFbPendingPayments] = useState<PendingPayment[]>([]);
  const [fbBudgets, setFbBudgets] = useState<BudgetGoal[]>([]);

  // Auth Effect
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

  // Data Fetching Effect for logged-in users
  useEffect(() => {
    if (user && db) {
        const fetchData = async () => {
            const [
                categoriesSnapshot, accountsSnapshot, pendingPaymentsSnapshot, budgetsSnapshot, transactionsSnapshot
            ] = await Promise.all([
                getDocs(query(collection(db, 'users', user.uid, 'categories'), orderBy('name'))),
                getDocs(query(collection(db, 'users', user.uid, 'accounts'), orderBy('name'))),
                getDocs(query(collection(db, 'users', user.uid, 'pendingPayments'), orderBy('dueDay'))),
                getDocs(query(collection(db, 'users', user.uid, 'budgets'))),
                getDocs(query(collection(db, 'users', user.uid, 'transactions'), orderBy('date', 'desc')))
            ]);

            const categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as { name: string; color: string; icon: string } }));
            setFbCategories(categoriesData.map(c => ({...c, icon: iconMap[c.icon as keyof typeof iconMap] || Tag })));
            setFbAccounts(accountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Account)));
            setFbPendingPayments(pendingPaymentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PendingPayment)));
            setFbBudgets(budgetsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), icon: iconMap[doc.data().icon as keyof typeof iconMap] || Tag } as BudgetGoal)));
            setFbTransactions(transactionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction)));
        };
        fetchData();
    } else {
        setFbCategories([]); setFbAccounts([]); setFbTransactions([]); setFbPendingPayments([]); setFbBudgets([]);
    }
  }, [user]);

  // Auth Guard for login/register pages
  useEffect(() => {
    if (loading) return;
    const isAuthPage = pathname === '/login' || pathname === '/register';
    if (user && isAuthPage) {
      router.push('/');
    }
  }, [user, loading, pathname, router]);

  const signOut = async () => {
    if (auth) {
      await firebaseSignOut(auth);
      router.push('/login');
    }
  };
  
  const isDemoMode = !user;
  
  // --- Data selectors ---
  const categories = isDemoMode ? localCategories : fbCategories;
  const accounts = isDemoMode ? localAccounts : fbAccounts;
  const transactions = isDemoMode ? localTransactions : fbTransactions;
  const pendingPayments = isDemoMode ? localPendingPayments : fbPendingPayments;

  // --- CRUD Operations ---
  const addCategory = async (name: string) => {
    if(categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        toast({ title: 'Error', description: 'La categoría ya existe.', variant: 'destructive' });
        return;
    }
    const newCategoryData = { name, icon: 'Tag', color: 'text-gray-500' };

    if (user && db) {
        const docRef = await addDoc(collection(db, 'users', user.uid, 'categories'), newCategoryData);
        setFbCategories(prev => [...prev, { ...newCategoryData, id: docRef.id, icon: Tag }].sort((a,b) => a.name.localeCompare(b.name)));
    } else {
        const newCategory = { ...newCategoryData, id: `cat-${Date.now()}`, icon: Tag };
        setLocalCategories(prev => [...prev, newCategory].sort((a,b) => a.name.localeCompare(b.name)));
    }
  };

  const editCategory = async (id: string, newName: string) => {
     if (categories.some(c => c.name.toLowerCase() === newName.toLowerCase() && c.id !== id)) {
        toast({ title: 'Error', description: 'Una categoría con ese nombre ya existe.', variant: 'destructive' });
        return;
     }
    if (user && db) {
        const docRef = doc(db, 'users', user.uid, 'categories', id);
        await updateDoc(docRef, { name: newName });
        setFbCategories(prev => prev.map(c => c.id === id ? { ...c, name: newName } : c).sort((a, b) => a.name.localeCompare(b.name)));
    } else {
        setLocalCategories(prev => prev.map(c => c.id === id ? { ...c, name: newName } : c).sort((a, b) => a.name.localeCompare(b.name)));
    }
    toast({ title: 'Éxito', description: 'Categoría actualizada.' });
  }
  
  const addBudget = async (budget: Omit<BudgetGoal, 'id' | 'spent' | 'color'>) => {
    const existingBudgets = user ? fbBudgets : localBudgets;
    if (existingBudgets.some(b => b.category === budget.category)) {
        toast({ title: 'Error', description: 'Ya existe un presupuesto para esta categoría.', variant: 'destructive' });
        return;
    }
    const newBudget = { ...budget, color: `var(--chart-${(existingBudgets.length % 5) + 1})` };
    if(user && db) {
        const docRef = await addDoc(collection(db, 'users', user.uid, 'budgets'), newBudget);
        setFbBudgets(prev => [...prev, { ...newBudget, id: docRef.id, spent: 0 }]);
    } else {
        setLocalBudgets(prev => [...prev, newBudget]);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (user && db) {
        const cleanedTransaction = cleanDataForFirestore(transaction);
        const docRef = await addDoc(collection(db, 'users', user.uid, 'transactions'), cleanedTransaction);
        setFbTransactions(prev => [{ ...transaction, id: docRef.id }, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } else {
        const newTransaction = { ...transaction, id: `trans-${Date.now()}` };
        setLocalTransactions(prev => [newTransaction, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
    toast({ title: 'Éxito', description: 'Transacción añadida.' });
  };
  
  const editTransaction = async (id: string, updatedTransaction: Omit<Transaction, 'id'>) => {
    if (user && db) {
        const cleanedTransaction = cleanDataForFirestore(updatedTransaction);
        const docRef = doc(db, 'users', user.uid, 'transactions', id);
        await updateDoc(docRef, cleanedTransaction);
        setFbTransactions(prev => prev.map(t => t.id === id ? { ...updatedTransaction, id } : t).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } else {
        setLocalTransactions(prev => prev.map(t => t.id === id ? { ...updatedTransaction, id } : t).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
    toast({ title: 'Éxito', description: 'Transacción actualizada.' });
  };

  const deleteTransaction = async (id: string) => {
    if (user && db) {
        await deleteDoc(doc(db, 'users', user.uid, 'transactions', id));
        setFbTransactions(prev => prev.filter(t => t.id !== id));
    } else {
        setLocalTransactions(prev => prev.filter(t => t.id !== id));
    }
    toast({ title: 'Éxito', description: 'Transacción eliminada.' });
  };
  
  const addAccount = async (account: Omit<Account, 'id'>) => {
    if (user && db) {
        const docRef = await addDoc(collection(db, 'users', user.uid, 'accounts'), account);
        setFbAccounts(prev => [...prev, { ...account, id: docRef.id }].sort((a, b) => a.name.localeCompare(b.name)));
    } else {
        setLocalAccounts(prev => [...prev, { ...account, id: `acc-${Date.now()}` }].sort((a, b) => a.name.localeCompare(b.name)));
    }
  };
  
  const editAccount = async (id: string, updatedAccount: Omit<Account, 'id'>) => {
    if (user && db) {
        await updateDoc(doc(db, 'users', user.uid, 'accounts', id), updatedAccount);
        setFbAccounts(prev => prev.map(acc => acc.id === id ? { id, ...updatedAccount } : acc).sort((a, b) => a.name.localeCompare(b.name)));
    } else {
        setLocalAccounts(prev => prev.map(acc => acc.id === id ? { id, ...updatedAccount } : acc).sort((a, b) => a.name.localeCompare(b.name)));
    }
  };
  
  const deleteAccount = async (id: string) => {
    if (user && db) {
        await deleteDoc(doc(db, 'users', user.uid, 'accounts', id));
        setFbAccounts(prev => prev.filter(acc => acc.id !== id));
    } else {
        setLocalAccounts(prev => prev.filter(acc => acc.id !== id));
    }
  };
  
  const addPendingPayment = async (payment: Omit<PendingPayment, 'id'>) => {
      if (user && db) {
        const docRef = await addDoc(collection(db, 'users', user.uid, 'pendingPayments'), payment);
        setFbPendingPayments(prev => [...prev, { ...payment, id: docRef.id }].sort((a, b) => a.dueDay - b.dueDay));
      } else {
        setLocalPendingPayments(prev => [...prev, { ...payment, id: `pp-${Date.now()}` }].sort((a, b) => a.dueDay - b.dueDay));
      }
  };
  
  const editPendingPayment = async (id: string, updatedPayment: Omit<PendingPayment, 'id'>) => {
      if (user && db) {
        await updateDoc(doc(db, 'users', user.uid, 'pendingPayments', id), updatedPayment);
        setFbPendingPayments(prev => prev.map(p => p.id === id ? { id, ...updatedPayment } : p).sort((a, b) => a.dueDay - b.dueDay));
      } else {
        setLocalPendingPayments(prev => prev.map(p => p.id === id ? { id, ...updatedPayment } : p).sort((a, b) => a.dueDay - b.dueDay));
      }
  };
  
  const deletePendingPayment = async (id: string) => {
      if (user && db) {
        await deleteDoc(doc(db, 'users', user.uid, 'pendingPayments', id));
        setFbPendingPayments(prev => prev.filter(p => p.id !== id));
      } else {
        setLocalPendingPayments(prev => prev.filter(p => p.id !== id));
      }
  };


  const processedBudgets = useMemo(() => {
    const baseBudgets = isDemoMode 
        ? localBudgets.map((b,i) => ({ ...b, id: `bud-${i}`})) 
        : fbBudgets;

    return baseBudgets.map(budget => {
      const currentMonth = format(new Date(), 'yyyy-MM');
      const spent = transactions
        .filter(t => t.category === budget.category && t.type === 'expense' && format(new Date(t.date), 'yyyy-MM') === currentMonth)
        .reduce((acc, t) => acc + Math.abs(t.amount), 0);
      return { ...budget, spent };
    });
  }, [isDemoMode, localBudgets, fbBudgets, transactions]);
  
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
    isDemoMode,
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

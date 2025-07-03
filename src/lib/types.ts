
import type { LucideIcon } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  receiptImageUrl?: string;
  account?: string;
}

export interface BudgetGoal {
  id: string;
  category: string;
  icon: LucideIcon;
  budgeted: number;
  spent: number;
  color: string;
}

export interface PendingPayment {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  category: string;
}

export interface Account {
  id: string;
  name: string;
  type: "Checking" | "Savings" | "Credit Card";
  balance: number;
  provider: string;
  lastFour: string;
}

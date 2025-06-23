import type { LucideIcon } from "lucide-react";

export interface Category {
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
}

export interface BudgetGoal {
  category: string;
  icon: LucideIcon;
  budgeted: number;
  spent: number;
  color: string;
}

export interface Bill {
  name: string;
  amount: number;
  dueDate: string;
  icon: LucideIcon;
}

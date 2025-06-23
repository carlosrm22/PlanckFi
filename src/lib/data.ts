import type { BudgetGoal, Bill, Category } from "@/lib/types";
import { ShoppingCart, Home, Clapperboard, Car, HeartPulse, Receipt, Plus } from "lucide-react";

export const categories: Category[] = [
  { name: "Groceries", icon: ShoppingCart, color: "text-blue-500" },
  { name: "Rent", icon: Home, color: "text-red-500" },
  { name: "Entertainment", icon: Clapperboard, color: "text-purple-500" },
  { name: "Transport", icon: Car, color: "text-yellow-500" },
  { name: "Health", icon: HeartPulse, color: "text-green-500" },
  { name: "Utilities", icon: Receipt, color: "text-orange-500" },
  { name: "Add New", icon: Plus, color: "text-gray-500" },
];

export const budgetGoals: BudgetGoal[] = [
  { category: "Groceries", icon: ShoppingCart, budgeted: 400, spent: 250, color: "var(--chart-1)" },
  { category: "Entertainment", icon: Clapperboard, budgeted: 150, spent: 120, color: "var(--chart-2)" },
  { category: "Transport", icon: Car, budgeted: 100, spent: 50, color: "var(--chart-3)" },
  { category: "Health", icon: HeartPulse, budgeted: 200, spent: 210, color: "var(--chart-4)" },
];

export const upcomingBills: Bill[] = [
    { name: "Netflix", amount: 15.99, dueDate: "2024-08-25", icon: Clapperboard },
    { name: "Electricity Bill", amount: 75.50, dueDate: "2024-08-28", icon: Receipt },
    { name: "Rent", amount: 1200, dueDate: "2024-09-01", icon: Home },
    { name: "Car Insurance", amount: 120.00, dueDate: "2024-09-05", icon: Car },
]

export const spendingData = [
  { category: 'Groceries', value: 450.76, fill: 'var(--chart-1)' },
  { category: 'Rent', value: 1200, fill: 'var(--chart-2)' },
  { category: 'Entertainment', value: 221.34, fill: 'var(--chart-3)' },
  { category: 'Transport', value: 135.50, fill: 'var(--chart-4)' },
  { category: 'Health', value: 75.00, fill: 'var(--chart-5)' },
]

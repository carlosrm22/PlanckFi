import type { BudgetGoal, Bill, Category } from "@/lib/types";
import { ShoppingCart, Home, Clapperboard, Car, HeartPulse, Receipt, Plus } from "lucide-react";

export const categories: Category[] = [
  { name: "Comestibles", icon: ShoppingCart, color: "text-blue-500" },
  { name: "Alquiler", icon: Home, color: "text-red-500" },
  { name: "Entretenimiento", icon: Clapperboard, color: "text-purple-500" },
  { name: "Transporte", icon: Car, color: "text-yellow-500" },
  { name: "Salud", icon: HeartPulse, color: "text-green-500" },
  { name: "Servicios", icon: Receipt, color: "text-orange-500" },
  { name: "Añadir Nuevo", icon: Plus, color: "text-gray-500" },
];

export const budgetGoals: BudgetGoal[] = [
  { category: "Comestibles", icon: ShoppingCart, budgeted: 400, spent: 250, color: "var(--chart-1)" },
  { category: "Entretenimiento", icon: Clapperboard, budgeted: 150, spent: 120, color: "var(--chart-2)" },
  { category: "Transporte", icon: Car, budgeted: 100, spent: 50, color: "var(--chart-3)" },
  { category: "Salud", icon: HeartPulse, budgeted: 200, spent: 210, color: "var(--chart-4)" },
];

export const upcomingBills: Bill[] = [
    { name: "Netflix", amount: 15.99, dueDate: "2024-08-25", icon: Clapperboard },
    { name: "Factura de Electricidad", amount: 75.50, dueDate: "2024-08-28", icon: Receipt },
    { name: "Alquiler", amount: 1200, dueDate: "2024-09-01", icon: Home },
    { name: "Seguro de Auto", amount: 120.00, dueDate: "2024-09-05", icon: Car },
]

export const spendingData = [
  { category: 'Comestibles', value: 450.76, fill: 'var(--chart-1)' },
  { category: 'Alquiler', value: 1200, fill: 'var(--chart-2)' },
  { category: 'Entretenimiento', value: 221.34, fill: 'var(--chart-3)' },
  { category: 'Transporte', value: 135.50, fill: 'var(--chart-4)' },
  { category: 'Salud', value: 75.00, fill: 'var(--chart-5)' },
]

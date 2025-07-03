import type { BudgetGoal, PendingPayment, Category, Transaction, Account } from "@/lib/types";
import { ShoppingCart, Home, Clapperboard, Car, HeartPulse, Receipt, Plus, Utensils, Landmark } from "lucide-react";

export const categories: Category[] = [
  { name: "Comestibles", icon: ShoppingCart, color: "text-blue-500" },
  { name: "Alquiler", icon: Home, color: "text-red-500" },
  { name: "Entretenimiento", icon: Clapperboard, color: "text-purple-500" },
  { name: "Transporte", icon: Car, color: "text-yellow-500" },
  { name: "Salud", icon: HeartPulse, color: "text-green-500" },
  { name: "Servicios", icon: Receipt, color: "text-orange-500" },
  { name: "Restaurante", icon: Utensils, color: "text-pink-500" },
  { name: "Ingresos", icon: Landmark, color: "text-emerald-500" },
];

export const transactions: Transaction[] = [
    { id: '1', date: '2024-07-26T12:00:00Z', description: 'Supermercado La Compra', category: 'Comestibles', amount: -75.50, type: 'expense' },
    { id: '2', date: '2024-07-25T12:00:00Z', description: 'Salario de Julio', category: 'Ingresos', amount: 2500.00, type: 'income' },
    { id: '3', date: '2024-07-24T12:00:00Z', description: 'Suscripción a Netflix', category: 'Entretenimiento', amount: -15.99, type: 'expense' },
    { id: '4', date: '2024-07-23T12:00:00Z', description: 'Cena en "El Sabor"', category: 'Restaurante', amount: -45.20, type: 'expense' },
    { id: '5', date: '2024-07-22T12:00:00Z', description: 'Gasolina para el coche', category: 'Transporte', amount: -50.00, type: 'expense' },
    { id: '6', date: '2024-07-21T12:00:00Z', description: 'Entradas de cine', category: 'Entretenimiento', amount: -22.00, type: 'expense' },
    { id: '7', date: '2024-07-20T12:00:00Z', description: 'Factura de internet', category: 'Servicios', amount: -60.00, type: 'expense' },
];

export const accounts: Account[] = [
    { id: '1', name: 'Cuenta Corriente', type: 'Checking', provider: 'Banco Ficticio', balance: 5231.89, lastFour: '1234' },
    { id: '2', name: 'Cuenta de Ahorros', type: 'Savings', provider: 'Banco Ficticio', balance: 40000.00, lastFour: '5678' },
    { id: '3', name: 'Tarjeta de Crédito Platino', type: 'Credit Card', provider: 'Crédito Ficticio', balance: -542.12, lastFour: '9012' },
];

export const budgetGoals: BudgetGoal[] = [
  { category: "Comestibles", icon: ShoppingCart, budgeted: 400, spent: 250, color: "var(--chart-1)" },
  { category: "Entretenimiento", icon: Clapperboard, budgeted: 150, spent: 120, color: "var(--chart-2)" },
  { category: "Transporte", icon: Car, budgeted: 100, spent: 50, color: "var(--chart-3)" },
  { category: "Salud", icon: HeartPulse, budgeted: 200, spent: 210, color: "var(--chart-4)" },
];

export const pendingPayments: PendingPayment[] = [
    { id: 'b1', name: "Netflix", amount: 15.99, dueDay: 25, category: "Entretenimiento" },
    { id: 'b2', name: "Factura de Electricidad", amount: 75.50, dueDay: 28, category: "Servicios" },
    { id: 'b3', name: "Alquiler", amount: 1200, dueDay: 1, category: "Alquiler" },
    { id: 'b4', name: "Seguro de Auto", amount: 120.00, dueDay: 5, category: "Transporte" },
]

export const spendingData = [
  { category: 'Comestibles', value: 450.76, fill: 'var(--chart-1)' },
  { category: 'Alquiler', value: 1200, fill: 'var(--chart-2)' },
  { category: 'Entretenimiento', value: 221.34, fill: 'var(--chart-3)' },
  { category: 'Transporte', value: 135.50, fill: 'var(--chart-4)' },
  { category: 'Salud', value: 75.00, fill: 'var(--chart-5)' },
]

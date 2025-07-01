// Tipos básicos para la aplicación PlanckFi

export interface User {
  uid: string;
  email: string;
  name: string;
  picture?: string;
  profile?: UserProfile;
}

export interface UserProfile {
  avatar?: string;
  phone?: string;
  currency: string;
  timezone: string;
  categories?: Category[];
  budgets?: Budget[];
}

export interface FinancialAccount {
  id: string;
  userId: string;
  name: string;
  type: 'savings' | 'checking' | 'investment' | 'credit';
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  category: string;
  description: string;
  date: Date;
  receipt?: Receipt;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
  isDefault: boolean;
  createdAt: Date;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  currency: string;
  period: 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  spent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Receipt {
  id: string;
  userId: string;
  transactionId?: string;
  filename: string;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
  ocrData?: OCRData;
  status: 'pending' | 'processed' | 'failed';
  createdAt: Date;
  processedAt?: Date;
}

export interface OCRData {
  merchant: string;
  total: number;
  date: Date;
  items?: ReceiptItem[];
  confidence: number;
  rawText: string;
}

export interface ReceiptItem {
  name: string;
  price: number;
  quantity: number;
}

export interface FinancialStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyStats: MonthlyStats[];
  categoryBreakdown: CategoryStats[];
  recentTransactions: Transaction[];
}

export interface MonthlyStats {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface CategoryStats {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface TransactionFormData {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
  tags?: string[];
}

export interface CategoryFormData {
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
}

export interface BudgetFormData {
  categoryId: string;
  amount: number;
  period: 'monthly' | 'yearly';
  startDate: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TransactionFilters {
  type?: 'income' | 'expense';
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
  tags?: string[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
} 
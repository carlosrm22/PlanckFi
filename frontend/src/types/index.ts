// Tipos básicos para la aplicación PlanckFi

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
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
  accountId: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description: string;
  category: string;
  date: Date;
  createdAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} 
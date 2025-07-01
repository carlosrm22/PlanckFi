import { auth } from '../config/firebase';
import {
  Transaction,
  Category,
  Receipt,
  FinancialStats,
  TransactionFormData,
  CategoryFormData,
  TransactionFilters,
  ApiResponse,
  PaginatedResponse,
} from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  private async getAuthToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null;
      
      const token = await user.getIdToken();
      return token;
    } catch (error) {
      console.warn('Error getting auth token:', error);
      return null;
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // ===== DASHBOARD & STATS =====
  async getDashboardStats(): Promise<FinancialStats> {
    return this.makeRequest<FinancialStats>('/dashboard/stats');
  }

  // ===== TRANSACTIONS =====
  async getTransactions(filters?: TransactionFilters, page = 1, limit = 20): Promise<PaginatedResponse<Transaction>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.type && { type: filters.type }),
      ...(filters?.category && { category: filters.category }),
      ...(filters?.dateFrom && { dateFrom: filters.dateFrom.toISOString() }),
      ...(filters?.dateTo && { dateTo: filters.dateTo.toISOString() }),
      ...(filters?.minAmount && { minAmount: filters.minAmount.toString() }),
      ...(filters?.maxAmount && { maxAmount: filters.maxAmount.toString() }),
      ...(filters?.tags && { tags: filters.tags.join(',') }),
    });

    return this.makeRequest<PaginatedResponse<Transaction>>(`/transactions?${params}`);
  }

  async getTransaction(id: string): Promise<Transaction> {
    return this.makeRequest<Transaction>(`/transactions/${id}`);
  }

  async createTransaction(data: TransactionFormData): Promise<Transaction> {
    return this.makeRequest<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTransaction(id: string, data: Partial<TransactionFormData>): Promise<Transaction> {
    return this.makeRequest<Transaction>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTransaction(id: string): Promise<void> {
    return this.makeRequest<void>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  // ===== CATEGORIES =====
  async getCategories(): Promise<Category[]> {
    return this.makeRequest<Category[]>('/categories');
  }

  async createCategory(data: CategoryFormData): Promise<Category> {
    return this.makeRequest<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: CategoryFormData): Promise<Category> {
    return this.makeRequest<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string): Promise<void> {
    return this.makeRequest<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // ===== RECEIPTS =====
  async uploadReceipt(file: File): Promise<Receipt> {
    const token = await this.getAuthToken();
    const formData = new FormData();
    formData.append('receipt', file);

    const response = await fetch(`${API_BASE_URL}/receipts/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getReceipts(): Promise<Receipt[]> {
    return this.makeRequest<Receipt[]>('/receipts');
  }

  async getReceipt(id: string): Promise<Receipt> {
    return this.makeRequest<Receipt>(`/receipts/${id}`);
  }

  async deleteReceipt(id: string): Promise<void> {
    return this.makeRequest<void>(`/receipts/${id}`, {
      method: 'DELETE',
    });
  }

  // ===== USER PROFILE =====
  async getUserProfile(): Promise<any> {
    return this.makeRequest('/auth/me');
  }

  async updateUserProfile(data: any): Promise<any> {
    return this.makeRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ===== HEALTH CHECK =====
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.makeRequest('/health');
  }
}

export const apiService = new ApiService(); 
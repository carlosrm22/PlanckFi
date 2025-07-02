import { useState, useEffect, useCallback } from 'react';
import { FinancialStats } from '../types';
import { apiService } from '../services/api';

interface UseDashboardReturn {
  stats: FinancialStats | null;
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
  clearError: () => void;
}

// Datos de ejemplo para demostración
const mockStats: FinancialStats = {
  balance: 12500.75,
  totalIncome: 8500.00,
  totalExpenses: 3200.25,
  recentTransactions: [
    {
      id: '1',
      userId: 'mock-user',
      description: 'Salario mensual',
      amount: 3500.00,
      type: 'income',
      category: 'Trabajo',
      currency: 'USD',
      date: new Date(),
      tags: ['salario'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      userId: 'mock-user',
      description: 'Supermercado',
      amount: -125.50,
      type: 'expense',
      category: 'Alimentación',
      currency: 'USD',
      date: new Date(Date.now() - 86400000),
      tags: ['comida'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      userId: 'mock-user',
      description: 'Gasolina',
      amount: -45.00,
      type: 'expense',
      category: 'Transporte',
      currency: 'USD',
      date: new Date(Date.now() - 172800000),
      tags: ['transporte'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      userId: 'mock-user',
      description: 'Freelance diseño',
      amount: 800.00,
      type: 'income',
      category: 'Trabajo',
      currency: 'USD',
      date: new Date(Date.now() - 259200000),
      tags: ['freelance'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '5',
      userId: 'mock-user',
      description: 'Restaurante',
      amount: -65.00,
      type: 'expense',
      category: 'Entretenimiento',
      currency: 'USD',
      date: new Date(Date.now() - 345600000),
      tags: ['entretenimiento'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  monthlyStats: [
    { month: 'Ene', income: 3500, expenses: 2800, balance: 700 },
    { month: 'Feb', income: 3800, expenses: 3100, balance: 1400 },
    { month: 'Mar', income: 4200, expenses: 2900, balance: 2700 },
    { month: 'Abr', income: 3900, expenses: 3200, balance: 3400 },
    { month: 'May', income: 4100, expenses: 3000, balance: 4500 },
    { month: 'Jun', income: 4300, expenses: 2800, balance: 6000 },
  ],
  categoryBreakdown: [
    { categoryId: '1', categoryName: 'Alimentación', amount: 850.00, percentage: 26.5, color: '#10B981' },
    { categoryId: '2', categoryName: 'Transporte', amount: 650.00, percentage: 20.3, color: '#3B82F6' },
    { categoryId: '3', categoryName: 'Entretenimiento', amount: 450.00, percentage: 14.1, color: '#8B5CF6' },
    { categoryId: '4', categoryName: 'Servicios', amount: 380.00, percentage: 11.9, color: '#F59E0B' },
    { categoryId: '5', categoryName: 'Salud', amount: 320.00, percentage: 10.0, color: '#EF4444' },
    { categoryId: '6', categoryName: 'Otros', amount: 551.25, percentage: 17.2, color: '#6B7280' },
  ],
};

export const useDashboard = (): UseDashboardReturn => {
  const [stats, setStats] = useState<FinancialStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Intentar obtener datos reales primero
      try {
        const response = await apiService.getDashboardStats();
        setStats(response);
      } catch (apiError) {
        // Si no hay datos reales, usar datos de ejemplo
        console.warn('No se pudieron cargar datos reales, usando datos de ejemplo:', apiError);
        setStats(mockStats);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar estadísticas';
      setError(errorMessage);
      console.warn('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cargar estadísticas iniciales
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    fetchStats,
    clearError,
  };
}; 
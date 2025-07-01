import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { FinancialStats, Transaction } from '../../types';
import { StatsCards } from './StatsCards';
import { RecentTransactions } from './RecentTransactions';
import { CategoryBreakdown } from './CategoryBreakdown';
import { MonthlyChart } from './MonthlyChart';
import { QuickActions } from './QuickActions';

export const Dashboard: React.FC = () => {
  const { user } = useAuthContext();
  const [stats, setStats] = useState<FinancialStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Implementar llamada a la API
      // Por ahora usamos datos mock
      const mockStats: FinancialStats = {
        totalIncome: 5000,
        totalExpenses: 3200,
        balance: 1800,
        monthlyStats: [
          { month: 'Ene', income: 4500, expenses: 2800, balance: 1700 },
          { month: 'Feb', income: 5200, expenses: 3100, balance: 2100 },
          { month: 'Mar', income: 4800, expenses: 2900, balance: 1900 },
          { month: 'Abr', income: 5000, expenses: 3200, balance: 1800 },
        ],
        categoryBreakdown: [
          { categoryId: '1', categoryName: 'Comida', amount: 800, percentage: 25, color: '#ef4444' },
          { categoryId: '2', categoryName: 'Transporte', amount: 600, percentage: 19, color: '#3b82f6' },
          { categoryId: '3', categoryName: 'Entretenimiento', amount: 400, percentage: 12, color: '#8b5cf6' },
          { categoryId: '4', categoryName: 'Servicios', amount: 300, percentage: 9, color: '#10b981' },
          { categoryId: '5', categoryName: 'Otros', amount: 1100, percentage: 35, color: '#f59e0b' },
        ],
        recentTransactions: [
          {
            id: '1',
            userId: user?.uid || '',
            type: 'expense',
            amount: 45.50,
            currency: 'USD',
            category: 'Comida',
            description: 'Supermercado',
            date: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '2',
            userId: user?.uid || '',
            type: 'income',
            amount: 2500,
            currency: 'USD',
            category: 'Salario',
            description: 'Pago mensual',
            date: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };
      
      setStats(mockStats);
    } catch (err) {
      setError('Error al cargar los datos del dashboard');
      console.warn('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error al cargar datos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard Financiero
              </h1>
              <p className="text-gray-600">
                Bienvenido de vuelta, {user?.name || user?.email}
              </p>
            </div>
            <QuickActions />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {stats && (
          <>
            {/* Stats Cards */}
            <div className="mb-8">
              <StatsCards stats={stats} />
            </div>

            {/* Charts and Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Monthly Chart */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Evolución Mensual
                  </h3>
                  <MonthlyChart data={stats.monthlyStats} />
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Transacciones Recientes
                  </h3>
                  <RecentTransactions transactions={stats.recentTransactions} />
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="mt-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Desglose por Categorías
                </h3>
                <CategoryBreakdown categories={stats.categoryBreakdown} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}; 
import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useDashboard } from '../../hooks/useDashboard';
import { StatsCards } from './StatsCards';
import { RecentTransactions } from './RecentTransactions';
import { CategoryBreakdown } from './CategoryBreakdown';
import { MonthlyChart } from './MonthlyChart';
import { QuickActions } from './QuickActions';

export const Dashboard: React.FC = () => {
  const { user } = useAuthContext();
  const { stats, loading, error, fetchStats, clearError } = useDashboard();

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
          <div className="space-x-4">
            <button
              onClick={fetchStats}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
            <button
              onClick={clearError}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Continuar sin datos
            </button>
          </div>
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
        {stats ? (
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
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No hay datos disponibles</h2>
            <p className="text-gray-600 mb-4">
              Comienza agregando algunas transacciones para ver tu dashboard
            </p>
            <button
              onClick={fetchStats}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Cargar datos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 
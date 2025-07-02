import React from 'react';
import { motion } from 'framer-motion';

import { useDashboard } from '../../hooks/useDashboard';
import { StatsCards } from './StatsCards';
import { RecentTransactions } from './RecentTransactions';
import { CategoryBreakdown } from './CategoryBreakdown';
import { MonthlyChart } from './MonthlyChart';
import { QuickActions } from './QuickActions';

import { 
  ArrowUpIcon,
  ChartBarIcon,
  ClockIcon,
  FireIcon
} from '@heroicons/react/24/outline';

export const Dashboard: React.FC = () => {
  const { stats, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="ios-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ios-card text-center p-8">
        <p className="ios-caption text-red-600 dark:text-red-400">
          Error al cargar los datos: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <section>
        <h2 className="ios-section-title">Resumen Financiero</h2>
        {stats && <StatsCards stats={stats} />}
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="ios-section-title">Acciones Rápidas</h2>
        <QuickActions />
      </section>

      {/* Recent Transactions */}
      <section>
        <div className="ios-card">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="ios-headline flex items-center space-x-2">
                <ClockIcon className="w-5 h-5 text-blue-500" />
                <span>Transacciones Recientes</span>
              </h3>
              <motion.button
                className="ios-button-secondary px-4 py-2 ios-haptic"
                whileTap={{ scale: 0.95 }}
              >
                Ver todas
              </motion.button>
            </div>
            {stats && <RecentTransactions transactions={stats.recentTransactions} />}
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <section>
          <div className="ios-card">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="ios-headline flex items-center space-x-2">
                  <ChartBarIcon className="w-5 h-5 text-green-500" />
                  <span>Gastos por Categoría</span>
                </h3>
              </div>
                             {stats && <CategoryBreakdown categories={stats.categoryBreakdown} />}
            </div>
          </div>
        </section>

        {/* Monthly Chart */}
        <section>
          <div className="ios-card">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="ios-headline flex items-center space-x-2">
                  <FireIcon className="w-5 h-5 text-purple-500" />
                  <span>Tendencia Mensual</span>
                </h3>
              </div>
                             {stats && <MonthlyChart data={stats.monthlyStats} />}
            </div>
          </div>
        </section>
      </div>

      {/* Insights Section */}
      <section>
        <div className="ios-card-large">
          <div className="p-8">
            <h3 className="ios-headline text-center mb-6">Insights de IA</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <ArrowUpIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h4 className="ios-body font-semibold mb-1">Ahorro Incrementado</h4>
                <p className="ios-caption text-gray-600 dark:text-gray-400">
                  Has ahorrado 15% más que el mes pasado
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <ChartBarIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h4 className="ios-body font-semibold mb-1">Gastos Optimizados</h4>
                <p className="ios-caption text-gray-600 dark:text-gray-400">
                  Reducción del 8% en gastos innecesarios
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <FireIcon className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h4 className="ios-body font-semibold mb-1">Meta Alcanzada</h4>
                <p className="ios-caption text-gray-600 dark:text-gray-400">
                  Has alcanzado el 75% de tu meta de ahorro
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}; 
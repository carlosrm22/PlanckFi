import React from 'react';
import { motion } from 'framer-motion';
import { useAuthContext } from '../../contexts/AuthContext';
import { useDashboard } from '../../hooks/useDashboard';
import { StatsCards } from './StatsCards';
import { RecentTransactions } from './RecentTransactions';
import { CategoryBreakdown } from './CategoryBreakdown';
import { MonthlyChart } from './MonthlyChart';
import { QuickActions } from './QuickActions';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../ui';
import { TrendingUp, AlertTriangle, RefreshCw, User, Calendar, DollarSign } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuthContext();
  const { stats, loading, error, fetchStats, clearError } = useDashboard();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accentA-500 rounded-neubrutalist flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-white animate-spin" />
          </div>
          <h3 className="text-xl font-bold mb-2">Cargando tu dashboard</h3>
          <p className="text-gray-600 dark:text-gray-300">Preparando tus datos financieros...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <Card variant="glass" className="text-center">
            <CardContent className="pt-8">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-neubrutalist flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Error al cargar datos</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={fetchStats} size="lg" className="neubrutalist-effect">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reintentar
                </Button>
                <Button onClick={clearError} variant="secondary" size="lg">
                  Continuar sin datos
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="glass-effect border-b border-white/20 dark:border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accentA-500 rounded-neubrutalist flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">
                  Dashboard Financiero
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <User className="w-4 h-4 text-gray-500" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Bienvenido, {user?.name || user?.email}
                  </p>
                  <Badge variant="success" icon={<Calendar className="w-3 h-3" />}>
                    {new Date().toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Badge>
                </div>
              </div>
            </div>
            <QuickActions />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {stats ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Stats Cards */}
            <section>
              <StatsCards stats={stats} />
            </section>

            {/* Charts and Transactions */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Monthly Chart */}
              <div className="lg:col-span-2">
                <Card variant="glass" className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-primary-500" />
                      <span>Evolución Mensual</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MonthlyChart data={stats.monthlyStats} />
                  </CardContent>
                </Card>
              </div>

              {/* Recent Transactions */}
              <div className="lg:col-span-1">
                <Card variant="glass" className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-accentA-500" />
                      <span>Transacciones Recientes</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RecentTransactions transactions={stats.recentTransactions} />
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Category Breakdown */}
            <section>
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-gradient-to-r from-primary-500 to-accentA-500 rounded-neubrutalist flex items-center justify-center">
                      <TrendingUp className="w-3 h-3 text-white" />
                    </div>
                    <span>Desglose por Categorías</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CategoryBreakdown categories={stats.categoryBreakdown} />
                </CardContent>
              </Card>
            </section>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <Card variant="glass" className="max-w-md mx-auto">
              <CardContent className="pt-8">
                <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-neubrutalist flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">No hay datos disponibles</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Comienza agregando algunas transacciones para ver tu dashboard financiero
                </p>
                <Button onClick={fetchStats} size="lg" className="neubrutalist-effect">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Cargar datos
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}; 
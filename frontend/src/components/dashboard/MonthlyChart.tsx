import React from 'react';
import { motion } from 'framer-motion';
import { MonthlyStats } from '../../types';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface MonthlyChartProps {
  data: MonthlyStats[];
}

export const MonthlyChart: React.FC<MonthlyChartProps> = ({ data }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Encontrar el valor máximo para escalar el gráfico
  const maxValue = Math.max(
    ...data.map(d => Math.max(d.income, d.expenses))
  );

  const getBarHeight = (value: number) => {
    return (value / maxValue) * 100;
  };

  const totalIncome = data.reduce((sum, d) => sum + d.income, 0);
  const totalExpenses = data.reduce((sum, d) => sum + d.expenses, 0);
  const netBalance = data.reduce((sum, d) => sum + d.balance, 0);

  return (
    <div className="space-y-6">
      {/* Leyenda */}
      <div className="flex items-center justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-accentA-500 rounded-neubrutalist"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">Ingresos</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-neubrutalist"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">Gastos</span>
        </div>
      </div>

      {/* Gráfico */}
      <div className="flex items-end justify-between space-x-4 h-48">
        {data.map((month, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex-1 flex flex-col items-center space-y-2"
          >
            {/* Barras */}
            <div className="w-full flex items-end space-x-1 h-32">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${getBarHeight(month.income)}%` }}
                transition={{ delay: index * 0.1 + 0.5, duration: 0.8, ease: "easeOut" }}
                className="flex-1 bg-gradient-to-t from-accentA-500 to-accentA-600 rounded-t-neubrutalist shadow-neubrutalist"
                title={`Ingresos: ${formatCurrency(month.income)}`}
              ></motion.div>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${getBarHeight(month.expenses)}%` }}
                transition={{ delay: index * 0.1 + 0.7, duration: 0.8, ease: "easeOut" }}
                className="flex-1 bg-gradient-to-t from-red-500 to-red-600 rounded-t-neubrutalist shadow-neubrutalist"
                title={`Gastos: ${formatCurrency(month.expenses)}`}
              ></motion.div>
            </div>
            
            {/* Mes */}
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {month.month}
            </span>
            
            {/* Balance */}
            <span className={`text-xs font-medium ${
              month.balance >= 0 ? 'text-accentA-600 dark:text-accentA-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(month.balance)}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Resumen */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="text-center p-4 bg-gradient-to-r from-accentA-500/10 to-accentA-600/10 rounded-neubrutalist">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-accentA-600" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Ingresos</p>
          </div>
          <p className="text-lg font-bold text-accentA-600 dark:text-accentA-400">
            {formatCurrency(totalIncome)}
          </p>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-neubrutalist">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-600" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Gastos</p>
          </div>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">
            {formatCurrency(totalExpenses)}
          </p>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-primary-500/10 to-primary-600/10 rounded-neubrutalist">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <DollarSign className="w-4 h-4 text-primary-600" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Balance Neto</p>
          </div>
          <p className={`text-lg font-bold ${
            netBalance >= 0 
              ? 'text-accentA-600 dark:text-accentA-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {formatCurrency(netBalance)}
          </p>
        </div>
      </motion.div>
    </div>
  );
}; 
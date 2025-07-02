import React from 'react';
import { motion } from 'framer-motion';
import { FinancialStats } from '../../types';
import { Card, CardContent } from '../ui';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PiggyBank, Activity } from 'lucide-react';

interface StatsCardsProps {
  stats: FinancialStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const cards = [
    {
      title: 'Balance Total',
      value: formatCurrency(stats.balance),
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: PiggyBank,
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-500/10',
    },
    {
      title: 'Ingresos',
      value: formatCurrency(stats.totalIncome),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'from-accentA-500 to-accentA-600',
      bgColor: 'bg-accentA-500/10',
    },
    {
      title: 'Gastos',
      value: formatCurrency(stats.totalExpenses),
      change: '-3.1%',
      changeType: 'negative' as const,
      icon: TrendingDown,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
    },
    {
      title: 'Transacciones',
      value: stats.recentTransactions.length.toString(),
      change: '+5',
      changeType: 'positive' as const,
      icon: Activity,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card variant="glass" className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {card.value}
                  </p>
                  <div className="flex items-center">
                    <div className={`flex items-center space-x-1 ${
                      card.changeType === 'positive' 
                        ? 'text-accentA-600 dark:text-accentA-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {card.changeType === 'positive' ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span className="text-sm font-medium">
                        {card.change}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      vs mes anterior
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-neubrutalist flex items-center justify-center shadow-neubrutalist`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}; 
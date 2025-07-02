import React from 'react';
import { motion } from 'framer-motion';
import { FinancialStats } from '../../types';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  CurrencyDollarIcon, 
  CreditCardIcon, 
  BanknotesIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';

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
      icon: BanknotesIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Ingresos',
      value: formatCurrency(stats.totalIncome),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: ArrowTrendingUpIcon,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Gastos',
      value: formatCurrency(stats.totalExpenses),
      change: '-3.1%',
      changeType: 'negative' as const,
      icon: ArrowTrendingDownIcon,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
    },
    {
      title: 'Transacciones',
      value: stats.recentTransactions.length.toString(),
      change: '+5',
      changeType: 'positive' as const,
      icon: ChartBarIcon,
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
          <div className="ios-card hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="ios-caption font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {card.title}
                  </p>
                  <p className="ios-headline text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {card.value}
                  </p>
                  <div className="flex items-center">
                    <div className={`flex items-center space-x-1 ${
                      card.changeType === 'positive' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {card.changeType === 'positive' ? (
                        <ArrowTrendingUpIcon className="w-3 h-3" />
                      ) : (
                        <ArrowTrendingDownIcon className="w-3 h-3" />
                      )}
                      <span className="ios-caption font-medium">
                        {card.change}
                      </span>
                    </div>
                    <span className="ios-caption text-gray-500 dark:text-gray-400 ml-2">
                      vs mes anterior
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}; 
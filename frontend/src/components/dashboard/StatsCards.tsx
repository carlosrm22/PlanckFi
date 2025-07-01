import React from 'react';
import { FinancialStats } from '../../types';

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
      icon: '💰',
      color: 'bg-blue-500',
    },
    {
      title: 'Ingresos',
      value: formatCurrency(stats.totalIncome),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: '📈',
      color: 'bg-green-500',
    },
    {
      title: 'Gastos',
      value: formatCurrency(stats.totalExpenses),
      change: '-3.1%',
      changeType: 'negative' as const,
      icon: '📉',
      color: 'bg-red-500',
    },
    {
      title: 'Transacciones',
      value: stats.recentTransactions.length.toString(),
      change: '+5',
      changeType: 'positive' as const,
      icon: '📊',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {card.value}
              </p>
              <div className="flex items-center mt-2">
                <span
                  className={`text-sm font-medium ${
                    card.changeType === 'positive'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {card.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
              </div>
            </div>
            <div
              className={`w-12 h-12 rounded-full ${card.color} flex items-center justify-center text-white text-xl`}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 
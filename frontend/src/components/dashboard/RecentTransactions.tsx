import React from 'react';
import { motion } from 'framer-motion';
import { Transaction } from '../../types';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-MX', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTransactionIcon = (type: 'income' | 'expense') => {
    return type === 'income' ? TrendingUp : TrendingDown;
  };

  const getTransactionColor = (type: 'income' | 'expense') => {
    return type === 'income' 
      ? 'text-accentA-600 dark:text-accentA-400' 
      : 'text-red-600 dark:text-red-400';
  };

  const getTransactionBgColor = (type: 'income' | 'expense') => {
    return type === 'income' 
      ? 'bg-accentA-500/10 dark:bg-accentA-500/20' 
      : 'bg-red-500/10 dark:bg-red-500/20';
  };

  const getTransactionIconColor = (type: 'income' | 'expense') => {
    return type === 'income' 
      ? 'bg-accentA-500' 
      : 'bg-red-500';
  };

  return (
    <div className="space-y-4">
      {transactions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-neubrutalist flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">No hay transacciones recientes</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-neubrutalist hover:shadow-neubrutalist transition-all duration-200 ${getTransactionBgColor(transaction.type)}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${getTransactionIconColor(transaction.type)} rounded-neubrutalist flex items-center justify-center shadow-neubrutalist`}>
                  {React.createElement(getTransactionIcon(transaction.type), { className: "w-5 h-5 text-white" })}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {transaction.category} • {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full text-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-sm flex items-center justify-center space-x-2 transition-colors">
          <span>Ver todas las transacciones</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}; 
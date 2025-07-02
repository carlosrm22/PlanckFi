import React from 'react';
import { motion } from 'framer-motion';
import { CategoryStats } from '../../types';

interface CategoryBreakdownProps {
  categories: CategoryStats[];
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ categories }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const totalAmount = categories.reduce((sum, cat) => sum + cat.amount, 0);

  return (
    <div className="space-y-4">
      {categories.map((category, index) => (
        <motion.div
          key={category.categoryId}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-4 rounded-neubrutalist hover:shadow-neubrutalist transition-all duration-200 bg-white/50 dark:bg-gray-800/50"
        >
          <div className="flex items-center space-x-3">
            <div
              className="w-4 h-4 rounded-neubrutalist shadow-neubrutalist"
              style={{ backgroundColor: category.color }}
            ></div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{category.categoryName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{category.percentage.toFixed(1)}%</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(category.amount)}
            </p>
          </div>
        </motion.div>
      ))}
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: categories.length * 0.1 }}
        className="pt-4 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-primary-500/10 to-accentA-500/10 rounded-neubrutalist">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total gastos</span>
          <span className="font-bold text-lg text-gradient">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </motion.div>
    </div>
  );
}; 
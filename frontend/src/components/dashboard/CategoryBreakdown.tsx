import React from 'react';
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

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category.categoryId} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: category.color }}
            ></div>
            <div>
              <p className="font-medium text-gray-900">{category.categoryName}</p>
              <p className="text-sm text-gray-500">{category.percentage}%</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900">
              {formatCurrency(category.amount)}
            </p>
          </div>
        </div>
      ))}
      
      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Total gastos</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(categories.reduce((sum, cat) => sum + cat.amount, 0))}
          </span>
        </div>
      </div>
    </div>
  );
}; 
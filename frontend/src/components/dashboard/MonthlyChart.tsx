import React from 'react';
import { MonthlyStats } from '../../types';

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

  return (
    <div className="space-y-6">
      {/* Leyenda */}
      <div className="flex items-center justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Ingresos</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-sm text-gray-600">Gastos</span>
        </div>
      </div>

      {/* Gráfico */}
      <div className="flex items-end justify-between space-x-4 h-48">
        {data.map((month, index) => (
          <div key={index} className="flex-1 flex flex-col items-center space-y-2">
            {/* Barras */}
            <div className="w-full flex items-end space-x-1 h-32">
              <div
                className="flex-1 bg-green-500 rounded-t"
                style={{ height: `${getBarHeight(month.income)}%` }}
                title={`Ingresos: ${formatCurrency(month.income)}`}
              ></div>
              <div
                className="flex-1 bg-red-500 rounded-t"
                style={{ height: `${getBarHeight(month.expenses)}%` }}
                title={`Gastos: ${formatCurrency(month.expenses)}`}
              ></div>
            </div>
            
            {/* Mes */}
            <span className="text-sm font-medium text-gray-600">
              {month.month}
            </span>
            
            {/* Balance */}
            <span className={`text-xs font-medium ${
              month.balance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(month.balance)}
            </span>
          </div>
        ))}
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-500">Total Ingresos</p>
          <p className="text-lg font-semibold text-green-600">
            {formatCurrency(data.reduce((sum, d) => sum + d.income, 0))}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Total Gastos</p>
          <p className="text-lg font-semibold text-red-600">
            {formatCurrency(data.reduce((sum, d) => sum + d.expenses, 0))}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Balance Neto</p>
          <p className={`text-lg font-semibold ${
            data.reduce((sum, d) => sum + d.balance, 0) >= 0 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            {formatCurrency(data.reduce((sum, d) => sum + d.balance, 0))}
          </p>
        </div>
      </div>
    </div>
  );
}; 
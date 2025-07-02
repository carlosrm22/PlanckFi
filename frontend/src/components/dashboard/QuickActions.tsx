import React from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  DocumentTextIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export const QuickActions: React.FC = () => {
  const actions = [
    {
      title: 'Nueva Transacción',
      description: 'Agregar ingreso o gasto',
      icon: PlusIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      action: () => console.warn('Nueva transacción')
    },
    {
      title: 'Subir Recibo',
      description: 'Escanea y procesa automáticamente',
      icon: DocumentTextIcon,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      action: () => console.warn('Subir recibo')
    },
    {
      title: 'Ver Análisis',
      description: 'Insights detallados',
      icon: ChartBarIcon,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      action: () => console.warn('Ver análisis')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map((action, index) => (
        <motion.div
          key={action.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="ios-card hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="ios-body font-semibold text-gray-900 dark:text-white">
                    {action.title}
                  </h3>
                  <p className="ios-caption text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}; 
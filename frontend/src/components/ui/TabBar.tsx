import React from 'react';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  ChartBarIcon, 
  PlusCircleIcon, 
  ReceiptIcon, 
  UserIcon 
} from '@heroicons/react/24/outline';

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  {
    id: 'dashboard',
    label: 'Inicio',
    icon: HomeIcon,
    path: '/dashboard'
  },
  {
    id: 'analytics',
    label: 'Análisis',
    icon: ChartBarIcon,
    path: '/analytics'
  },
  {
    id: 'add',
    label: 'Agregar',
    icon: PlusCircleIcon,
    path: '/add-transaction'
  },
  {
    id: 'receipts',
    label: 'Recibos',
    icon: ReceiptIcon,
    path: '/receipts'
  },
  {
    id: 'profile',
    label: 'Perfil',
    icon: UserIcon,
    path: '/profile'
  }
];

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="ios-tab-bar">
      <div className="flex justify-around items-center px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 ios-haptic ios-no-select ${
                isActive 
                  ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              whileTap={{ scale: 0.95 }}
              layout
            >
              <motion.div
                className="relative"
                layout
              >
                <Icon 
                  className={`w-6 h-6 transition-colors duration-200 ${
                    isActive ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'
                  }`}
                />
                {isActive && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"
                    layoutId="activeIndicator"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
              
              <motion.span
                className={`text-xs font-medium mt-1 transition-colors duration-200 ${
                  isActive 
                    ? 'text-blue-500' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                layout
              >
                {tab.label}
              </motion.span>
            </motion.button>
          );
        })}
      </div>
      
      {/* Indicador de tab activo */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
        layoutId="tabIndicator"
        initial={false}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{
          width: `${100 / tabs.length}%`,
          x: `${(tabs.findIndex(tab => tab.id === activeTab) * 100) / tabs.length}%`
        }}
      />
    </div>
  );
};

export default TabBar; 
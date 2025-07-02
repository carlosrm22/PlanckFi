import React from 'react';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  ChartPieIcon, 
  PlusIcon, 
  ReceiptRefundIcon, 
  UserCircleIcon 
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
    label: 'Gastos',
    icon: ChartPieIcon,
    path: '/analytics'
  },
  {
    id: 'add',
    label: 'Agregar',
    icon: PlusIcon,
    path: '/add-transaction'
  },
  {
    id: 'receipts',
    label: 'Recibos',
    icon: ReceiptRefundIcon,
    path: '/receipts'
  },
  {
    id: 'profile',
    label: 'Perfil',
    icon: UserCircleIcon,
    path: '/profile'
  }
];

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="ios-tab-bar ios-safe-area-inset-b">
      <ul className="ios-flex ios-justify-around ios-items-center ios-w-full ios-max-w-full ios-overflow-hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <li key={tab.id} className="ios-flex-1 ios-flex ios-justify-center">
              <button
                onClick={() => onTabChange(tab.id)}
                className={`ios-flex ios-flex-col ios-items-center ios-justify-center ios-py-1 ios-px-2 ios-rounded-xl ios-transition-all ios-duration-200 ios-haptic ios-no-select ios-min-w-0 ios-overflow-hidden focus:outline-none ${
                  isActive
                    ? 'ios-text-primary-500'
                    : 'ios-text-base-500 dark:ios-text-base-dark-500'
                }`}
                aria-label={tab.label}
              >
                <Icon
                  className={`ios-icon-tabbar ios-transition-colors ios-duration-200 ${
                    isActive ? 'ios-text-primary-500' : 'ios-text-base-500 dark:ios-text-base-dark-500'
                  }`}
                  aria-hidden="true"
                />
                <span
                  className={`ios-text-xs ios-font-medium ios-truncate ios-max-w-full ${
                    isActive ? 'ios-text-primary-500' : 'ios-text-base-500 dark:ios-text-base-dark-500'
                  }`}
                  style={{lineHeight: '1.1'}}
                >
                  {tab.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      
      {/* Indicador de tab activo */}
      <motion.div
        className="ios-absolute ios-bottom-0 ios-left-0 ios-right-0 ios-h-0.5 ios-bg-primary-500"
        layoutId="tabIndicator"
        initial={false}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{
          width: `${100 / tabs.length}%`,
          x: `${(tabs.findIndex(tab => tab.id === activeTab) * 100) / tabs.length}%`
        }}
      />
    </nav>
  );
};

export default TabBar; 
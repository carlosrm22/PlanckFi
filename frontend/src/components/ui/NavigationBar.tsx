import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  EllipsisHorizontalIcon,
  BellIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface NavigationBarProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: {
    icon: React.ComponentType<{ className?: string }>;
    onPress: () => void;
    label?: string;
  };
  subtitle?: string;
  transparent?: boolean;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  title,
  showBack = false,
  onBack,
  rightAction,
  subtitle,
  transparent = false
}) => {
  return (
    <motion.div
      className={`ios-nav-bar ${transparent ? 'bg-transparent border-none' : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-between">
        {/* Botón de regreso */}
        <div className="flex items-center">
          {showBack && (
            <motion.button
              onClick={onBack}
              className="p-2 rounded-full ios-haptic ios-no-select"
              whileTap={{ scale: 0.9 }}
              aria-label="Regresar"
            >
              <ArrowLeftIcon className="w-6 h-6 text-blue-500" />
            </motion.button>
          )}
        </div>

        {/* Título central */}
        <div className="flex-1 text-center px-4">
          <motion.h1
            className="ios-headline font-semibold text-gray-900 dark:text-white"
            layout
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              className="ios-caption text-gray-500 dark:text-gray-400 mt-1"
              layout
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Acción derecha */}
        <div className="flex items-center">
          {rightAction ? (
            <motion.button
              onClick={rightAction.onPress}
              className="p-2 rounded-full ios-haptic ios-no-select"
              whileTap={{ scale: 0.9 }}
              aria-label={rightAction.label || "Acción"}
            >
              {React.createElement(rightAction.icon, { className: "w-6 h-6 text-blue-500" })}
            </motion.button>
          ) : (
            <div className="w-10 h-10" />
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Componente de navegación con múltiples acciones
interface NavigationBarWithActionsProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  actions?: Array<{
    icon: React.ComponentType<{ className?: string }>;
    onPress: () => void;
    label?: string;
  }>;
  subtitle?: string;
}

export const NavigationBarWithActions: React.FC<NavigationBarWithActionsProps> = ({
  title,
  showBack = false,
  onBack,
  actions = [],
  subtitle
}) => {
  return (
    <motion.div
      className="ios-nav-bar"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-between">
        {/* Botón de regreso */}
        <div className="flex items-center">
          {showBack && (
            <motion.button
              onClick={onBack}
              className="p-2 rounded-full ios-haptic ios-no-select"
              whileTap={{ scale: 0.9 }}
              aria-label="Regresar"
            >
              <ArrowLeftIcon className="w-6 h-6 text-blue-500" />
            </motion.button>
          )}
        </div>

        {/* Título central */}
        <div className="flex-1 text-center px-4">
          <motion.h1
            className="ios-headline font-semibold text-gray-900 dark:text-white"
            layout
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              className="ios-caption text-gray-500 dark:text-gray-400 mt-1"
              layout
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Acciones derecha */}
        <div className="flex items-center space-x-1">
          {actions.map((action, index) => (
            <motion.button
              key={index}
              onClick={action.onPress}
              className="p-2 rounded-full ios-haptic ios-no-select"
              whileTap={{ scale: 0.9 }}
              aria-label={action.label || "Acción"}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {React.createElement(action.icon, { className: "w-6 h-6 text-blue-500" })}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Componente de navegación con menú
interface NavigationBarWithMenuProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  onMenuPress?: () => void;
  subtitle?: string;
}

export const NavigationBarWithMenu: React.FC<NavigationBarWithMenuProps> = ({
  title,
  showBack = false,
  onBack,
  onMenuPress,
  subtitle
}) => {
  return (
    <NavigationBar
      title={title}
      showBack={showBack}
      onBack={onBack}
      subtitle={subtitle}
      rightAction={{
        icon: EllipsisHorizontalIcon,
        onPress: onMenuPress || (() => {}),
        label: "Menú"
      }}
    />
  );
};

export default NavigationBar; 
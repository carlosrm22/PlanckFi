import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  EllipsisHorizontalIcon
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
      className={`ios-nav-bar ios-safe-area-inset-t ${transparent ? 'ios-bg-transparent ios-border-none' : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="ios-flex ios-items-center ios-justify-between ios-w-full ios-max-w-full ios-overflow-hidden">
        {/* Botón de regreso */}
        <div className="ios-flex ios-items-center ios-min-w-0">
          {showBack && (
            <motion.button
              onClick={onBack}
              className="ios-p-2 ios-rounded-full ios-haptic ios-no-select ios-bg-base-200 dark:ios-bg-base-dark-200"
              whileTap={{ scale: 0.9 }}
              aria-label="Regresar"
            >
              <ArrowLeftIcon className="ios-w-6 ios-h-6 ios-text-primary-500" />
            </motion.button>
          )}
        </div>

        {/* Título central */}
        <div className="ios-flex-1 ios-text-center ios-px-4 ios-min-w-0 ios-overflow-hidden">
          <motion.h1
            className="ios-headline ios-font-semibold ios-text-base-900 dark:ios-text-base-dark-100 ios-truncate"
            layout
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              className="ios-caption ios-text-base-500 dark:ios-text-base-dark-500 ios-mt-1 ios-truncate"
              layout
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Acción derecha */}
        <div className="ios-flex ios-items-center ios-min-w-0">
          {rightAction ? (
            <motion.button
              onClick={rightAction.onPress}
              className="ios-p-2 ios-rounded-full ios-haptic ios-no-select ios-bg-base-200 dark:ios-bg-base-dark-200"
              whileTap={{ scale: 0.9 }}
              aria-label={rightAction.label || "Acción"}
            >
              {React.createElement(rightAction.icon, { className: "ios-w-6 ios-h-6 ios-text-primary-500" })}
            </motion.button>
          ) : (
            <div className="ios-w-10 ios-h-10" />
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
      className="ios-nav-bar ios-safe-area-inset-t"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="ios-flex ios-items-center ios-justify-between ios-w-full ios-max-w-full ios-overflow-hidden">
        {/* Botón de regreso */}
        <div className="ios-flex ios-items-center ios-min-w-0">
          {showBack && (
            <motion.button
              onClick={onBack}
              className="ios-p-2 ios-rounded-full ios-haptic ios-no-select ios-bg-base-200 dark:ios-bg-base-dark-200"
              whileTap={{ scale: 0.9 }}
              aria-label="Regresar"
            >
              <ArrowLeftIcon className="ios-w-6 ios-h-6 ios-text-primary-500" />
            </motion.button>
          )}
        </div>

        {/* Título central */}
        <div className="ios-flex-1 ios-text-center ios-px-4 ios-min-w-0 ios-overflow-hidden">
          <motion.h1
            className="ios-headline ios-font-semibold ios-text-base-900 dark:ios-text-base-dark-100 ios-truncate"
            layout
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              className="ios-caption ios-text-base-500 dark:ios-text-base-dark-500 ios-mt-1 ios-truncate"
              layout
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Acciones derecha */}
        <div className="ios-flex ios-items-center ios-space-x-1 ios-min-w-0 ios-overflow-hidden">
          {actions.map((action, index) => (
            <motion.button
              key={index}
              onClick={action.onPress}
              className="ios-p-2 ios-rounded-full ios-haptic ios-no-select ios-bg-base-200 dark:ios-bg-base-dark-200"
              whileTap={{ scale: 0.9 }}
              aria-label={action.label || "Acción"}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {React.createElement(action.icon, { className: "ios-w-6 ios-h-6 ios-text-primary-500" })}
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
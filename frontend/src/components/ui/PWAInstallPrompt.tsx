import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '../../hooks/usePWA';
import { XMarkIcon, ArrowDownTrayIcon, ShareIcon } from '@heroicons/react/24/outline';

export const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, installApp, shareApp } = usePWA();

  if (isInstalled || !isInstallable) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-20 left-4 right-4 z-50 ios-card-large"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <ArrowDownTrayIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="ios-headline font-semibold text-gray-900 dark:text-white">
                Instalar PlanckFi
              </h3>
              <p className="ios-caption text-gray-500 dark:text-gray-400">
                Acceso rápido desde tu pantalla de inicio
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={shareApp}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 ios-haptic"
              whileTap={{ scale: 0.9 }}
              aria-label="Compartir"
            >
              <ShareIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
            
            <motion.button
              onClick={installApp}
              className="px-4 py-2 bg-blue-500 text-white rounded-full ios-button ios-haptic"
              whileTap={{ scale: 0.95 }}
            >
              Instalar
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Componente para mostrar estado offline
export const OfflineIndicator: React.FC = () => {
  const { isOnline } = usePWA();

  if (isOnline) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white px-4 py-2 text-center ios-caption"
      >
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span>Sin conexión - Modo offline activado</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Componente para mostrar actualización disponible
interface UpdatePromptProps {
  onUpdate: () => void;
  onDismiss: () => void;
}

export const UpdatePrompt: React.FC<UpdatePromptProps> = ({ onUpdate, onDismiss }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-20 left-4 right-4 z-50 ios-card"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <ArrowDownTrayIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="ios-body font-semibold text-gray-900 dark:text-white">
                Actualización disponible
              </h3>
              <p className="ios-caption text-gray-500 dark:text-gray-400">
                Nueva versión de PlanckFi lista
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={onDismiss}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 ios-haptic"
              whileTap={{ scale: 0.9 }}
              aria-label="Cerrar"
            >
              <XMarkIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
            
            <motion.button
              onClick={onUpdate}
              className="px-4 py-2 bg-green-500 text-white rounded-full ios-button ios-haptic"
              whileTap={{ scale: 0.95 }}
            >
              Actualizar
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAInstallPrompt; 
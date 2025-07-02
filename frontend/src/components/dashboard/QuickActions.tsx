import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, CardContent } from '../ui';
import { Plus, Camera, BarChart3, Settings, ChevronDown, Zap } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const actions = [
    {
      label: 'Agregar Transacción',
      icon: Plus,
      action: () => console.warn('Agregar transacción'),
      color: 'from-primary-500 to-primary-600',
      description: 'Registra un nuevo gasto o ingreso',
    },
    {
      label: 'Subir Recibo',
      icon: Camera,
      action: () => console.warn('Subir recibo'),
      color: 'from-accentA-500 to-accentA-600',
      description: 'Escanea y procesa automáticamente',
    },
    {
      label: 'Ver Reportes',
      icon: BarChart3,
      action: () => console.warn('Ver reportes'),
      color: 'from-purple-500 to-purple-600',
      description: 'Análisis detallado de tus finanzas',
    },
    {
      label: 'Configuración',
      icon: Settings,
      action: () => console.warn('Configuración'),
      color: 'from-gray-500 to-gray-600',
      description: 'Personaliza tu experiencia',
    },
  ];

  return (
    <div className="relative">
      <Button
        onClick={() => setShowDropdown(!showDropdown)}
        size="lg"
        className="neubrutalist-effect"
        icon={<Zap className="w-4 h-4" />}
      >
        Acciones Rápidas
        <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </Button>

      <AnimatePresence>
        {showDropdown && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-3 w-80 z-50"
            >
              <Card variant="glass" className="shadow-xl border border-white/20">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {actions.map((action, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          action.action();
                          setShowDropdown(false);
                        }}
                        className="w-full text-left p-3 rounded-neubrutalist hover:bg-white/10 dark:hover:bg-gray-800/50 transition-all duration-200 flex items-center space-x-3 group"
                      >
                        <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-neubrutalist flex items-center justify-center shadow-neubrutalist group-hover:shadow-neubrutalist-lg transition-all duration-200`}>
                          <action.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {action.label}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {action.description}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Overlay para cerrar dropdown */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}; 
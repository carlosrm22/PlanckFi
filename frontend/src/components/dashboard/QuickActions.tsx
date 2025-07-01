import React, { useState } from 'react';

export const QuickActions: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const actions = [
    {
      label: 'Agregar Transacción',
      icon: '➕',
      action: () => console.warn('Agregar transacción'),
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      label: 'Subir Recibo',
      icon: '📸',
      action: () => console.warn('Subir recibo'),
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      label: 'Ver Reportes',
      icon: '📊',
      action: () => console.warn('Ver reportes'),
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      label: 'Configuración',
      icon: '⚙️',
      action: () => console.warn('Configuración'),
      color: 'bg-gray-600 hover:bg-gray-700',
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
      >
        <span>Acciones Rápidas</span>
        <span className="text-sm">▼</span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  action.action();
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
              >
                <span className="text-lg">{action.icon}</span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overlay para cerrar dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </div>
  );
}; 
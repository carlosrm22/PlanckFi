import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavigationBar } from '../components/ui/NavigationBar';
import { TabBar } from '../components/ui/TabBar';
import { Dashboard } from '../components/dashboard/Dashboard';
import { useAuth } from '../hooks/useAuth';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    logout();
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Aquí podrías agregar navegación entre tabs
    console.warn('Cambiando a tab:', tab);
  };

  return (
    <div className="pwa-container">
      {/* Navigation Bar */}
      <NavigationBar
        title="PlanckFi"
        subtitle={`Hola, ${user?.displayName || 'Usuario'}`}
        rightAction={{
          icon: () => (
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          ),
          onPress: handleLogout,
          label: "Cerrar sesión"
        }}
      />

      {/* Contenido principal */}
      <div className="pwa-content ios-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="ios-fade-in"
        >
          <Dashboard />
        </motion.div>
      </div>

      {/* Tab Bar */}
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default DashboardPage; 
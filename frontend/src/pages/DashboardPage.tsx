import React from 'react';
import { motion } from 'framer-motion';
import { useAuthContext } from '../contexts/AuthContext';
import { Dashboard } from '../components/dashboard/Dashboard';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { Button, Badge } from '../components/ui';
import { Moon, Sun, Zap, LogOut, ArrowLeft } from 'lucide-react';

const DashboardPageContent: React.FC = () => {
  const { user, logout } = useAuthContext();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="glass-effect border-b border-white/20 dark:border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToHome}
                className="w-10 h-10 p-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accentA-500 rounded-neubrutalist flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">PlanckFi</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Dashboard Financiero
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="success">
                {user?.email}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-10 h-10 p-0"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                icon={<LogOut className="w-4 h-4" />}
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <Dashboard />
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  return (
    <ThemeProvider>
      <DashboardPageContent />
    </ThemeProvider>
  );
}; 
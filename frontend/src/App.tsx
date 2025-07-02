import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './contexts/ThemeContext';
import { SplashScreen } from './components/ui/SplashScreen';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { DynamicIsland } from './components/ui/DynamicIsland';
import { PWAInstallPrompt, OfflineIndicator } from './components/ui/PWAInstallPrompt';
import './App.css';

// Lazy loading para mejor performance iOS 18
const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(module => ({ default: module.default })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(module => ({ default: module.default })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(module => ({ default: module.default })));

// Componente de carga con skeleton iOS 18
const PageLoader: React.FC = () => (
  <div className="ios-min-h-screen ios-flex ios-flex-col ios-items-center ios-justify-center">
    <LoadingSpinner size="large" />
    <p className="ios-caption ios-mt-4">Cargando...</p>
  </div>
);

// Componente principal de la aplicación
const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const { isDark } = useTheme();

  // Mostrar splash screen durante la carga inicial
  if (loading) {
    return <SplashScreen />;
  }

  return (
    <div className={`ios-app ${isDark ? 'dark' : 'light'}`}>
      {/* Dynamic Island para iPhone 17 */}
      <DynamicIsland />
      
      {/* Contenido principal con Suspense */}
      <main className="ios-main">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Ruta principal - redirige según autenticación */}
            <Route 
              path="/" 
              element={user ? <Navigate to="/dashboard" replace /> : <HomePage />} 
            />
            
            {/* Rutas autenticadas */}
            <Route 
              path="/dashboard" 
              element={user ? <DashboardPage /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/profile" 
              element={user ? <ProfilePage /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/settings" 
              element={user ? <SettingsPage /> : <Navigate to="/" replace />} 
            />
            
            {/* Ruta catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      
      {/* Componentes PWA iOS 18 */}
      <PWAInstallPrompt />
      <OfflineIndicator />
    </div>
  );
};

// Componente raíz de la aplicación
const App: React.FC = () => {
  return <AppContent />;
};

export default App; 
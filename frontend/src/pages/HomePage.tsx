import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useTheme } from '../contexts/ThemeContext';
import { 
  MoonIcon, 
  SunIcon, 
  SparklesIcon
} from '@heroicons/react/24/outline';

const HomePageContent: React.FC = () => {
  const { user } = useAuth();
  const [isLogin, setIsLogin] = React.useState(true);
  const { theme, toggleTheme } = useTheme();

  // Si el usuario está autenticado, redirigir al dashboard
  React.useEffect(() => {
    if (user) {
      window.location.href = '/dashboard';
    }
  }, [user]);

  return (
    <div className="ios-min-h-screen ios-bg-base-100 dark:ios-bg-base-dark-100">
      {/* Header minimalista */}
      <header className="ios-nav-bar ios-safe-area-inset-t">
        <div className="ios-container ios-flex ios-items-center ios-justify-between">
          <div className="ios-flex ios-items-center ios-gap-3">
            <div className="ios-w-10 ios-h-10 ios-bg-gradient-to-r ios-from-primary-500 ios-to-system-purple ios-rounded-2xl ios-flex ios-items-center ios-justify-center">
              <SparklesIcon className="ios-w-6 ios-h-6 ios-text-white" />
            </div>
            <h1 className="ios-headline ios-font-bold ios-text-base-900 dark:ios-text-base-dark-100">PlanckFi</h1>
          </div>
          
          <motion.button
            onClick={toggleTheme}
            className="ios-p-2 ios-rounded-full ios-bg-base-200 dark:ios-bg-base-dark-200 ios-haptic"
            whileTap={{ scale: 0.9 }}
          >
            {theme === 'light' ? (
              <MoonIcon className="ios-w-5 ios-h-5 ios-text-base-700 dark:ios-text-base-dark-400" />
            ) : (
              <SunIcon className="ios-w-5 ios-h-5 ios-text-base-700 dark:ios-text-base-dark-400" />
            )}
          </motion.button>
        </div>
      </header>

      {/* Main Content - Solo formulario de autenticación */}
      <main className="ios-container ios-py-8 ios-safe-area-inset-x">
        <div className="ios-max-w-md ios-mx-auto">
          {/* Título centrado */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="ios-text-center ios-mb-8"
          >
            <h2 className="ios-title ios-text-2xl ios-font-bold ios-mb-2 ios-text-base-900 dark:ios-text-base-dark-100">
              Bienvenido a PlanckFi
            </h2>
            <p className="ios-body ios-text-base-600 dark:ios-text-base-dark-400">
              Gestiona tus finanzas personales de forma inteligente
            </p>
          </motion.div>

          {/* Formulario de autenticación */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="ios-card ios-p-6"
          >
            {isLogin ? (
              <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </motion.div>

          {/* Información adicional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="ios-text-center ios-mt-6"
          >
            <p className="ios-caption ios-text-base-500 dark:ios-text-base-dark-500">
              Al continuar, aceptas nuestros{' '}
              <a href="#" className="ios-text-primary-500 ios-font-medium">Términos de Servicio</a>
              {' '}y{' '}
              <a href="#" className="ios-text-primary-500 ios-font-medium">Política de Privacidad</a>
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

// Componente exportado
export const HomePage: React.FC = () => {
  return <HomePageContent />;
}; 
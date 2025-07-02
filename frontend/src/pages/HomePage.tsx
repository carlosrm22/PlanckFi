import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useTheme } from '../contexts/ThemeContext';
import { 
  MoonIcon, 
  SunIcon, 
  ChartBarIcon, 
  ShieldCheckIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  UserGroupIcon,
  DevicePhoneMobileIcon
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="ios-nav-bar">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="ios-headline font-bold text-gray-900 dark:text-white">PlanckFi</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-xs font-medium flex items-center space-x-1">
              <ChartBarIcon className="w-3 h-3" />
              <span>Beta</span>
            </div>
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 ios-haptic"
              whileTap={{ scale: 0.9 }}
            >
              {theme === 'light' ? (
                <MoonIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <SunIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="ios-container py-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="ios-title text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              El futuro de las finanzas personales
            </h2>
            <p className="ios-body text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              PlanckFi combina inteligencia artificial, diseño nativo y seguridad de nivel bancario 
              para revolucionar la gestión de tus finanzas personales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                className="ios-button px-8 py-3 flex items-center justify-center space-x-2"
                whileTap={{ scale: 0.95 }}
              >
                <CurrencyDollarIcon className="w-5 h-5" />
                <span>Empezar gratis</span>
              </motion.button>
              <motion.button 
                className="ios-button-secondary px-8 py-3 flex items-center justify-center space-x-2"
                whileTap={{ scale: 0.95 }}
              >
                <ShieldCheckIcon className="w-5 h-5" />
                <span>Ver demo</span>
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* Auth Section */}
        <section className="mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Features */}
              <div className="space-y-8">
                <div>
                  <h3 className="ios-headline text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    Únete a la revolución financiera
                  </h3>
                  <p className="ios-body text-gray-600 dark:text-gray-300 mb-8">
                    Accede a herramientas avanzadas de gestión financiera con la seguridad y confiabilidad que mereces.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {authFeatures.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {feature.title}
                        </h4>
                        <p className="ios-caption text-gray-600 dark:text-gray-300">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right side - Auth Forms */}
              <div className="flex justify-center">
                <div className="w-full">
                  {isLogin ? (
                    <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
                  ) : (
                    <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="ios-card h-full">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="ios-headline text-xl mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="ios-caption text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <div className="ios-card-large text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-blue-500 mb-2">
                    {stat.value}
                  </div>
                  <div className="ios-caption text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="ios-nav-bar border-t">
        <div className="text-center">
          <p className="ios-caption text-gray-600 dark:text-gray-300">
            &copy; 2025 PlanckFi. Diseñado con ❤️ para el futuro de las finanzas.
          </p>
        </div>
      </footer>
    </div>
  );
};

const authFeatures = [
  {
    title: 'Seguridad Avanzada',
    description: 'Encriptación de nivel bancario para proteger tus datos',
    icon: ShieldCheckIcon
  },
  {
    title: 'IA Inteligente',
    description: 'Análisis automático de gastos y recomendaciones personalizadas',
    icon: SparklesIcon
  },
  {
    title: 'Diseño Nativo',
    description: 'Experiencia de usuario como una app nativa de iPhone',
    icon: DevicePhoneMobileIcon
  },
  {
    title: 'Comunidad Activa',
    description: 'Únete a miles de usuarios que ya confían en PlanckFi',
    icon: UserGroupIcon
  }
];

const features = [
  {
    title: 'Gestión Inteligente',
    description: 'Controla tus gastos con IA que aprende de tus hábitos financieros',
    icon: ChartBarIcon
  },
  {
    title: 'Seguridad Total',
    description: 'Tus datos están protegidos con la más alta tecnología de encriptación',
    icon: ShieldCheckIcon
  },
  {
    title: 'Diseño Nativo',
    description: 'Experiencia fluida y natural como una app nativa de iOS',
    icon: DevicePhoneMobileIcon
  },
  {
    title: 'Análisis Avanzado',
    description: 'Insights detallados sobre tus patrones de gasto y ahorro',
    icon: SparklesIcon
  },
  {
    title: 'Comunidad',
    description: 'Conecta con otros usuarios y comparte mejores prácticas',
    icon: UserGroupIcon
  },
  {
    title: 'Acceso Universal',
    description: 'Disponible en todos tus dispositivos, sincronizado en tiempo real',
    icon: CurrencyDollarIcon
  }
];

const stats = [
  { value: '10K+', label: 'Usuarios Activos' },
  { value: '99.9%', label: 'Tiempo de Actividad' },
  { value: '24/7', label: 'Soporte Disponible' }
];

export const HomePage: React.FC = () => {
  return <HomePageContent />;
}; 
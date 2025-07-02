import React from 'react';
import { motion } from 'framer-motion';
import { AuthProvider, useAuthContext } from '../contexts/AuthContext';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '../components/ui';
import { Moon, Sun, Zap, TrendingUp, DollarSign, Shield } from 'lucide-react';

const HomePageContent: React.FC = () => {
  const { user } = useAuthContext();
  const [isLogin, setIsLogin] = React.useState(true);
  const { theme, toggleTheme } = useTheme();

  // Si el usuario está autenticado, redirigir al dashboard
  React.useEffect(() => {
    if (user) {
      window.location.href = '/dashboard';
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-white/20 dark:border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accentA-500 rounded-neubrutalist flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gradient">PlanckFi</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="success" icon={<TrendingUp className="w-3 h-3" />}>
                Beta
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gradient">
              El futuro de las finanzas personales
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              PlanckFi combina inteligencia artificial, diseño vanguardista y seguridad de nivel bancario 
              para revolucionar la gestión de tus finanzas personales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="neubrutalist-effect">
                <DollarSign className="w-5 h-5 mr-2" />
                Empezar gratis
              </Button>
              <Button variant="glass" size="lg">
                <Shield className="w-5 h-5 mr-2" />
                Ver demo
              </Button>
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
                  <h3 className="text-3xl font-bold mb-6 text-gradient">
                    Únete a la revolución financiera
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
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
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accentA-500 rounded-neubrutalist flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
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
              <Card variant="glass" interactive className="h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accentA-500 rounded-neubrutalist flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <Card variant="gradient" className="text-center">
            <CardContent className="pt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-4xl font-bold text-gradient mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="glass-effect border-t border-white/20 dark:border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600 dark:text-gray-300">
            <p>&copy; 2025 PlanckFi. Diseñado con ❤️ para el futuro de las finanzas.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const HomePage: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HomePageContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

// Datos de ejemplo
const features = [
  {
    title: "IA Inteligente",
    description: "Análisis automático de gastos y recomendaciones personalizadas para optimizar tus finanzas.",
    icon: Zap,
  },
  {
    title: "Seguridad Bancaria",
    description: "Encriptación de nivel militar y autenticación multifactor para proteger tus datos.",
    icon: Shield,
  },
  {
    title: "Diseño Vanguardista",
    description: "Interfaz moderna con glassmorphism y neubrutalist que proyecta confianza y elegancia.",
    icon: TrendingUp,
  },
];

const stats = [
  { value: "99.9%", label: "Uptime" },
  { value: "256-bit", label: "Encriptación" },
  { value: "24/7", label: "Soporte" },
];

const authFeatures = [
  {
    title: "Acceso Seguro",
    description: "Autenticación con Google y credenciales seguras para proteger tu cuenta.",
    icon: Shield,
  },
  {
    title: "Sincronización",
    description: "Tus datos se sincronizan automáticamente en todos tus dispositivos.",
    icon: Zap,
  },
  {
    title: "Privacidad Total",
    description: "Tus datos financieros están protegidos con encriptación de nivel bancario.",
    icon: TrendingUp,
  },
  {
    title: "Soporte 24/7",
    description: "Equipo de soporte disponible en cualquier momento para ayudarte.",
    icon: DollarSign,
  },
]; 
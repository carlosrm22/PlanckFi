import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginWithGoogle, loading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await login(email, password);
    } catch (err) {
      console.warn('Error en login:', err);
    }
  };

  const handleGoogleLogin = async () => {
    clearError();
    try {
      await loginWithGoogle();
    } catch (err) {
      console.warn('Error en login con Google:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="ios-w-full ios-max-w-md ios-mx-auto"
    >
      <div className="ios-card-large ios-relative ios-overflow-hidden">
        {/* Decorative gradient background */}
        <div className="ios-absolute ios-inset-0 ios-bg-gradient-to-br ios-from-primary-500/5 ios-to-system-purple/5" />
        
        <div className="ios-relative ios-z-10 ios-text-center ios-pb-6">
          <div className="ios-w-16 ios-h-16 ios-bg-gradient-to-r ios-from-primary-500 ios-to-system-purple ios-rounded-2xl ios-flex ios-items-center ios-justify-center ios-mx-auto ios-mb-4">
            <svg className="ios-w-8 ios-h-8 ios-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="ios-title ios-text-base-900 dark:ios-text-base-dark-100">
            Bienvenido de vuelta
          </h2>
          <p className="ios-caption ios-text-base-500 dark:ios-text-base-dark-500 ios-mt-2">
            Accede a tu cuenta PlanckFi
          </p>
        </div>

        <div className="ios-relative ios-z-10 ios-space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="ios-bg-system-red/10 dark:ios-bg-system-red/20 ios-border ios-border-system-red/20 dark:ios-border-system-red/30 ios-rounded-xl ios-p-4"
            >
              <p className="ios-text-system-red dark:ios-text-system-red/80 ios-text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="ios-space-y-4">
            <div className="ios-space-y-2">
              <label htmlFor="email" className="ios-block ios-text-sm ios-font-medium ios-text-base-700 dark:ios-text-base-dark-300">
                Correo Electrónico
              </label>
              <div className="ios-relative">
                <EnvelopeIcon className="ios-absolute ios-left-3 ios-top-1/2 ios-transform -ios-translate-y-1/2 ios-w-5 ios-h-5 ios-text-base-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="ios-input ios-pl-10"
                  required
                />
              </div>
            </div>

            <div className="ios-space-y-2">
              <label htmlFor="password" className="ios-block ios-text-sm ios-font-medium ios-text-base-700 dark:ios-text-base-dark-300">
                Contraseña
              </label>
              <div className="ios-relative">
                <LockClosedIcon className="ios-absolute ios-left-3 ios-top-1/2 ios-transform -ios-translate-y-1/2 ios-w-5 ios-h-5 ios-text-base-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="ios-input ios-pl-10 ios-pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ios-absolute ios-right-3 ios-top-1/2 ios-transform -ios-translate-y-1/2 ios-text-base-400 hover:ios-text-base-600 dark:hover:ios-text-base-dark-300 ios-haptic"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="ios-w-5 ios-h-5" />
                  ) : (
                    <EyeIcon className="ios-w-5 ios-h-5" />
                  )}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="ios-button ios-w-full ios-haptic"
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="ios-flex ios-items-center ios-justify-center ios-space-x-2">
                  <div className="ios-spinner"></div>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </motion.button>
          </form>

          <div className="ios-relative">
            <div className="ios-absolute ios-inset-0 ios-flex ios-items-center">
              <div className="ios-w-full ios-border-t ios-border-base-200 dark:ios-border-base-dark-200" />
            </div>
            <div className="ios-relative ios-flex ios-justify-center ios-text-sm">
              <span className="ios-px-4 ios-bg-base-100 dark:ios-bg-base-dark-100 ios-text-base-500 dark:ios-text-base-dark-500">
                O continúa con
              </span>
            </div>
          </div>

          <motion.button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="ios-button-secondary ios-w-full ios-haptic"
            whileTap={{ scale: 0.98 }}
          >
            <div className="ios-flex ios-items-center ios-justify-center ios-space-x-2">
              <svg className="ios-w-5 ios-h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continuar con Google</span>
            </div>
          </motion.button>

          <div className="ios-text-center ios-pt-4">
            <p className="ios-caption ios-text-base-500 dark:ios-text-base-dark-500">
              ¿No tienes cuenta?{' '}
              <button
                onClick={onSwitchToRegister}
                className="ios-text-primary-500 hover:ios-text-primary-600 ios-font-medium ios-transition-colors"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 
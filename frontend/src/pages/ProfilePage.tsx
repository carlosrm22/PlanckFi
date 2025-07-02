import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { NavigationBar } from '../components/ui/NavigationBar';
import { TabBar } from '../components/ui/TabBar';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="ios-page">
      {/* Navigation Bar */}
      <NavigationBar 
        title="Perfil"
        showBackButton={false}
      />

      {/* Contenido principal */}
      <main className="ios-main-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.55, 0.1, 0.4, 0.9] }}
          className="ios-container"
        >
          {/* Información del usuario */}
          <div className="ios-section">
            <div className="ios-card-large">
              <div className="ios-flex ios-items-center ios-gap-4">
                <div className="ios-avatar">
                  <div className="ios-avatar-placeholder">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>
                <div className="ios-flex ios-flex-col">
                  <h2 className="ios-headline">{user?.email || 'Usuario'}</h2>
                  <p className="ios-caption">Miembro desde 2024</p>
                </div>
              </div>
            </div>
          </div>

          {/* Configuraciones */}
          <div className="ios-section">
            <h3 className="ios-section-title">Configuración</h3>
            
            <div className="ios-list">
              <div className="ios-list-item">
                <div className="ios-flex ios-items-center ios-gap-3">
                  <div className="ios-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M10 6V10L13 13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="ios-body">Modo oscuro</span>
                </div>
                <div className="ios-switch" onClick={toggleTheme}>
                  <div className={`ios-switch-toggle ${theme === 'dark' ? 'active' : ''}`} />
                </div>
              </div>

              <div className="ios-list-item">
                <div className="ios-flex ios-items-center ios-gap-3">
                  <div className="ios-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M19 19L15 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="ios-body">Notificaciones</span>
                </div>
                <div className="ios-chevron">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M6 12L10 8L6 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="ios-list-item">
                <div className="ios-flex ios-items-center ios-gap-3">
                  <div className="ios-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 1L13.09 6.26L19 7.27L15 11.14L16.18 17.02L10 13.77L3.82 17.02L5 11.14L1 7.27L6.91 6.26L10 1Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="ios-body">Calificar app</span>
                </div>
                <div className="ios-chevron">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M6 12L10 8L6 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Información de la app */}
          <div className="ios-section">
            <h3 className="ios-section-title">Acerca de</h3>
            
            <div className="ios-list">
              <div className="ios-list-item">
                <div className="ios-flex ios-items-center ios-gap-3">
                  <div className="ios-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 1L13.09 6.26L19 7.27L15 11.14L16.18 17.02L10 13.77L3.82 17.02L5 11.14L1 7.27L6.91 6.26L10 1Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="ios-body">Versión</span>
                </div>
                <span className="ios-caption">1.0.0</span>
              </div>

              <div className="ios-list-item">
                <div className="ios-flex ios-items-center ios-gap-3">
                  <div className="ios-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 1L13.09 6.26L19 7.27L15 11.14L16.18 17.02L10 13.77L3.82 17.02L5 11.14L1 7.27L6.91 6.26L10 1Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="ios-body">Términos y condiciones</span>
                </div>
                <div className="ios-chevron">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M6 12L10 8L6 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="ios-list-item">
                <div className="ios-flex ios-items-center ios-gap-3">
                  <div className="ios-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 1L13.09 6.26L19 7.27L15 11.14L16.18 17.02L10 13.77L3.82 17.02L5 11.14L1 7.27L6.91 6.26L10 1Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="ios-body">Política de privacidad</span>
                </div>
                <div className="ios-chevron">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M6 12L10 8L6 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de cerrar sesión */}
          <div className="ios-section">
            <button
              onClick={handleSignOut}
              className="ios-button ios-button-danger ios-w-full"
            >
              Cerrar sesión
            </button>
          </div>
        </motion.div>
      </main>

      {/* Tab Bar */}
      <TabBar activeTab="profile" />
    </div>
  );
};

export default ProfilePage; 
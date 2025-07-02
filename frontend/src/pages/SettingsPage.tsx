import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="ios-page">
      {/* Contenido principal */}
      <main className="ios-main-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.55, 0.1, 0.4, 0.9] }}
          className="ios-container"
        >
          <div className="ios-section">
            <h1 className="ios-title">Configuración</h1>
          </div>

          {/* Configuraciones */}
          <div className="ios-section">
            <h3 className="ios-section-title">Apariencia</h3>
            
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
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SettingsPage; 
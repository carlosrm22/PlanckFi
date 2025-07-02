import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) {
    return null;
  }

  return (
    <motion.div
      className="ios-splash-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="ios-splash-content">
        {/* Logo animado */}
        <motion.div
          className="ios-splash-logo"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.55, 0.1, 0.4, 0.9],
            delay: 0.2 
          }}
        >
          <div className="ios-logo-icon">
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="80"
                height="80"
                rx="20"
                fill="url(#gradient)"
              />
              <path
                d="M25 25L55 55M55 25L25 55"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient
                  id="gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#0A84FF" />
                  <stop offset="100%" stopColor="#30D158" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>

        {/* Título animado */}
        <motion.h1
          className="ios-splash-title"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.6, 
            ease: [0.55, 0.1, 0.4, 0.9],
            delay: 0.4 
          }}
        >
          PlanckFi
        </motion.h1>

        {/* Subtítulo animado */}
        <motion.p
          className="ios-splash-subtitle"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.6, 
            ease: [0.55, 0.1, 0.4, 0.9],
            delay: 0.6 
          }}
        >
          Finanzas Inteligentes
        </motion.p>

        {/* Indicador de carga */}
        <motion.div
          className="ios-splash-loader"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.4, 
            ease: [0.55, 0.1, 0.4, 0.9],
            delay: 0.8 
          }}
        >
          <div className="ios-loading-dots">
            <motion.div
              className="ios-loading-dot"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5] 
              }}
              transition={{ 
                duration: 1.2, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            />
            <motion.div
              className="ios-loading-dot"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5] 
              }}
              transition={{ 
                duration: 1.2, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2 
              }}
            />
            <motion.div
              className="ios-loading-dot"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5] 
              }}
              transition={{ 
                duration: 1.2, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4 
              }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}; 
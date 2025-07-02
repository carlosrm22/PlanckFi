import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DynamicIslandProps {
  isVisible?: boolean;
  activity?: 'loading' | 'notification' | 'progress' | null;
  progress?: number;
  message?: string;
}

export const DynamicIsland: React.FC<DynamicIslandProps> = ({
  isVisible = false,
  activity = null,
  progress = 0,
  message = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (activity) {
      setIsExpanded(true);
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activity]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="ios-dynamic-island-container">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="ios-dynamic-island"
            initial={{ 
              width: 120, 
              height: 32, 
              borderRadius: 16,
              opacity: 0,
              y: -20
            }}
            animate={{ 
              width: activity === 'progress' ? 280 : 240,
              height: 60,
              borderRadius: 30,
              opacity: 1,
              y: 0
            }}
            exit={{ 
              width: 120, 
              height: 32, 
              borderRadius: 16,
              opacity: 0,
              y: -20
            }}
            transition={{
              duration: 0.3,
              ease: [0.55, 0.1, 0.4, 0.9]
            }}
          >
            <div className="ios-dynamic-island-content">
              {activity === 'loading' && (
                <div className="ios-dynamic-island-loading">
                  <motion.div
                    className="ios-dynamic-island-spinner"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  <span className="ios-dynamic-island-text">Cargando...</span>
                </div>
              )}

              {activity === 'notification' && (
                <div className="ios-dynamic-island-notification">
                  <div className="ios-dynamic-island-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 1V8L11 11"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="ios-dynamic-island-text">{message}</span>
                </div>
              )}

              {activity === 'progress' && (
                <div className="ios-dynamic-island-progress">
                  <div className="ios-dynamic-island-progress-bar">
                    <motion.div
                      className="ios-dynamic-island-progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{
                        duration: 0.5,
                        ease: [0.55, 0.1, 0.4, 0.9]
                      }}
                    />
                  </div>
                  <span className="ios-dynamic-island-text">{Math.round(progress)}%</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 
import { useState, useEffect } from 'react';

interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<PWAInstallPrompt | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Detectar si la app es instalable
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as any);
      setIsInstallable(true);
    };

    // Detectar si ya está instalada
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Detectar estado de conexión
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Detectar si ya está instalada (iOS)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInStandaloneMode = isIOS && isStandalone;

    if (isInStandaloneMode) {
      setIsInstalled(true);
    }

    // Event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const installApp = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error instalando PWA:', error);
      return false;
    }
  };

  const checkForUpdate = async (): Promise<boolean> => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          return true;
        }
      } catch (error) {
        console.error('Error verificando actualizaciones:', error);
      }
    }
    return false;
  };

  const shareApp = async (): Promise<boolean> => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PlanckFi - Finanzas Inteligentes',
          text: 'Descubre PlanckFi, tu app de finanzas personales con IA y diseño nativo',
          url: window.location.origin
        });
        return true;
      } catch (error) {
        console.error('Error compartiendo app:', error);
        return false;
      }
    }
    return false;
  };

  const addToHomeScreen = (): void => {
    // Para iOS, mostrar instrucciones
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      alert('Para instalar PlanckFi en tu iPhone:\n\n1. Toca el botón Compartir\n2. Selecciona "Agregar a Pantalla de Inicio"\n3. Toca "Agregar"');
    } else {
      // Para Android, usar el prompt nativo
      installApp();
    }
  };

  return {
    isInstallable,
    isInstalled,
    isOnline,
    installApp,
    checkForUpdate,
    shareApp,
    addToHomeScreen
  };
}; 
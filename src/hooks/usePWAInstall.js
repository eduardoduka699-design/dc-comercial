import { useState, useEffect } from 'react';

let globalDeferredPrompt = null;

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(globalDeferredPrompt);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    // Detecta se já está rodando instalado como PWA (modo standalone)
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(Boolean(isStandaloneMode));
    };

    checkStandalone();

    const handleBeforeInstallPrompt = (e) => {
      // Previne o banner padrão e armazena o evento
      e.preventDefault();
      globalDeferredPrompt = e;
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      globalDeferredPrompt = null;
      setDeferredPrompt(null);
      setIsStandalone(true);
      setShowInstallGuide(false);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  const promptInstall = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult?.outcome === 'accepted') {
          globalDeferredPrompt = null;
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.error('Erro ao acionar prompt de instalação:', err);
        setShowInstallGuide(true);
      }
    } else {
      // Se não há prompt nativo disponível (iOS, navegador já instalado ou desktop sem evento disparado)
      setShowInstallGuide(true);
    }
  };

  return {
    isInstallable: !isStandalone,
    isStandalone,
    isIOS,
    promptInstall,
    showInstallGuide,
    setShowInstallGuide,
    hasNativePrompt: Boolean(deferredPrompt)
  };
}

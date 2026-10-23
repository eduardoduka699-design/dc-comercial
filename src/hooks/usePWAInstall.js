import { useState, useEffect } from 'react';

let globalDeferredPrompt = null;

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(globalDeferredPrompt);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    // Detecta se REALMENTE está rodando como app instalado (modo standalone exclusivo)
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches || 
        window.matchMedia('(display-mode: fullscreen)').matches ||
        window.navigator.standalone === true;
      setIsStandalone(Boolean(isStandaloneMode));
    };

    checkStandalone();

    const handleBeforeInstallPrompt = (e) => {
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

  // Detecta se o usuário está dentro do navegador interno do WhatsApp, Instagram, etc.
  const isInAppBrowser = typeof navigator !== 'undefined' && (
    /FBAN|FBAV|Instagram|WhatsApp|Telegram|Line|Twitter|Snapchat/i.test(navigator.userAgent)
  );

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
      // Se não há prompt nativo (iOS, Webview/WhatsApp ou navegador sem evento), exibe o guia
      setShowInstallGuide(true);
    }
  };

  return {
    isInstallable: !isStandalone,
    isStandalone,
    isIOS,
    isInAppBrowser,
    promptInstall,
    showInstallGuide,
    setShowInstallGuide,
    hasNativePrompt: Boolean(deferredPrompt)
  };
}

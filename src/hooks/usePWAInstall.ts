import { useEffect, useState } from "react";

export const usePWAInstall = () => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone
    ) {
      setIsInstalled(true);
    }

    setIsIOS(/iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()));

    if ((window as any).__pwaInstallPrompt) {
      setInstallPrompt((window as any).__pwaInstallPrompt);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const triggerInstall = async (): Promise<"accepted" | "dismissed" | "guide"> => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === "accepted") {
        setInstalled(true);
        setInstallPrompt(null);
        delete (window as any).__pwaInstallPrompt;
        return "accepted";
      }
      return "dismissed";
    }
    return "guide";
  };

  return {
    isInstalled: isInstalled || installed,
    isIOS,
    triggerInstall,
  };
};

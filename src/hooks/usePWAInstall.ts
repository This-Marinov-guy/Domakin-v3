import { useEffect, useState } from "react";

export type PWAInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export const usePWAInstall = () => {
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPromptEvent | null>(null);
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
      setInstallPrompt((window as any).__pwaInstallPrompt as PWAInstallPromptEvent);
    }

    const handler = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as PWAInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const triggerInstall = async (): Promise<"accepted" | "dismissed" | "guide"> => {
    if (installPrompt) {
      try {
        await installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;

        if (outcome === "accepted") {
          setInstalled(true);
        }

        setInstallPrompt(null);
        delete (window as any).__pwaInstallPrompt;
        return outcome;
      } catch {
        return "guide";
      }
    }

    return "guide";
  };

  return {
    canInstall: Boolean(installPrompt),
    isInstalled: isInstalled || installed,
    isIOS,
    triggerInstall,
  };
};

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Type-safe definition of the beforeinstallprompt event (not part of standard DOM)
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
  interface Navigator {
    standalone?: boolean;
  }
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // ✅ Detect iOS (since beforeinstallprompt is not supported on Safari)
    const userAgent = navigator.userAgent.toLowerCase();
    const iOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isInStandalone =
      typeof navigator.standalone !== "undefined" && navigator.standalone;
    setIsIOS(iOSDevice && !isInStandalone);

    // ✅ Handle Android or other platforms with beforeinstallprompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      setIsVisible(false);
      setDeferredPrompt(null);
    }
  };

  // ✅ iOS “Add to Home Screen” hint (Safari)
  if (isIOS) {
    return (
      <Card className='fixed bottom-4 right-4 z-50 w-80 shadow-lg bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 backdrop-blur'>
        <CardContent className='p-4 text-center space-y-3'>
          <p className='text-sm text-gray-700 dark:text-gray-200'>
            To install this app, tap <strong>Share</strong> →{" "}
            <strong>Add to Home Screen</strong>
          </p>
        </CardContent>
      </Card>
    );
  }

  // ✅ Android/other devices install prompt
  if (!isVisible) return null;

  return (
    <Card className='fixed bottom-4 right-4 z-50 w-80 shadow-lg bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 backdrop-blur'>
      <CardContent className='p-4 flex flex-col items-center space-y-3 text-center'>
        <p className='text-sm text-gray-700 dark:text-gray-200'>
          Install the <strong>FEDCOOP App</strong> for a better experience.
        </p>
        <Button
          onClick={handleInstall}
          className='w-full bg-amber-500 hover:bg-amber-600 text-white font-medium transition-all'>
          Install App
        </Button>
      </CardContent>
    </Card>
  );
}

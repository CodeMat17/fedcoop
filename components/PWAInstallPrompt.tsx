"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, X, Share } from "lucide-react";

// Type-safe definition for beforeinstallprompt event
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
    const userAgent = navigator.userAgent.toLowerCase();
    const iOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isInStandalone =
      typeof navigator.standalone !== "undefined" && navigator.standalone;
    setIsIOS(iOSDevice && !isInStandalone);

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
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

  const handleDismiss = () => setIsVisible(false);

  return (
    <AnimatePresence>
      {/* ✅ iOS “Add to Home Screen” hint */}
      {isIOS && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className='fixed bottom-6 right-6 z-50'>
          <Card className='bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/70 border border-gray-200 dark:border-gray-700 backdrop-blur-xl shadow-xl w-80 rounded-2xl'>
            <CardContent className='p-5 text-center space-y-3'>
              <div className='flex justify-center text-amber-500'>
                <Share size={28} />
              </div>
              <p className='text-sm text-gray-700 dark:text-gray-200'>
                To install the <strong>FEDCOOP App</strong>, tap{" "}
                <span className='font-medium'>Share</span> →{" "}
                <span className='font-medium'>Add to Home Screen</span>.
              </p>
              <Button
                onClick={handleDismiss}
                variant='ghost'
                className='text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'>
                Got it
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ✅ Android / other devices */}
      {!isIOS && isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className='fixed bottom-6 right-6 z-50'>
          <Card className='bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/70 border border-gray-200 dark:border-gray-700 backdrop-blur-xl shadow-xl w-80 rounded-2xl'>
            <CardContent className='p-5 text-center space-y-4'>
              <div className='flex justify-between items-start'>
                <h3 className='text-base font-semibold text-gray-900 dark:text-white'>
                  Install FEDCOOP App
                </h3>
                <button
                  onClick={handleDismiss}
                  className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors'>
                  <X size={18} />
                </button>
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                Get faster access, offline capability, and real-time updates.
              </p>
              <Button
                onClick={handleInstall}
                className='w-full bg-amber-500 hover:bg-amber-600 text-white font-medium flex items-center justify-center gap-2 transition-all shadow-sm'>
                <Download size={18} /> Install App
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

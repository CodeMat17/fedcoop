"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, X, Clock, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsStandalone(true);
      return;
    }

    // Check for iOS
    const isIos = () => {
      return (
        [
          "iPad Simulator",
          "iPhone Simulator",
          "iPod Simulator",
          "iPad",
          "iPhone",
          "iPod",
        ].includes(navigator.platform) ||
        (navigator.userAgent.includes("Mac") && "ontouchend" in document)
      );
    };

    setIsIOS(isIos());

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Show prompt after a delay
      const hasSeenPrompt = localStorage.getItem("pwa-prompt-dismissed");
      const promptDismissTime = localStorage.getItem(
        "pwa-prompt-dismissed-time"
      );

      if (!hasSeenPrompt) {
        setTimeout(() => setShowPrompt(true), 5000);
      } else if (promptDismissTime) {
        // Show again after 7 days if they chose "Remind Later"
        const dismissTime = parseInt(promptDismissTime);
        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        if (Date.now() - dismissTime > sevenDays) {
          setTimeout(() => setShowPrompt(true), 2000);
        }
      }
    };

    // Handle app installed event
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowPrompt(false);
      setShowIOSInstructions(false);
      localStorage.setItem("pwa-prompt-dismissed", "true");
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );
    window.addEventListener("appinstalled", handleAppInstalled);

    // For iOS, show instructions after a delay if not dismissed
    if (isIos()) {
      const hasDismissedIOS = localStorage.getItem(
        "ios-instructions-dismissed"
      );
      if (!hasDismissedIOS) {
        setTimeout(() => setShowIOSInstructions(true), 8000);
      }
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("PWA installed successfully");
      }
    }
    setShowPrompt(false);
    localStorage.setItem("pwa-prompt-dismissed", "true");
    localStorage.setItem("pwa-prompt-dismissed-time", Date.now().toString());
  };

  const handleRemindLater = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-prompt-dismissed-time", Date.now().toString());
  };

  const handleCancel = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-prompt-dismissed", "true");
    localStorage.setItem("pwa-prompt-dismissed-time", Date.now().toString());
  };

  const handleDismissIOS = () => {
    setShowIOSInstructions(false);
    localStorage.setItem("ios-instructions-dismissed", "true");
  };

  // Don't show if already in standalone mode
  if (isStandalone) {
    return null;
  }

  return (
    <>
      {/* Main Install Prompt for Android/Desktop */}
      <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <div className='flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4'>
              <Download className='w-8 h-8 text-primary' />
            </div>
            <DialogTitle className='text-center text-xl'>
              Install FEDCOOP App
            </DialogTitle>
            <DialogDescription className='text-center text-base'>
              Get the full app experience with quick access and better
              performance.
            </DialogDescription>
          </DialogHeader>

          <div className='bg-muted/50 rounded-lg p-4 text-center'>
            <Smartphone className='w-12 h-12 text-primary mx-auto mb-2' />
            <p className='text-sm text-muted-foreground'>
              Works offline • Fast loading • Home screen access
            </p>
          </div>

          <DialogFooter className='flex flex-col sm:flex-row gap-3'>
            <Button
              variant='outline'
              onClick={handleCancel}
              className='order-3 sm:order-3'>
              <X className='w-4 h-4 mr-2' />
              Cancel
            </Button>
            <Button
              variant='outline'
              onClick={handleRemindLater}
              className='order-2 sm:order-2'>
              <Clock className='w-4 h-4 mr-2' />
              Remind Later
            </Button>
            {!isIOS && deferredPrompt && (
              <Button onClick={handleInstall} className='order-1 sm:order-1'>
                <Download className='w-4 h-4 mr-2' />
                Install App
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* iOS Installation Instructions Banner */}
      {isIOS && showIOSInstructions && (
        <div className='fixed bottom-4 left-4 right-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground p-4 rounded-xl shadow-2xl z-50 animate-in slide-in-from-bottom-4 duration-500 border border-primary/20'>
          <div className='flex items-start gap-3'>
            <div className='flex-shrink-0 w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center'>
              <Download className='w-5 h-5 text-primary-foreground' />
            </div>
            <div className='flex-1'>
              <h3 className='font-bold text-sm'>Add FEDCOOP to Home Screen</h3>
              <p className='text-xs opacity-90 mt-1'>
                Tap{" "}
                <span className='font-bold bg-primary-foreground/20 px-1 rounded'>
                  Share
                </span>{" "}
                then{" "}
                <span className='font-bold bg-primary-foreground/20 px-1 rounded'>
                  Add to Home Screen
                </span>
              </p>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleDismissIOS}
              className='text-primary-foreground hover:bg-primary-foreground/20 flex-shrink-0 -mt-1 -mr-2'>
              <X className='w-4 h-4' />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

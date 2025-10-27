"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Download,
  X,
  Clock,
  Smartphone,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

type InstallationState = "idle" | "installing" | "success" | "error";

interface DeferredPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface StorageState {
  pwaPromptDismissed: boolean;
  pwaPromptDismissedTime: number | null;
  iosInstructionsDismissed: boolean;
}

interface StorageUpdates {
  pwaPromptDismissed?: boolean;
  pwaPromptDismissedTime?: number | null;
  iosInstructionsDismissed?: boolean;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<DeferredPrompt | null>(
    null
  );
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [installationState, setInstallationState] =
    useState<InstallationState>("idle");

  // Check environment and capabilities
  const checkEnvironment = useCallback(() => {
    if (typeof window === "undefined") return null;

    // Check if already in standalone mode
    const isInStandaloneMode = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    setIsStandalone(isInStandaloneMode);

    // Check for iOS
    const userAgent = navigator.userAgent.toLowerCase();
    const isIPad = /macintosh/.test(userAgent) && "ontouchend" in document;
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) || isIPad;
    setIsIOS(isIOSDevice);

    return { isInStandaloneMode, isIOSDevice };
  }, []);

  // Get storage state safely
  const getStorageState = useCallback((): StorageState => {
    if (typeof window === "undefined") {
      return {
        pwaPromptDismissed: false,
        pwaPromptDismissedTime: null,
        iosInstructionsDismissed: false,
      };
    }

    try {
      const pwaPromptDismissed =
        localStorage.getItem("pwa-prompt-dismissed") === "true";

      const pwaPromptDismissedTimeStr = localStorage.getItem(
        "pwa-prompt-dismissed-time"
      );
      const pwaPromptDismissedTime = pwaPromptDismissedTimeStr
        ? parseInt(pwaPromptDismissedTimeStr, 10)
        : null;

      const iosInstructionsDismissed =
        localStorage.getItem("ios-instructions-dismissed") === "true";

      return {
        pwaPromptDismissed,
        pwaPromptDismissedTime,
        iosInstructionsDismissed,
      };
    } catch {
      return {
        pwaPromptDismissed: false,
        pwaPromptDismissedTime: null,
        iosInstructionsDismissed: false,
      };
    }
  }, []);

  // Set storage state safely with proper null handling
  const setStorageState = useCallback((updates: StorageUpdates) => {
    if (typeof window === "undefined") return;

    try {
      if (updates.pwaPromptDismissed !== undefined) {
        localStorage.setItem(
          "pwa-prompt-dismissed",
          updates.pwaPromptDismissed.toString()
        );
      }

      if (updates.pwaPromptDismissedTime !== undefined) {
        // Handle null case properly
        if (updates.pwaPromptDismissedTime === null) {
          localStorage.removeItem("pwa-prompt-dismissed-time");
        } else {
          localStorage.setItem(
            "pwa-prompt-dismissed-time",
            updates.pwaPromptDismissedTime.toString()
          );
        }
      }

      if (updates.iosInstructionsDismissed !== undefined) {
        localStorage.setItem(
          "ios-instructions-dismissed",
          updates.iosInstructionsDismissed.toString()
        );
      }
    } catch (error) {
      console.warn("Failed to access localStorage:", error);
    }
  }, []);

  // Handle installation events
  useEffect(() => {
    const environment = checkEnvironment();
    if (!environment || environment.isInStandaloneMode) return;

    const storageState = getStorageState();

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();

      const deferredPromptEvent = event as unknown as DeferredPrompt;
      setDeferredPrompt(deferredPromptEvent);

      // Show prompt based on storage state with proper null checking
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      const currentTime = Date.now();

      let shouldShowPrompt = false;

      if (!storageState.pwaPromptDismissed) {
        // Never shown before
        shouldShowPrompt = true;
      } else if (
        storageState.pwaPromptDismissedTime !== null &&
        currentTime - storageState.pwaPromptDismissedTime > sevenDaysMs
      ) {
        // Shown before but more than 7 days ago
        shouldShowPrompt = true;
      }

      if (shouldShowPrompt) {
        const timeoutId = setTimeout(() => setShowPrompt(true), 3000);
        return () => clearTimeout(timeoutId);
      }
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowPrompt(false);
      setInstallationState("success");
      setStorageState({ pwaPromptDismissed: true });

      const timeoutId = setTimeout(() => setInstallationState("idle"), 3000);
      return () => clearTimeout(timeoutId);
    };

    // Add event listeners
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Show iOS instructions if applicable
    if (environment.isIOSDevice && !storageState.iosInstructionsDismissed) {
      const timeoutId = setTimeout(() => setShowIOSInstructions(true), 5000);
      return () => clearTimeout(timeoutId);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [checkEnvironment, getStorageState, setStorageState]);

  const handleInstall = async (): Promise<void> => {
    if (!deferredPrompt) {
      setInstallationState("error");
      return;
    }

    try {
      setInstallationState("installing");
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setInstallationState("success");
      } else {
        setInstallationState("idle");
      }
    } catch {
      setInstallationState("error");
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
    setStorageState({
      pwaPromptDismissed: true,
      pwaPromptDismissedTime: Date.now(),
    });
  };

  const handleRemindLater = (): void => {
    setShowPrompt(false);
    setStorageState({ pwaPromptDismissedTime: Date.now() });
  };

  const handleCancel = (): void => {
    setShowPrompt(false);
    setStorageState({
      pwaPromptDismissed: true,
      pwaPromptDismissedTime: Date.now(),
    });
  };

  const handleDismissIOS = (): void => {
    setShowIOSInstructions(false);
    setStorageState({ iosInstructionsDismissed: true });
  };

  if (isStandalone) {
    return null;
  }

  return (
    <>
      {/* Installation Status */}
      {installationState === "success" && (
        <div className='fixed bottom-4 left-4 right-4 bg-green-500 text-white p-4 rounded-xl shadow-2xl z-50 animate-in slide-in-from-bottom-4'>
          <div className='flex items-center gap-3'>
            <CheckCircle className='w-6 h-6 flex-shrink-0' />
            <div className='flex-1'>
              <h3 className='font-bold text-sm'>FEDCOOP Installed!</h3>
              <p className='text-xs opacity-90'>
                App added to your home screen.
              </p>
            </div>
          </div>
        </div>
      )}

      {installationState === "error" && (
        <div className='fixed bottom-4 left-4 right-4 bg-red-500 text-white p-4 rounded-xl shadow-2xl z-50 animate-in slide-in-from-bottom-4'>
          <div className='flex items-center gap-3'>
            <AlertCircle className='w-6 h-6 flex-shrink-0' />
            <div className='flex-1'>
              <h3 className='font-bold text-sm'>Installation Failed</h3>
              <p className='text-xs opacity-90'>
                Try again or use browser menu.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Install Prompt */}
      <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <div className='flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4'>
              <Download className='w-8 h-8 text-primary' />
            </div>
            <DialogTitle className='text-center text-xl'>
              Install FEDCOOP App
            </DialogTitle>
            <DialogDescription className='text-center'>
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
            <Button variant='outline' onClick={handleCancel}>
              <X className='w-4 h-4 mr-2' />
              Cancel
            </Button>
            <Button variant='outline' onClick={handleRemindLater}>
              <Clock className='w-4 h-4 mr-2' />
              Later
            </Button>
            {!isIOS && deferredPrompt && (
              <Button
                onClick={handleInstall}
                disabled={installationState === "installing"}>
                {installationState === "installing" ? (
                  <>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2' />
                    Installing...
                  </>
                ) : (
                  <>
                    <Download className='w-4 h-4 mr-2' />
                    Install
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* iOS Instructions */}
      {isIOS && showIOSInstructions && (
        <div className='fixed bottom-4 left-4 right-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground p-4 rounded-xl shadow-2xl z-50 border border-primary/20'>
          <div className='flex items-start gap-3'>
            <div className='flex-shrink-0 w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center'>
              <Download className='w-5 h-5' />
            </div>
            <div className='flex-1'>
              <h3 className='font-bold text-sm'>Add to Home Screen</h3>
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
              className='flex-shrink-0 -mt-1 -mr-2'>
              <X className='w-4 h-4' />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

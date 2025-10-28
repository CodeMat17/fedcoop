"use client";

import { useEffect } from "react";

/**
 * Registers the service worker at /sw.js in a Turbopack-friendly way.
 * No 'any' used — uses platform types.
 */
export function PWARegister(): null {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) {
      console.warn("Service Worker not supported in this browser.");
      return;
    }

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        console.info("✅ Service Worker registered:", registration);

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New content available; you can show a toast to the user to refresh
              console.info("♻️ New version available.");
            }
          });
        });
      } catch (error) {
        console.error("❌ Service Worker registration failed:", error);
      }
    };

    register();

    // optional cleanup: attempt update on unmount
    return () => {
      if ("serviceWorker" in navigator && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready
          .then((reg) => reg.update())
          .catch(() => {});
      }
    };
  }, []);

  return null;
}

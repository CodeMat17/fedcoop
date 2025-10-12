"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRef } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    // Perform the circular animation
    if (buttonRef.current && "startViewTransition" in document) {
      const { top, left, width, height } =
        buttonRef.current.getBoundingClientRect();
      const y = top + height / 2;
      const x = left + width / 2;
      const right = window.innerWidth - left;
      const bottom = window.innerHeight - top;
      const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

      // Set CSS custom properties for the animation
      document.documentElement.style.setProperty("--x", `${x}px`);
      document.documentElement.style.setProperty("--y", `${y}px`);
      document.documentElement.style.setProperty("--max-rad", `${maxRad}px`);

      // Start the view transition with a slight delay to ensure CSS variables are set
      setTimeout(() => {
        (
          document as Document & {
            startViewTransition: (callback: () => void) => void;
          }
        ).startViewTransition(() => {
          // Apply the theme change immediately - the CSS will handle the visual wave effect
          setTheme(newTheme);
        });
      }, 10);
    } else {
      // Fallback for browsers without View Transitions API
      setTheme(newTheme);
    }
  };

  return (
    <Button
      ref={buttonRef}
      variant='ghost'
      size='sm'
      onClick={handleThemeToggle}
      className='h-8 w-8 p-0'>
      <Sun className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
      <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}

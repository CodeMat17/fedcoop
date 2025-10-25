"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

export function Navigation() {
  const { user } = useUser();
  // Get user role from session claims
  const userRole = user?.publicMetadata?.role as string;
  const isAdmin = userRole === "admin";

  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "About Us",
      href: "/about-fedcoop",
    },
    {
      title: "Cooperatives",
      href: "/cooperatives",
    },
    {
      title: "News",
      href: "/news",
    },
    {
      title: "Events",
      href: "/events",
    },
    {
      title: "Directors",
      href: "/directors",
    },
    {
      title: "Contact",
      href: "/contact",
    },
  ];

  return (
    <header className='fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm'>
      <div className='px-4 w-full max-w-7xl mx-auto'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <Link href='/'>
            <div className='flex items-center space-x-2'>
              <Image src='/logo.webp' alt='FedCoop' width={50} height={50} />
              <span className='text-xl font-bold md:hidden lg:block'>
                FEDCOOP
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className='hidden md:flex'>
            <NavigationMenuList>
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuLink
                      href={item.href}
                      className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/40 dark:hover:bg-accent
                        hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 ${
                          isActive
                            ? "text-yellow-600 dark:text-yellow-500 font-semibold"
                            : "text-foreground"
                        }`}>
                      {item.title}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Menu */}
          <div className='flex items-center justify-center gap-2'>
            <ThemeToggle />
            <SignedIn>
          {/* {isAdmin */}
            <UserButton />
          
            </SignedIn>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant='ghost' size='sm' className='md:hidden'>
                  <Menu className='h-5 w-5' />
                  <span className='sr-only'>Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side='right' className='w-[300px] sm:w-[400px]'>
                <div className='flex flex-col space-y-4 my-8 px-4'>
                  {navigationItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Button
                        key={item.title}
                        variant='ghost'
                        className='justify-start h-auto py-'
                        onClick={() => setIsOpen(false)}>
                        <Link
                          href={item.href}
                          className='flex flex-col items-start'>
                          <span
                            className={`font-medium ${
                              isActive
                                ? "text-primary font-semibold"
                                : "text-foreground"
                            }`}>
                            {item.title}
                          </span>
                        </Link>
                      </Button>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

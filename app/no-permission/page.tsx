"use client";

import { Button } from "@/components/ui/button";
import { Home, LogIn, ShieldX } from "lucide-react";
import Link from "next/link";

const NoPermissionPage = () => {
  return (
    <div className='min-h-screen flex items-center justify-center px-4 relative overflow-hidden pt-24 pb-8'>
      {/* Animated background gradient */}
      <div className='absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]' />
      </div>

      {/* Floating shapes */}
      <div className='absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse' />
      <div className='absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-700' />

      <div className='relative z-10 max-w-2xl mx-auto text-center'>
        {/* Icon */}
        <div className='mb-4 inline-flex items-center justify-center'>
          <div className='relative'>
            <div className='absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse' />
            <div className='relative bg-gradient-to-br from-primary/20 to-primary/10 p-3 rounded-full border border-primary/20'>
              <ShieldX className='w-12 h-12 text-primary' strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className='text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent'>
          Access Denied
        </h1>

        <p className='text-xl md:text-2xl text-muted-foreground mb-3'>
          You don&apos;t have permission to access this area
        </p>

        <p className='text-base md:text-lg text-muted-foreground/80 mb-12 max-w-lg mx-auto'>
          This section is restricted to authorized administrators and verified primary cooperatives only. If you think this is an error, contact the FEDCOOP administrators.
        </p>

        {/* Action buttons */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
          <Button asChild size='lg' className='group relative overflow-hidden'>
            <Link href='/'>
              <span className='relative z-10 flex items-center gap-2'>
                <Home className='w-5 h-5' />
                Back to Home
              </span>
            </Link>
          </Button>

          <Button asChild size='lg' variant='outline' className='group'>
            <Link href='/sign-in'>
              <span className='flex items-center gap-2'>
                <LogIn className='w-5 h-5 group-hover:translate-x-0.5 transition-transform' />
                Sign In
              </span>
            </Link>
          </Button>
        </div>

        {/* Additional info */}
        <p className='mt-12 text-sm text-muted-foreground/60'>
          Need help? Contact the administrator for access
        </p>
      </div>
    </div>
  );
};

export default NoPermissionPage;

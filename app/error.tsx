"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className='min-h-screen flex items-center justify-center px-4 pb-6 pt-24'>
      <Card className='max-w-md w-full'>
        <CardContent className='p-8 text-center'>
          <div className='w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center'>
            <AlertTriangle className='w-8 h-8 text-destructive' />
          </div>

          <h1 className='text-2xl font-bold mb-4'>Something went wrong!</h1>

          <p className='text-muted-foreground mb-6'>
            We encountered an error while loading the page. This might be a
            temporary issue.
          </p>

          <div className='space-y-3'>
            <Button onClick={reset} className='w-full'>
              <RefreshCw className='w-4 h-4 mr-2' />
              Try again
            </Button>

            <Button variant='outline' className='w-full' asChild>
              <Link href='/'>Go to homepage</Link>
            </Button>
          </div>

          {process.env.NODE_ENV === "development" && (
            <details className='mt-6 text-left'>
              <summary className='cursor-pointer text-sm font-medium mb-2'>
                Error details (development only)
              </summary>
              <pre className='text-xs bg-muted p-3 rounded overflow-auto'>
                {error.message}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

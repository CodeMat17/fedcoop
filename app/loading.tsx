import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='text-center'>
        <Spinner className='w-8 h-8 mx-auto mb-4' />
        <p className='text-muted-foreground'>Loading data...</p>
      </div>
    </div>
  );
}

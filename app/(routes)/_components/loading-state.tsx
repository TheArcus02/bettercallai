import { Card, CardContent } from '@/components/ui/card';
import { useTosAnalyzerStore } from '@/lib/stores/tos-analyzer-store';
import { Loader2 } from 'lucide-react';

export function LoadingState() {
  const progress = useTosAnalyzerStore((state) => state.progress);
  const inputMode = useTosAnalyzerStore((state) => state.currentInputMode);

  return (
    <Card className='mb-8'>
      <CardContent className='py-12'>
        <div className='max-w-md mx-auto space-y-6'>
          {/* Header */}
          <div className='text-center'>
            <Loader2 className='h-8 w-8 animate-spin mx-auto text-primary mb-4' />
            <h3 className='text-lg font-semibold'>
              {inputMode === 'url'
                ? 'Processing Terms of Service URL'
                : 'Analyzing Terms of Service'}
            </h3>
          </div>

          {/* Progress Bar */}
          <div className='space-y-2'>
            <div className='flex justify-between text-sm text-muted-foreground'>
              <span>Progress</span>
              <span>{progress.progress}%</span>
            </div>
            <div className='w-full bg-secondary rounded-full h-2'>
              <div
                className='bg-primary h-2 rounded-full transition-all duration-300 ease-in-out'
                style={{ width: `${progress.progress}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

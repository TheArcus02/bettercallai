import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  inputMode: 'url' | 'text';
}

export function LoadingState({ inputMode }: LoadingStateProps) {
  return (
    <Card className='mb-8'>
      <CardContent className='flex items-center justify-center py-12'>
        <div className='text-center space-y-4'>
          <Loader2 className='h-8 w-8 animate-spin mx-auto text-primary' />
          <div>
            <h3 className='text-lg font-semibold'>
              {inputMode === 'url'
                ? 'Fetching & Analyzing Terms of Service'
                : 'Analyzing Terms of Service'}
            </h3>
            <p className='text-muted-foreground'>
              {inputMode === 'url'
                ? 'Fetching the document from the URL and analyzing for potential concerns...'
                : 'AI is reviewing the document for potential concerns...'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

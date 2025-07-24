'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { AlertTriangle, Loader2, CheckCircle } from 'lucide-react';

const urlSchema = z.object({
  url: z
    .string()
    .url('Please enter a valid URL')
    .min(1, 'URL is required')
    .refine((url) => {
      try {
        const parsedUrl = new URL(url);
        return (
          parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
        );
      } catch {
        return false;
      }
    }, 'Please enter a valid HTTP or HTTPS URL'),
});

type UrlFormData = z.infer<typeof urlSchema>;

interface UrlInputFormProps {
  isAnalyzing: boolean;
  onSubmit: (url: string) => void;
}

export function UrlInputForm({ isAnalyzing, onSubmit }: UrlInputFormProps) {
  const form = useForm<UrlFormData>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: '',
    },
  });

  const handleSubmit = (data: UrlFormData) => {
    onSubmit(data.url);
  };

  const isFormValid = form.formState.isValid && form.watch('url');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='url'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Terms of Service URL</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    type='url'
                    placeholder='https://example.com/terms-of-service'
                    {...field}
                    disabled={isAnalyzing}
                  />
                  {field.value && (
                    <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                      {form.formState.errors.url ? (
                        <AlertTriangle className='h-4 w-4 text-destructive' />
                      ) : field.value ? (
                        <CheckCircle className='h-4 w-4 text-green-500' />
                      ) : null}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Enter a valid URL to fetch and analyze the Terms of Service
                document.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex items-center justify-between'>
          <p className='text-sm text-muted-foreground'>
            {(form.watch('url') ?? '').length > 0
              ? form.formState.errors.url
                ? 'Please fix the URL format'
                : 'Valid URL ready for analysis'
              : 'Enter a URL to begin analysis'}
          </p>
          <Button
            type='submit'
            disabled={!isFormValid || isAnalyzing}
            size='lg'
          >
            {isAnalyzing ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Fetching & Analyzing...
              </>
            ) : (
              'Analyze Terms'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

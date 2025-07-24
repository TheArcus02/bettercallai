'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

const textSchema = z.object({
  text: z
    .string()
    .min(50, 'Terms of Service text must be at least 50 characters long')
    .max(
      50000,
      'Terms of Service text is too long (maximum 50,000 characters)'
    ),
});

type TextFormData = z.infer<typeof textSchema>;

interface TextInputFormProps {
  isAnalyzing: boolean;
  onSubmit: (text: string) => void;
}

export function TextInputForm({ isAnalyzing, onSubmit }: TextInputFormProps) {
  const form = useForm<TextFormData>({
    resolver: zodResolver(textSchema),
    defaultValues: {
      text: '',
    },
  });

  const handleSubmit = (data: TextFormData) => {
    onSubmit(data.text);
  };

  const isFormValid = form.formState.isValid && form.watch('text');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='text'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Terms of Service Text</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Paste the Terms of Service document here...'
                  className='min-h-[200px] resize-none'
                  {...field}
                  disabled={isAnalyzing}
                />
              </FormControl>
              <FormDescription>
                Paste the complete text of the Terms of Service document
                (minimum 50 characters).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex items-center justify-between'>
          <p className='text-sm text-muted-foreground'>
            {(form.watch('text') ?? '').length > 0
              ? `${(form.watch('text') ?? '').length} characters`
              : 'Enter text to begin analysis'}
          </p>
          <Button
            type='submit'
            disabled={!isFormValid || isAnalyzing}
            size='lg'
          >
            {isAnalyzing ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Analyzing...
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

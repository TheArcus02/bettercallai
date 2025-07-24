'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileText, Link, Globe } from 'lucide-react';
import { UrlInputForm } from './url-input-form';
import { TextInputForm } from './text-input-form';

interface AnalysisInputProps {
  isAnalyzing: boolean;
  onStartAnalysis: (data: {
    inputMode: 'url' | 'text';
    content: string;
  }) => void;
}

export function AnalysisInput({
  isAnalyzing,
  onStartAnalysis,
}: AnalysisInputProps) {
  const [inputMode, setInputMode] = useState<'url' | 'text'>('url');

  const handleUrlSubmit = (url: string) => {
    onStartAnalysis({ inputMode: 'url', content: url });
  };

  const handleTextSubmit = (text: string) => {
    onStartAnalysis({ inputMode: 'text', content: text });
  };

  return (
    <Card className='mb-8'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          {inputMode === 'url' ? (
            <Link className='h-5 w-5' />
          ) : (
            <FileText className='h-5 w-5' />
          )}
          {inputMode === 'url'
            ? 'Terms of Service URL'
            : 'Terms of Service Text'}
        </CardTitle>
        <CardDescription>
          {inputMode === 'url'
            ? "Paste the URL of any Terms of Service page and we'll fetch and analyze it for you."
            : 'Copy and paste the full text of any Terms of Service document you want to analyze.'}
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Input Mode Toggle */}
        <div className='flex items-center gap-2 mb-4'>
          <Button
            variant={inputMode === 'url' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setInputMode('url')}
            className='flex items-center gap-2'
            disabled={isAnalyzing}
            type='button'
          >
            <Globe className='h-4 w-4' />
            URL
          </Button>
          <Button
            variant={inputMode === 'text' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setInputMode('text')}
            className='flex items-center gap-2'
            disabled={isAnalyzing}
            type='button'
          >
            <FileText className='h-4 w-4' />
            Text
          </Button>
        </div>

        {/* Render appropriate form based on input mode */}
        {inputMode === 'url' ? (
          <UrlInputForm isAnalyzing={isAnalyzing} onSubmit={handleUrlSubmit} />
        ) : (
          <TextInputForm
            isAnalyzing={isAnalyzing}
            onSubmit={handleTextSubmit}
          />
        )}
      </CardContent>
    </Card>
  );
}

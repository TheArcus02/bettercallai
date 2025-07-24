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
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  AlertTriangle,
  FileText,
  Loader2,
  CheckCircle,
  Link,
  Globe,
} from 'lucide-react';

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
  const [tosUrl, setTosUrl] = useState('');
  const [tosText, setTosText] = useState('');

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const hasValidInput =
    inputMode === 'url' ? tosUrl.trim() && isValidUrl(tosUrl) : tosText.trim();

  const handleAnalyze = () => {
    if (!hasValidInput) return;

    const content = inputMode === 'url' ? tosUrl : tosText;
    onStartAnalysis({ inputMode, content });
  };

  const handleInputModeChange = (mode: 'url' | 'text') => {
    setInputMode(mode);
    // Clear inputs when switching modes to avoid confusion
    setTosUrl('');
    setTosText('');
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
            onClick={() => handleInputModeChange('url')}
            className='flex items-center gap-2'
            disabled={isAnalyzing}
          >
            <Globe className='h-4 w-4' />
            URL
          </Button>
          <Button
            variant={inputMode === 'text' ? 'default' : 'outline'}
            size='sm'
            onClick={() => handleInputModeChange('text')}
            className='flex items-center gap-2'
            disabled={isAnalyzing}
          >
            <FileText className='h-4 w-4' />
            Text
          </Button>
        </div>

        {inputMode === 'url' ? (
          <div className='space-y-4'>
            <div className='relative'>
              <Input
                type='url'
                placeholder='https://example.com/terms-of-service'
                value={tosUrl}
                onChange={(e) => setTosUrl(e.target.value)}
                disabled={isAnalyzing}
              />
              {tosUrl && (
                <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                  {isValidUrl(tosUrl) ? (
                    <CheckCircle className='h-4 w-4 text-green-500' />
                  ) : (
                    <AlertTriangle className='h-4 w-4 text-destructive' />
                  )}
                </div>
              )}
            </div>
            <div className='flex items-center justify-between'>
              <p className='text-sm text-muted-foreground'>
                {tosUrl.length > 0
                  ? isValidUrl(tosUrl)
                    ? 'Valid URL ready for analysis'
                    : 'Please enter a valid URL'
                  : 'Enter a URL to begin analysis'}
              </p>
              <Button
                onClick={handleAnalyze}
                disabled={!hasValidInput || isAnalyzing}
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
          </div>
        ) : (
          <div className='space-y-4'>
            <Textarea
              placeholder='Paste the Terms of Service document here...'
              value={tosText}
              onChange={(e) => setTosText(e.target.value)}
              className='min-h-[200px] resize-none'
              disabled={isAnalyzing}
            />
            <div className='flex items-center justify-between'>
              <p className='text-sm text-muted-foreground'>
                {tosText.length > 0
                  ? `${tosText.length} characters`
                  : 'Enter text to begin analysis'}
              </p>
              <Button
                onClick={handleAnalyze}
                disabled={!hasValidInput || isAnalyzing}
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}

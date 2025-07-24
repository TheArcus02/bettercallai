'use client';

import { useState } from 'react';
import { HeroSection } from './_components/hero-section';
import { AnalysisInput } from './_components/analysis-input';
import { LoadingState } from './_components/loading-state';
import { AnalysisResults } from './_components/analysis-results';
import type { AnalysisResult } from '@/actions/analyze-tos-action';
import { analyzeTermsOfService } from '@/actions/analyze-tos-action';

type AppState = 'input' | 'analyzing' | 'results';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('input');
  const [currentInputMode, setCurrentInputMode] = useState<'url' | 'text'>(
    'url'
  );
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(
    null
  );

  const handleStartAnalysis = async (data: {
    inputMode: 'url' | 'text';
    content: string;
  }) => {
    setCurrentInputMode(data.inputMode);
    setAppState('analyzing');

    const results = await analyzeTermsOfService(data.content);
    setAnalysisResults(results);
    setAppState('results');
  };

  const handleStartNewAnalysis = () => {
    setAppState('input');
  };

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <HeroSection />

      {appState === 'input' && (
        <AnalysisInput
          isAnalyzing={false}
          onStartAnalysis={handleStartAnalysis}
        />
      )}

      {appState === 'analyzing' && (
        <LoadingState inputMode={currentInputMode} />
      )}

      {appState === 'results' && (
        <AnalysisResults
          results={analysisResults}
          onStartNewAnalysis={handleStartNewAnalysis}
        />
      )}
    </div>
  );
}

'use client';

import { HeroSection } from './_components/hero-section';
import { AnalysisInput } from './_components/analysis-input';
import { LoadingState } from './_components/loading-state';
import { AnalysisResults } from './_components/analysis-results';
import { useTosAnalyzerStore } from '@/lib/stores/tos-analyzer-store';

export default function Home() {
  const appState = useTosAnalyzerStore((state) => state.appState);

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <HeroSection />

      {appState === 'input' ? <AnalysisInput /> : null}

      {appState === 'analyzing' ? <LoadingState /> : null}

      {appState === 'results' ? <AnalysisResults /> : null}
    </div>
  );
}

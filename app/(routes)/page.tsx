'use client';

import { useState } from 'react';
import { HeroSection } from './_components/hero-section';
import { AnalysisInput } from './_components/analysis-input';
import { LoadingState } from './_components/loading-state';
import { AnalysisResults } from './_components/analysis-results';

// Mock analysis results
const mockAnalysisResults = {
  summary:
    'This Terms of Service contains several concerning clauses that users should be aware of. The service reserves broad rights to modify terms unilaterally and has extensive data collection practices.',
  criticalWarnings: [
    {
      title: 'Unilateral Terms Modification',
      description:
        'The service can change terms at any time without user consent, and continued use implies acceptance.',
      severity: 'high',
    },
    {
      title: 'Broad Data Collection',
      description:
        'The service collects extensive personal data including browsing habits, location data, and device information.',
      severity: 'high',
    },
    {
      title: 'Third-Party Data Sharing',
      description:
        'User data may be shared with unspecified third parties for marketing and analytics purposes.',
      severity: 'medium',
    },
  ],
  pointsOfInterest: [
    {
      title: 'Account Termination Rights',
      description:
        'The service reserves the right to terminate accounts at their discretion without prior notice.',
      type: 'termination',
    },
    {
      title: 'Liability Limitations',
      description:
        'The company limits their liability for service outages and data loss to the maximum extent permitted by law.',
      type: 'liability',
    },
    {
      title: 'Dispute Resolution',
      description:
        'All disputes must be resolved through binding arbitration, waiving the right to jury trial.',
      type: 'legal',
    },
  ],
};

type AppState = 'input' | 'analyzing' | 'results';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('input');
  const [currentInputMode, setCurrentInputMode] = useState<'url' | 'text'>(
    'url'
  );

  const handleStartAnalysis = (data: {
    inputMode: 'url' | 'text';
    content: string;
  }) => {
    setCurrentInputMode(data.inputMode);
    setAppState('analyzing');

    // Mock API call delay
    setTimeout(() => {
      setAppState('results');
    }, 3000);
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
          results={mockAnalysisResults}
          onStartNewAnalysis={handleStartNewAnalysis}
        />
      )}
    </div>
  );
}

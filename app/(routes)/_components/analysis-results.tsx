'use client';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { CheckCircle } from 'lucide-react';
import { AnalysisSummary } from './analysis-summary';
import { CriticalWarnings } from './critical-warnings';
import { PointsOfInterest } from './points-of-interest';
import { useTosAnalyzerStore } from '@/lib/stores/tos-analyzer-store';

export function AnalysisResults() {
  const results = useTosAnalyzerStore((state) => state.analysisResults);
  const startNewAnalysis = useTosAnalyzerStore(
    (state) => state.startNewAnalysis
  );

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting analysis...', results);
  };

  if (!results) {
    return null;
  }

  return (
    <div className='space-y-6'>
      {/* Analysis Complete Alert */}
      <Alert>
        <CheckCircle className='h-4 w-4' />
        <AlertTitle>Analysis Complete</AlertTitle>
        <AlertDescription>
          The AI has successfully analyzed the Terms of Service document. Review
          the findings below.
        </AlertDescription>
      </Alert>

      {/* Summary */}
      <AnalysisSummary summary={results.summary} />

      {/* Critical Warnings */}
      <CriticalWarnings warnings={results.criticalWarnings} />

      {/* Points of Interest */}
      <PointsOfInterest points={results.pointsOfInterest} />

      {/* Action Buttons */}
      <div className='flex gap-4 justify-center'>
        <Button variant='outline' onClick={startNewAnalysis}>
          Analyze Another Document
        </Button>
        <Button onClick={handleExport}>Export Analysis</Button>
      </div>

      {/* Footer */}
      <Separator className='my-12' />
      <div className='text-center text-sm text-muted-foreground'>
        <p>
          AI analysis is for informational purposes only and should not be
          considered legal advice.
        </p>
      </div>
    </div>
  );
}

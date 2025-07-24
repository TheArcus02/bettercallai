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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertTriangle,
  Shield,
  Info,
  FileText,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

export default function Home() {
  const [tosText, setTosText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = async () => {
    if (!tosText.trim()) return;

    setIsAnalyzing(true);
    // Mock API call delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 3000);
  };

  const handleReset = () => {
    setTosText('');
    setShowResults(false);
    setIsAnalyzing(false);
  };

  const getSeverityColor = (
    severity: string
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'termination':
        return <Shield className='h-4 w-4' />;
      case 'liability':
        return <AlertTriangle className='h-4 w-4' />;
      case 'legal':
        return <FileText className='h-4 w-4' />;
      default:
        return <Info className='h-4 w-4' />;
    }
  };

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      {/* Hero Section */}
      <div className='text-center mb-12'>
        <h1 className='text-4xl font-bold tracking-tight mb-4'>
          AI Terms of Service Analyzer
        </h1>
        <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
          Understand complex Terms of Service documents with AI-powered
          analysis. Identify potential red flags, warnings, and important
          clauses in plain language.
        </p>
      </div>

      {/* Input Section */}
      {!showResults && (
        <Card className='mb-8'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileText className='h-5 w-5' />
              Paste Terms of Service
            </CardTitle>
            <CardDescription>
              Copy and paste the full text of any Terms of Service document you
              want to analyze.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
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
                disabled={!tosText.trim() || isAnalyzing}
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
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <Card className='mb-8'>
          <CardContent className='flex items-center justify-center py-12'>
            <div className='text-center space-y-4'>
              <Loader2 className='h-8 w-8 animate-spin mx-auto text-primary' />
              <div>
                <h3 className='text-lg font-semibold'>
                  Analyzing Terms of Service
                </h3>
                <p className='text-muted-foreground'>
                  AI is reviewing the document for potential concerns...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {showResults && (
        <div className='space-y-6'>
          {/* Analysis Complete Alert */}
          <Alert>
            <CheckCircle className='h-4 w-4' />
            <AlertTitle>Analysis Complete</AlertTitle>
            <AlertDescription>
              The AI has successfully analyzed the Terms of Service document.
              Review the findings below.
            </AlertDescription>
          </Alert>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground leading-relaxed'>
                {mockAnalysisResults.summary}
              </p>
            </CardContent>
          </Card>

          {/* Critical Warnings */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-destructive'>
                <AlertTriangle className='h-5 w-5' />
                Critical Warnings
              </CardTitle>
              <CardDescription>
                These clauses require immediate attention and may significantly
                impact your rights.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {mockAnalysisResults.criticalWarnings.map((warning, index) => (
                  <div key={index} className='border rounded-lg p-4'>
                    <div className='flex items-start justify-between mb-2'>
                      <h4 className='font-semibold'>{warning.title}</h4>
                      <Badge variant={getSeverityColor(warning.severity)}>
                        {warning.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      {warning.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Points of Interest */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Info className='h-5 w-5' />
                Points of Interest
              </CardTitle>
              <CardDescription>
                Important clauses and conditions you should be aware of.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type='single' collapsible className='w-full'>
                {mockAnalysisResults.pointsOfInterest.map((point, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className='text-left'>
                      <div className='flex items-center gap-2'>
                        {getTypeIcon(point.type)}
                        {point.title}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className='text-muted-foreground'>
                        {point.description}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className='flex gap-4 justify-center'>
            <Button variant='outline' onClick={handleReset}>
              Analyze Another Document
            </Button>
            <Button>Export Analysis</Button>
          </div>
        </div>
      )}

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

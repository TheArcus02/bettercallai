import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalysisSummaryProps {
  summary: string;
}

export function AnalysisSummary({ summary }: AnalysisSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Executive Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-muted-foreground leading-relaxed'>{summary}</p>
      </CardContent>
    </Card>
  );
}

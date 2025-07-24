import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

interface Warning {
  title: string;
  description: string;
  severity: string;
}

interface CriticalWarningsProps {
  warnings: Warning[];
}

export function CriticalWarnings({ warnings }: CriticalWarningsProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-destructive'>
          <AlertTriangle className='h-5 w-5' />
          Critical Warnings
        </CardTitle>
        <CardDescription>
          These clauses require immediate attention and may significantly impact
          your rights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {warnings.map((warning, index) => (
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
  );
}

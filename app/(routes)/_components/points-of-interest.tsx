import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { AlertTriangle, Shield, Info, FileText } from 'lucide-react';

interface PointOfInterest {
  title: string;
  description: string;
  type: string;
}

interface PointsOfInterestProps {
  points: PointOfInterest[];
}

export function PointsOfInterest({ points }: PointsOfInterestProps) {
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
          {points.map((point, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className='text-left'>
                <div className='flex items-center gap-2'>
                  {getTypeIcon(point.type)}
                  {point.title}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className='text-muted-foreground'>{point.description}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

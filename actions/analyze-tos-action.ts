'use server';

import { generateObject } from 'ai';
import type { AnalysisResult } from '@/lib/constants/agents';
import { AGENTS } from '@/lib/constants/agents';

export async function analyzeTermsOfService(
  tosText: string
): Promise<AnalysisResult> {
  try {
    const agent = AGENTS.TOS_ANALYZER(tosText);
    const { object } = await generateObject(agent);

    console.log(JSON.stringify(object, null, 2));
    return object;
  } catch (error) {
    console.error('Error analyzing Terms of Service:', error);

    // Fallback with a basic error analysis
    return {
      summary:
        'Analysis could not be completed due to a technical error. This may indicate the document is too large, contains unusual formatting, or there was a service interruption. Please try again with a shorter text or contact support if the issue persists.',
      criticalWarnings: [
        {
          title: 'Analysis Failed',
          description:
            'The AI analysis could not be completed. This prevents proper evaluation of potential risks in the Terms of Service document.',
          severity: 'high',
        },
      ],
      pointsOfInterest: [
        {
          title: 'Manual Review Recommended',
          description:
            'Since automated analysis failed, we recommend having this document reviewed manually by a legal professional.',
          type: 'legal',
        },
      ],
    };
  }
}

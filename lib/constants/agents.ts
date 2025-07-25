import { openai } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';
import { z } from 'zod/v4';

export interface Agent {
  model: LanguageModel;
  schema: z.Schema<unknown>;
  system: string;
  prompt: string;
}

const analysisSchema = z.object({
  summary: z
    .string()
    .describe(
      'A comprehensive executive summary of the ToS analysis highlighting key concerns and user implications'
    ),
  criticalWarnings: z
    .array(
      z.object({
        title: z.string().describe('Brief title of the critical warning'),
        description: z
          .string()
          .describe('Detailed explanation of why this is concerning for users'),
        severity: z
          .enum(['high', 'medium'])
          .describe(
            'Risk level - high for major concerns, medium for notable issues'
          ),
      })
    )
    .describe(
      'Array of 3-7 critical warnings that pose significant risks to users'
    ),
  pointsOfInterest: z
    .array(
      z.object({
        title: z.string().describe('Brief title of the point of interest'),
        description: z
          .string()
          .describe(
            'Clear explanation of what users should know about this clause'
          ),
        type: z
          .enum(['legal', 'termination', 'liability'])
          .describe(
            'Category: legal for general legal matters, termination for account/service termination, liability for financial/damage liability'
          ),
      })
    )
    .describe(
      'Array of 5-10 notable clauses and conditions users should be aware of'
    ),
});
export type AnalysisResult = z.infer<typeof analysisSchema>;

const tosExtractionSchema = z.object({
  containsToS: z
    .boolean()
    .describe(
      'Whether the page content contains Terms of Service or Terms of Use'
    ),
  tosText: z
    .string()
    .optional()
    .describe('The extracted Terms of Service text if found'),
  reason: z
    .string()
    .describe('Explanation of why ToS was or was not found on the page'),
});
export type TosExtractionResult = z.infer<typeof tosExtractionSchema>;

export const AGENTS = {
  TOS_ANALYZER: (tosText: string) => ({
    model: openai('gpt-4o'),
    schema: analysisSchema,
    system: `You are an expert legal analyst specializing in Terms of Service agreements. Your role is to:
  
  1. Identify clauses that could negatively impact users' rights or expose them to risks
  2. Highlight unfair or heavily one-sided terms favoring the service provider
  3. Point out any unusual or concerning provisions
  4. Explain complex legal language in terms users can understand
  5. Focus on practical implications for everyday users
  
  Analyze the document thoroughly and provide actionable insights that help users make informed decisions.`,
    prompt: `Please analyze the following Terms of Service document and provide a comprehensive analysis:
  
  ${tosText}
  
  Focus on:
  - User rights and limitations
  - Data usage and privacy implications  
  - Termination and account closure policies
  - Liability and financial responsibilities
  - Dispute resolution mechanisms
  - Content ownership and licensing
  - Service availability and modifications
  - Any unusual or particularly concerning clauses
  
  Provide practical insights that help users understand what they're agreeing to.`,
  }),

  TOS_EXTRACTOR: (pageContent: string) => ({
    model: openai('gpt-4o'),
    schema: tosExtractionSchema,
    system: `You are an expert at identifying and extracting Terms of Service (ToS) or Terms of Use content from web pages. Your role is to:

1. Analyze the provided web page content to determine if it contains Terms of Service, Terms of Use, or similar legal agreements
2. Extract the complete ToS text if found, ensuring no important sections are missed
3. Clearly identify when a page does NOT contain ToS content
4. Distinguish between ToS and other legal documents (privacy policies, cookie policies, etc.)

Look for common indicators:
- Headings like "Terms of Service", "Terms of Use", "Terms and Conditions", "User Agreement"
- Legal language about user responsibilities, service usage, liability, termination
- Structured legal sections with numbered or lettered clauses
- Content that governs the relationship between users and the service provider`,
    prompt: `Analyze the following web page content and determine if it contains Terms of Service or Terms of Use:

${pageContent}

If you find ToS content:
- Extract the complete text including all sections and clauses
- Ensure you capture the full legal agreement, not just snippets
- Include section headers and numbered/lettered items

If no ToS is found:
- Clearly state that no Terms of Service were found
- Explain what type of content the page contains instead
- Be specific about why it doesn't qualify as ToS`,
  }),
} as const;

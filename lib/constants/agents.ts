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

const legalDocumentExtractionSchema = z.object({
  documentFound: z
    .boolean()
    .describe('Whether any recognizable legal document was found on the page.'),
  documentType: z
    .enum([
      'Terms of Service',
      'Privacy Policy',
      'Cookie Policy',
      'EULA',
      'Disclaimer',
      'Acceptable Use Policy',
      'Other',
      'None',
    ])
    .describe('The type of legal document identified.'),
  extractedText: z
    .string()
    .optional()
    .describe('The full, extracted text of the legal document if found.'),
  reason: z
    .string()
    .describe(
      'A brief explanation of the classification, or why no document was found.'
    ),
});
export type LegalDocumentExtractionResult = z.infer<
  typeof legalDocumentExtractionSchema
>;

export const AGENTS = {
  LEGAL_DOCUMENT_ANALYZER: (tosText: string) => ({
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

  LEGAL_DOCUMENT_EXTRACTOR: (pageContent: string) => ({
    model: openai('gpt-4o-mini'),
    schema: legalDocumentExtractionSchema,
    system: `You are an expert AI assistant specializing in identifying and extracting legal documents from web page content. Your goal is to accurately classify and extract the full text of these documents.

Your role is to:
1.  Analyze the provided web page content to determine if it contains a common legal document.
2.  Identify the specific type of document (e.g., Terms of Service, Privacy Policy, etc.).
3.  Extract the complete text of that document, ensuring no important sections are missed.
4.  If no recognizable legal document is found, clearly state that.

Look for common document types and their indicators:
-   **Terms of Service / Terms of Use / EULA**: Governs the use of a service. Look for headings like "Terms of Service", "User Agreement", "EULA".
-   **Privacy Policy**: Explains how user data is collected, used, and stored. Look for headings like "Privacy Policy", "Data Policy".
-   **Cookie Policy**: Details the use of cookies on the site. Look for headings like "Cookie Policy", "Cookie Statement".
-   **Acceptable Use Policy (AUP)**: Defines prohibited uses of a service.
-   **Disclaimer**: Limits liability.

Your primary task is to find the main legal document on the page, classify it, and extract its content.`,
    prompt: `Analyze the following web page content. Identify the type of legal document it contains and extract its full text
${pageContent}

If you find a legal document content:
- Extract the complete text including all sections and clauses
- Ensure you capture the full legal agreement, not just snippets
- Include section headers and numbered/lettered items

If no legal document is found:
- Clearly state that no legal document was found
- Explain what type of content the page contains instead
- Be specific about why it doesn't qualify as a legal document`,
  }),
} as const;

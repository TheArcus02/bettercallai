'use server';

export interface AnalysisResult {
  summary: string;
  criticalWarnings: {
    title: string;
    description: string;
    severity: string;
  }[];
  pointsOfInterest: {
    title: string;
    description: string;
    type: string;
  }[];
}

export async function analyzeTermsOfService(
  tosText: string
): Promise<AnalysisResult> {
  // Mock processing delay to simulate LLM analysis
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock analysis - in real implementation, this would call an LLM API
  const mockAnalysis: AnalysisResult = {
    summary: `This Terms of Service document contains ${Math.floor(
      tosText.length / 100
    )} key provisions across ${Math.ceil(
      tosText.split('.').length / 10
    )} major sections. The document includes standard clauses regarding user obligations, intellectual property rights, and service limitations. Notable concerns include broad termination rights, extensive liability limitations, and mandatory arbitration clauses. Users should pay particular attention to data collection practices, content ownership transfers, and dispute resolution mechanisms. Overall, this agreement favors the service provider with limited user protections.`,

    criticalWarnings: [
      {
        title: 'Broad Termination Rights',
        description:
          'The service provider reserves the right to terminate your account at any time without prior notice or explanation. This could result in immediate loss of access to your data and services.',
        severity: 'high',
      },
      {
        title: 'Extensive Liability Limitations',
        description:
          'The company limits its liability for damages to the maximum extent permitted by law, potentially leaving users without recourse for significant losses or damages.',
        severity: 'high',
      },
      {
        title: 'Mandatory Arbitration Clause',
        description:
          'All disputes must be resolved through binding arbitration, preventing you from pursuing class action lawsuits or seeking relief through traditional court systems.',
        severity: 'medium',
      },
      {
        title: 'Automatic Content License Grant',
        description:
          'By using the service, you automatically grant the company a broad, irrevocable license to use, modify, and distribute your content for any purpose.',
        severity: 'medium',
      },
      {
        title: 'Unilateral Terms Modification',
        description:
          'The company can modify these terms at any time with minimal notice, and continued use constitutes acceptance of the new terms.',
        severity: 'medium',
      },
    ],

    pointsOfInterest: [
      {
        title: 'Data Retention and Deletion',
        description:
          'The service retains user data for up to 90 days after account termination. Users can request immediate deletion, but some data may be retained for legal compliance.',
        type: 'legal',
      },
      {
        title: 'Third-Party Service Integration',
        description:
          'The platform integrates with various third-party services, each governed by their own terms of service and privacy policies.',
        type: 'legal',
      },
      {
        title: 'Age Restrictions and Parental Consent',
        description:
          'Users must be at least 13 years old to use the service. Users between 13-18 require parental consent and supervision.',
        type: 'legal',
      },
      {
        title: 'Intellectual Property Claims Process',
        description:
          'The service has established procedures for reporting copyright infringement and other intellectual property violations, including a counter-notification process.',
        type: 'legal',
      },
      {
        title: 'Service Availability and Maintenance',
        description:
          'The service aims for 99.9% uptime but reserves the right to perform maintenance that may temporarily interrupt service availability.',
        type: 'termination',
      },
      {
        title: 'Geographic Restrictions',
        description:
          'Certain features may not be available in all jurisdictions due to local laws and regulations. Users are responsible for compliance with local laws.',
        type: 'legal',
      },
      {
        title: 'Payment and Refund Policy',
        description:
          'Subscription fees are charged monthly/annually in advance. Refunds are generally not provided except as required by law or in cases of service failure.',
        type: 'liability',
      },
      {
        title: 'User-Generated Content Moderation',
        description:
          'The platform uses both automated systems and human reviewers to moderate content. Appeals process is available for content removal or account restrictions.',
        type: 'legal',
      },
    ],
  };

  return mockAnalysis;
}

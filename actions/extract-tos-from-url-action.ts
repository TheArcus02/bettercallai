'use server';

import { generateObject } from 'ai';
import { AGENTS } from '@/lib/constants/agents';

export async function extractTosFromUrl(url: string): Promise<string> {
  try {
    // Validate URL format
    const parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error(
        'Invalid URL: Only HTTP and HTTPS protocols are supported'
      );
    }

    // Fetch the HTML content
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch content from URL: ${response.status} ${response.statusText}`
      );
    }

    const htmlContent = await response.text();

    if (!htmlContent || htmlContent.trim().length === 0) {
      throw new Error('No content found at the provided URL');
    }

    // Use the LLM agent to extract ToS content
    const agent = AGENTS.TOS_EXTRACTOR(htmlContent);

    const result = await generateObject(agent);

    const extractionResult = result.object;

    // Check if ToS was found
    if (!extractionResult.containsToS) {
      throw new Error(
        `No Terms of Service found on this page. ${extractionResult.reason}`
      );
    }

    // Validate that we have ToS text
    if (
      !extractionResult.tosText ||
      extractionResult.tosText.trim().length === 0
    ) {
      throw new Error(
        'Terms of Service content appears to be empty or invalid'
      );
    }

    return extractionResult.tosText;
  } catch (error) {
    console.error('Error extracting Terms of Service from URL:', error);
    throw new Error('Failed to extract Terms of Service from URL');
  }
}

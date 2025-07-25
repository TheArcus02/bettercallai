'use server';

import { generateObject } from 'ai';
import * as cheerio from 'cheerio';
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

    // Extract and clean content using Cheerio
    const cleanedContent = extractCleanContent(htmlContent);

    if (!cleanedContent || cleanedContent.trim().length < 100) {
      throw new Error('Insufficient content found on the page for analysis');
    }

    // Use the LLM agent to extract ToS content from the cleaned text
    const agent = AGENTS.TOS_EXTRACTOR(cleanedContent);

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

function extractCleanContent(html: string): string {
  const $ = cheerio.load(html);

  // Remove unnecessary elements that don't contain ToS content
  $(
    'script, style, nav, header, footer, .nav, .navigation, .header, .footer'
  ).remove();
  $('iframe, embed, object, video, audio').remove();
  $('.advertisement, .ads, .social, .share, .comment').remove();
  $('[role="navigation"], [role="banner"], [role="contentinfo"]').remove();

  // Look for potential ToS content by common selectors and keywords
  const tosSelectors = [
    // Common ToS container selectors
    '.terms, .tos, .terms-of-service, .terms-of-use, .user-agreement',
    '.legal, .legal-terms, .agreement, .conditions',
    '[id*="terms"], [id*="tos"], [class*="terms"], [class*="tos"]',

    // Main content areas that might contain ToS
    'main, .main, .content, .main-content, .page-content',
    '.container, .wrapper, .inner',

    // Article and section tags
    'article, section',
  ];

  let tosContent = '';

  // Try to find ToS content using selectors
  for (const selector of tosSelectors) {
    const elements = $(selector);
    if (elements.length > 0) {
      elements.each((_, element) => {
        const text = $(element).text().trim();
        // Check if this element likely contains ToS content
        if (text.length > 500 && containsToSKeywords(text)) {
          tosContent += text + '\n\n';
        }
      });
    }
  }

  // If no specific ToS content found, fall back to body content
  if (!tosContent.trim()) {
    // Remove common non-content elements from body
    $('aside, .sidebar, .nav, .menu, .breadcrumb').remove();
    $('.related, .recommended, .suggestions').remove();

    tosContent = $('body').text().trim();
  }

  // Clean up the text
  return tosContent
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .replace(/\n\s*\n/g, '\n\n') // Clean up line breaks
    .trim();
}

function containsToSKeywords(text: string): boolean {
  const tosKeywords = [
    'terms of service',
    'terms of use',
    'user agreement',
    'terms and conditions',
    'agreement',
    'liability',
    'disclaimer',
    'prohibited',
    'violation',
    'termination',
    'suspension',
    'intellectual property',
    'copyright',
    'privacy policy',
    'data collection',
    'user content',
    'service provider',
    'governing law',
    'dispute resolution',
    'arbitration',
    'indemnification',
  ];

  const lowerText = text.toLowerCase();
  return tosKeywords.some((keyword) => lowerText.includes(keyword));
}

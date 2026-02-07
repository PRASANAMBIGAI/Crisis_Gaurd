// This is an AI-powered function for improving threat detection by suggesting similar words and phrases for keyword lists.
'use server';

/**
 * @fileOverview This file defines a Genkit flow to enhance threat detection by suggesting related keywords.
 *
 * improveThreatDetection - An async function that suggests similar words and phrases for threat detection.
 * ImproveThreatDetectionInput - The input type for the improveThreatDetection function.
 * ImproveThreatDetectionOutput - The output type for the improveThreatDetection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveThreatDetectionInputSchema = z.object({
  keywords: z
    .array(z.string())
    .describe('An array of keywords to find similar words and phrases for.'),
  type: z.enum(['Emotional Intensity', 'Call to Action']).describe('The type of keywords.'),
});
export type ImproveThreatDetectionInput = z.infer<typeof ImproveThreatDetectionInputSchema>;

const ImproveThreatDetectionOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of suggested keywords and phrases.'),
});
export type ImproveThreatDetectionOutput = z.infer<typeof ImproveThreatDetectionOutputSchema>;

export async function improveThreatDetection(input: ImproveThreatDetectionInput): Promise<ImproveThreatDetectionOutput> {
  return improveThreatDetectionFlow(input);
}

const improveThreatDetectionPrompt = ai.definePrompt({
  name: 'improveThreatDetectionPrompt',
  input: {schema: ImproveThreatDetectionInputSchema},
  output: {schema: ImproveThreatDetectionOutputSchema},
  prompt: `You are an expert in threat detection. Your task is to improve keyword lists by suggesting similar words and phrases.

Suggest at least 5 similar words or phrases for each keyword provided.

Ensure that the suggestions are relevant to the type of keywords provided.

Keywords: {{{keywords}}}
Type: {{{type}}}

Suggestions:`,
});

const improveThreatDetectionFlow = ai.defineFlow(
  {
    name: 'improveThreatDetectionFlow',
    inputSchema: ImproveThreatDetectionInputSchema,
    outputSchema: ImproveThreatDetectionOutputSchema,
  },
  async input => {
    const {output} = await improveThreatDetectionPrompt(input);
    return output!;
  }
);

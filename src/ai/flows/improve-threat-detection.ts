
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
  keywords: z.array(z.string()).describe('An array of keywords to find similar words and phrases for.'),
  type: z.enum(['Emotional Intensity', 'Call to Action']).describe('The type of keywords.'),
});
export type ImproveThreatDetectionInput = z.infer<typeof ImproveThreatDetectionInputSchema>;

const ImproveThreatDetectionOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of suggested keywords and phrases.'),
});
export type ImproveThreatDetectionOutput = z.infer<typeof ImproveThreatDetectionOutputSchema>;

const prompt = ai.definePrompt({
  name: 'improveThreatDetectionPrompt',
  input: {schema: ImproveThreatDetectionInputSchema},
  output: {schema: ImproveThreatDetectionOutputSchema},
  prompt: `You are a high-level counter-intelligence analyst. Your task is to expand threat detection keyword lists based on provided patterns.

Suggest 10-15 similar words or tactical phrases that might be used in social media to bypass standard filters but still indicate high risk for: {{{type}}}.

Existing Keywords:
{{#each keywords}}
- {{{this}}}
{{/each}}

Focus on localized slang, coded language, and urgent calls for mobilization.`,
});

export async function improveThreatDetection(input: ImproveThreatDetectionInput): Promise<ImproveThreatDetectionOutput> {
  const {output} = await prompt(input);
  return output!;
}

'use server';
/**
 * @fileOverview Summarizes the key risk factors contributing to a high harm score.
 *
 * - summarizeRiskFactors - A function that summarizes the risk factors.
 * - SummarizeRiskFactorsInput - The input type for the summarizeRiskFactors function.
 * - SummarizeRiskFactorsOutput - The return type for the summarizeRiskFactors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeRiskFactorsInputSchema = z.object({
  emotionalIntensity: z.number().describe('The emotional intensity score (0-100).'),
  callToAction: z.number().describe('The call to action score (0-100).'),
  contextMismatch: z.number().describe('The context mismatch score (0-100).'),
  messageText: z.string().describe('The original message text being analyzed.'),
});
export type SummarizeRiskFactorsInput = z.infer<typeof SummarizeRiskFactorsInputSchema>;

const SummarizeRiskFactorsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the key risk factors.'),
});
export type SummarizeRiskFactorsOutput = z.infer<typeof SummarizeRiskFactorsOutputSchema>;

export async function summarizeRiskFactors(input: SummarizeRiskFactorsInput): Promise<SummarizeRiskFactorsOutput> {
  return summarizeRiskFactorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeRiskFactorsPrompt',
  input: {schema: SummarizeRiskFactorsInputSchema},
  output: {schema: SummarizeRiskFactorsOutputSchema},
  prompt: `Summarize the key risk factors contributing to a potentially harmful social media message. Consider the emotional intensity, call to action, and context mismatch scores, as well as the original message text.

Message Text: {{{messageText}}}
Emotional Intensity: {{{emotionalIntensity}}}
Call to Action: {{{callToAction}}}
Context Mismatch: {{{contextMismatch}}}

Provide a concise explanation of why this message might be considered harmful, focusing on the factors that contribute most significantly to the overall risk.
`,
});

const summarizeRiskFactorsFlow = ai.defineFlow(
  {
    name: 'summarizeRiskFactorsFlow',
    inputSchema: SummarizeRiskFactorsInputSchema,
    outputSchema: SummarizeRiskFactorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

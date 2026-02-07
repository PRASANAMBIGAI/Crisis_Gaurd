'use server';
/**
 * @fileOverview Summarizes the key risk factors contributing to a high harm score, focusing on causal reasoning and behavioral impact.
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
  summary: z.string().describe('A concise summary of the key risk factors and behavioral impact.'),
  detectedCodedLanguage: z.array(z.string()).optional().describe('Any coded language, dog-whistles, or tactical slang detected.'),
  causalReasoning: z.string().describe('Deep analysis of how this content might lead to real-world harm.'),
});
export type SummarizeRiskFactorsOutput = z.infer<typeof SummarizeRiskFactorsOutputSchema>;

export async function summarizeRiskFactors(input: SummarizeRiskFactorsInput): Promise<SummarizeRiskFactorsOutput> {
  return summarizeRiskFactorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeRiskFactorsPrompt',
  input: {schema: SummarizeRiskFactorsInputSchema},
  output: {schema: SummarizeRiskFactorsOutputSchema},
  prompt: `You are a high-level counter-intelligence AI specialized in the Indian socio-political landscape. Analyze the following message for "Harm Index" rather than simple veracity.

Message Text: {{{messageText}}}
Emotional Intensity: {{{emotionalIntensity}}}
Call to Action: {{{callToAction}}}
Context Mismatch: {{{contextMismatch}}}

Your task:
1. Identify any "dog-whistles," coded language, or regional slang used to bypass filters while inciting tension or spreading medical negligence.
2. Provide a "Causal Reasoning" analysis: How does this specific linguistic pattern lead to a potential behavioral impact (e.g., mob mobilization, refusal of medical care, societal friction)?
3. Focus on the risk of harm to public order and health. Avoid binary true/false fact-checking; focus on volatility and intent.
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

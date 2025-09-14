'use server';

/**
 * @fileOverview Simulates potential commission earnings based on different network structures.
 *
 * - commissionForecasting - A function that handles the commission forecasting process.
 * - CommissionForecastingInput - The input type for the commissionForecasting function.
 * - CommissionForecastingOutput - The return type for the commissionForecasting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CommissionForecastingInputSchema = z.object({
  networkStructure: z
    .string()
    .describe(
      'A description of the network structure, including the number of levels, members per level, and commission rates.'
    ),
  salesVolume: z.number().describe('The total sales volume of the network.'),
  currency: z.string().describe('The currency to use for the commission forecast.'),
});
export type CommissionForecastingInput = z.infer<
  typeof CommissionForecastingInputSchema
>;

const CommissionForecastingOutputSchema = z.object({
  potentialEarnings: z
    .string()
    .describe('A forecast of potential commission earnings.'),
  assumptions: z.string().describe('The assumptions used in the forecast.'),
  disclaimer: z
    .string()
    .describe(
      'A disclaimer stating that the forecast is not a guarantee of actual earnings.'
    ),
});
export type CommissionForecastingOutput = z.infer<
  typeof CommissionForecastingOutputSchema
>;

export async function commissionForecasting(
  input: CommissionForecastingInput
): Promise<CommissionForecastingOutput> {
  return commissionForecastingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'commissionForecastingPrompt',
  input: {schema: CommissionForecastingInputSchema},
  output: {schema: CommissionForecastingOutputSchema},
  prompt: `You are an expert in multi-level marketing (MLM) commission structures.

You will use the provided network structure and sales volume to forecast the potential commission earnings for a user.

Network Structure: {{{networkStructure}}}
Sales Volume: {{{salesVolume}}} {{currency}}

Be sure to include the assumptions you made in the forecast, and a disclaimer that the forecast is not a guarantee of actual earnings.

Format your response with clear explanations.
`,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const commissionForecastingFlow = ai.defineFlow(
  {
    name: 'commissionForecastingFlow',
    inputSchema: CommissionForecastingInputSchema,
    outputSchema: CommissionForecastingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

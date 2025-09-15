'use server';

/**
 * @fileOverview Calculates commission earnings based on a fixed business model.
 *
 * - commissionForecasting - A function that handles the commission forecasting process.
 * - CommissionForecastingInput - The input type for the commissionForecasting function.
 * - CommissionForecastingOutput - The return type for the commissionForecasting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const CommissionForecastingInputSchema = z.object({
  userRank: z
    .enum(['supervisor', 'new_supervisor', 'direct_distributor'])
    .describe('The rank of the user.'),
  personalSales: z
    .number()
    .describe('The personal sales volume of the user.'),
  teamSales: z.number().describe("The total sales volume of the user's team."),
  currency: z
    .string()
    .describe('The currency to use for the commission forecast.'),
});
export type CommissionForecastingInput = z.infer<
  typeof CommissionForecastingInputSchema
>;

const CommissionForecastingOutputSchema = z.object({
  potentialEarnings: z
    .string()
    .describe('A forecast of potential commission earnings, formatted as a currency string.'),
  assumptions: z.string().describe('A breakdown of how the commission was calculated.'),
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
  prompt: `You are an expert in multi-level marketing (MLM) commission structures for a specific company.

You must calculate the user's potential commission earnings based on a fixed set of rules.

**Commission Rules:**
1.  **Supervisor Rank:**
    *   Gets 30% commission on their personal sales.
    *   Gets 10% commission on their team's sales (sales from their Direct Workers).
2.  **New Supervisor Rank:**
    *   Gets 20% commission on their personal sales.
    *   Gets 10% commission on their team's sales.
3.  **Direct Distributor Rank:**
    *   Gets 0% commission on their personal sales.
    *   Gets 0% commission on their team's sales. Their sales only generate commission for their upline.

**User's Data:**
*   Rank: {{{userRank}}}
*   Personal Sales Volume: {{{personalSales}}}
*   Team Sales Volume: {{{teamSales}}}
*   Currency: {{{currency}}}

**Your Task:**
1.  Calculate the total commission based on the user's rank and the sales data provided.
2.  In the 'potentialEarnings' field, provide only the final calculated amount, formatted as a currency string (e.g., "₹85,000.00").
3.  In the 'assumptions' field, provide a clear, step-by-step breakdown of the calculation. For example: "Personal Sales Commission: 30% of ₹10,000 = ₹3,000. Team Sales Commission: 10% of ₹50,000 = ₹5,000."
4.  In the 'disclaimer' field, include a standard disclaimer that this is a forecast and not a guarantee of actual earnings.
`,
  config: {
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

'use server';

import { commissionForecasting } from '@/ai/flows/commission-forecasting';
import { z } from 'zod';

const formSchema = z.object({
  userRank: z.enum(['supervisor', 'new_supervisor', 'direct_distributor']),
  personalSales: z.coerce.number().positive('Personal sales must be a positive number.'),
  teamSales: z.coerce.number().nonnegative('Team sales must be a positive number or zero.'),
  currency: z.string().length(3, 'Please enter a valid 3-letter currency code.'),
});

type State = {
  success?: boolean;
  message?: string;
  data?: {
    potentialEarnings: string;
    assumptions: string;
    disclaimer: string;
  };
  errors?: {
    userRank?: string[];
    personalSales?: string[];
    teamSales?: string[];
    currency?: string[];
  }
}

export async function getCommissionForecast(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = formSchema.safeParse({
    userRank: formData.get('userRank'),
    personalSales: formData.get('personalSales'),
    teamSales: formData.get('teamSales'),
    currency: formData.get('currency'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await commissionForecasting({
      userRank: validatedFields.data.userRank,
      personalSales: validatedFields.data.personalSales,
      teamSales: validatedFields.data.teamSales,
      currency: validatedFields.data.currency.toUpperCase(),
    });

    return {
      success: true,
      message: 'Forecast generated successfully.',
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'An unexpected error occurred while generating the forecast.',
    };
  }
}

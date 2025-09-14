'use server';

import { commissionForecasting } from '@/ai/flows/commission-forecasting';
import { z } from 'zod';

const formSchema = z.object({
  networkStructure: z.string().min(10, 'Please describe your network structure in more detail.'),
  salesVolume: z.coerce.number().positive('Sales volume must be a positive number.'),
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
    networkStructure?: string[];
    salesVolume?: string[];
    currency?: string[];
  }
}

export async function getCommissionForecast(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = formSchema.safeParse({
    networkStructure: formData.get('networkStructure'),
    salesVolume: formData.get('salesVolume'),
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
      networkStructure: validatedFields.data.networkStructure,
      salesVolume: validatedFields.data.salesVolume,
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

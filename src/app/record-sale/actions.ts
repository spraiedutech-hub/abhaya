
'use server';

import { z } from 'zod';
import { recordSale } from '@/lib/sales-service';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
  userId: z.string().min(1, 'Please select a user.'),
  amount: z.coerce.number().positive('Sale amount must be a positive number.'),
  product: z.string().min(1, 'Please enter a product name.'),
});

type State = {
  success?: boolean;
  message?: string;
  errors?: {
    userId?: string[];
    amount?: string[];
    product?: string[];
  };
};

export async function createSaleAction(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = formSchema.safeParse({
    userId: formData.get('userId'),
    amount: formData.get('amount'),
    product: formData.get('product'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await recordSale(validatedFields.data);
    
    // Revalidate the admin page to show new data
    revalidatePath('/admin');

    return {
      success: true,
      message: 'Sale recorded successfully.',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'An unexpected error occurred while recording the sale.',
    };
  }
}

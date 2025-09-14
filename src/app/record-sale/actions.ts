'use server';

import { z } from 'zod';
import { recordSale } from '@/lib/sales-service';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
  userId: z.string().min(1, 'Please select a user.'),
  amount: z.coerce.number().positive('Please enter a positive sale amount.'),
  product: z.string().min(1, 'Please enter a product name or description.'),
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

export async function recordSaleAction(prevState: State, formData: FormData): Promise<State> {
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
    await recordSale({
      userId: validatedFields.data.userId,
      amount: validatedFields.data.amount,
      product: validatedFields.data.product,
    });
    
    revalidatePath('/admin');
    revalidatePath('/record-sale');

    return {
      success: true,
      message: 'Sale recorded successfully!',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'An unexpected error occurred while recording the sale.',
    };
  }
}

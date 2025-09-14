'use server';

import { revalidatePath } from 'next/cache';
import { activateUser } from '@/lib/user-service';
import { recordSale } from '@/lib/sales-service';

type State = {
  success: boolean;
  message: string;
};

export async function activateUserAction(userId: string): Promise<State> {
  try {
    // 1. Activate the user
    await activateUser(userId);

    // 2. Record the "Starter Kit" sale
    await recordSale({
      userId: userId,
      amount: 1000, // Placeholder amount for activation
      product: 'Starter Kit',
    });

    // 3. Revalidate the admin path to refresh data
    revalidatePath('/admin');

    return {
      success: true,
      message: 'User activated and starter kit sale recorded.',
    };
  } catch (error) {
    console.error('Activation Error:', error);
    return {
      success: false,
      message: 'Failed to activate user. Please try again.',
    };
  }
}

'use server';

import { z } from 'zod';
import { updateUserRank } from '@/lib/user-service';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
  userId: z.string().min(1),
  newRank: z.enum(['Direct Distributor', 'New Supervisor', 'Supervisor']),
});

type State = {
  success?: boolean;
  message?: string;
  errors?: {
    userId?: string[];
    newRank?: string[];
  };
};

export async function promoteUserAction(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = formSchema.safeParse({
    userId: formData.get('userId'),
    newRank: formData.get('newRank'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await updateUserRank(validatedFields.data.userId, validatedFields.data.newRank);
    revalidatePath('/promote-user');
    return {
      success: true,
      message: 'User rank updated successfully!',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'An unexpected error occurred while updating the rank.',
    };
  }
}

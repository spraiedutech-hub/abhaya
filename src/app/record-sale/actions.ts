'use server';

import { z } from 'zod';
import { recordSale } from '@/lib/sales-service';
import { revalidatePath } from 'next/cache';
import { addUser } from '@/lib/user-service';

const formSchema = z.object({
  name: z.string().min(1, 'Please enter a name.'),
  email: z.string().email('Please enter a valid email.'),
  rank: z.enum(['Supervisor', 'Direct Distributor']),
});

type State = {
  success?: boolean;
  message?: string;
  errors?: {
    name?: string[];
    email?: string[];
    rank?: string[];
  };
};

export async function createNewUserAction(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = formSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    rank: formData.get('rank'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await addUser({
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        rank: validatedFields.data.rank,
    });
    
    // Revalidate the admin page to show new data
    revalidatePath('/admin');

    return {
      success: true,
      message: 'User created successfully. They can be activated in the Admin Panel.',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'An unexpected error occurred while creating the user.',
    };
  }
}

'use server';

import { z } from 'zod';
import { addUserToFirestore } from '@/lib/user-service';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
  name: z.string().min(2, 'Please enter a valid name.'),
  email: z.string().email('Please enter a valid email address.'),
  rank: z.enum(['Direct Distributor', 'Supervisor']),
  uplineId: z.string().min(1, 'Please select a supervisor.'),
});

type State = {
  success?: boolean;
  message?: string;
  errors?: {
    name?: string[];
    email?: string[];
    rank?: string[];
    uplineId?: string[];
  };
};

export async function createNewUserAction(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = formSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    rank: formData.get('rank'),
    uplineId: formData.get('uplineId'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await addUserToFirestore({
      ...validatedFields.data,
      status: 'Inactive', // New users start as inactive
    });

    revalidatePath('/admin');
    revalidatePath('/add-user');

    return {
      success: true,
      message: 'New user created successfully! They must be activated from the User Management table.',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'An unexpected error occurred while creating the user.',
    };
  }
}

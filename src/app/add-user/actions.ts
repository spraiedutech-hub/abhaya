'use server';

import { z } from 'zod';
import { addUser } from '@/lib/user-service';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
  name: z.string().min(1, 'Please enter a name.'),
  email: z.string().email('Please enter a valid email.'),
  rank: z.enum(['Supervisor', 'New Supervisor', 'Direct Distributor']),
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
    await addUser({
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        rank: validatedFields.data.rank,
        uplineId: validatedFields.data.uplineId,
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

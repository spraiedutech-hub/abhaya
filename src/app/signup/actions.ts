
'use server';

import { z } from 'zod';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AuthError } from 'firebase/auth';
import { addUserToFirestore, findUserByEmail, linkAuthToUser } from '@/lib/user-service';

const formSchema = z.object({
    name: z.string().min(1, 'Please enter a name.'),
    email: z.string().email('Please enter a valid email.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string(),
    uplineId: z.string().min(1, 'Please select a supervisor.'),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});


type State = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    uplineId?: string[];
  };
};

export async function signupAction(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = formSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const existingUser = await findUserByEmail(validatedFields.data.email);

    // 1. Create the Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      validatedFields.data.email,
      validatedFields.data.password
    );

    const authUid = userCredential.user.uid;

    // 2. If it's a pre-seeded user (like our admin Alice), link the auth ID.
    // Otherwise, create a new user document in Firestore.
    if (existingUser) {
        await linkAuthToUser(existingUser.id, authUid);
    } else {
        await addUserToFirestore({
            authUid: authUid,
            name: validatedFields.data.name,
            email: validatedFields.data.email,
            uplineId: validatedFields.data.uplineId,
            rank: 'Direct Distributor', 
        });
    }

    return {
      success: true,
      message: 'Account created! It is now pending approval from an administrator.',
    };
  } catch (error) {
    const e = error as AuthError;
    let message = 'An unexpected error occurred.';
    if (e.code === 'auth/email-already-in-use') {
      message = 'This email is already registered. Please sign in instead.';
    }
    return {
      success: false,
      message,
    };
  }
}

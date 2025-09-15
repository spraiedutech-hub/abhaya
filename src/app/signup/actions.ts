
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
    uplineId: z.string().optional(), // Make optional as admin doesn't have one
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
}).refine(data => {
    // Require uplineId if the user is not the admin
    return data.email === 'alice@example.com' || typeof data.uplineId === 'string' && data.uplineId.length > 0;
}, {
    message: 'Please select a supervisor.',
    path: ['uplineId'],
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

  const { email, password, name, uplineId } = validatedFields.data;

  try {
    const existingUser = await findUserByEmail(email);

    if (existingUser && existingUser.authUid) {
        return {
            success: false,
            message: 'This email is already registered. Please sign in instead.',
        };
    }

    // 1. Create the Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const authUid = userCredential.user.uid;

    if (existingUser) {
        // This handles cases where Alice's doc might exist from a previous failed run
        await linkAuthToUser(existingUser.id, authUid);
    } else {
        // Special case for the admin user
        if (email === 'alice@example.com') {
             await addUserToFirestore({
                authUid: authUid,
                name: name,
                email: email,
                rank: 'Supervisor',
                status: 'Active', // Create admin as Active
            });
        } else {
             await addUserToFirestore({
                authUid: authUid,
                name: name,
                email: email,
                uplineId: uplineId,
                rank: 'Direct Distributor',
                status: 'Inactive', // Create all other users as Inactive
            });
        }
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

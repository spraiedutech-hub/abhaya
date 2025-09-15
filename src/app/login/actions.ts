
'use server';

import { z } from 'zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AuthError } from 'firebase/auth';
import { cookies } from 'next/headers';
import { getUserByAuthId } from '@/lib/user-service';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type State = {
  success: boolean;
  message: string;
};

export async function loginAction(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = formSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid email or password format.',
    };
  }
  
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      validatedFields.data.email,
      validatedFields.data.password
    );

    // This check MUST happen AFTER successful authentication
    const user = await getUserByAuthId(userCredential.user.uid);
    if (!user || user.status === 'Inactive') {
        // Log them out of Firebase Auth session if our DB says they are inactive
        await auth.signOut();
        return { success: false, message: 'Your account is inactive and pending admin approval.' };
    }

    const idToken = await userCredential.user.getIdToken();
    
    cookies().set('session', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return { success: true, message: 'Login successful' };
  } catch (error) {
    const e = error as AuthError;
    let message = 'An unexpected error occurred.';
    switch (e.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        message = 'Invalid email or password.';
        break;
      default:
        message = 'An error occurred during login. Please try again.';
    }
    return { success: false, message };
  }
}

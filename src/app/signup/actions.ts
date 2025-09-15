
'use server';

import { z } from 'zod';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AuthError } from 'firebase/auth';
import { addUserToFirestore } from '@/lib/user-service';

const formSchema = z.object({
    name: z.string().min(1, 'Please enter a name.'),
    email: z.string().email('Please enter a valid email.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string(),
    uplineId: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
}).refine(data => {
    // The uplineId is required for everyone except the special admin user.
    return data.email.toLowerCase() === 'alice@example.com' || (typeof data.uplineId === 'string' && data.uplineId.length > 0);
}, {
    message: 'Please select a recruiter.',
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
  const lowerCaseEmail = email.toLowerCase();

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      lowerCaseEmail,
      password
    );

    const authUid = userCredential.user.uid;
    let userData;
    const isAdmin = lowerCaseEmail === 'alice@example.com';

    if (isAdmin) {
      // Special case for the admin user
      userData = {
        authUid: authUid,
        name: name,
        email: lowerCaseEmail,
        rank: 'Supervisor' as const,
        status: 'Active' as const, 
      };
    } else {
      // Standard case for all other users
      userData = {
        authUid: authUid,
        name: name,
        email: lowerCaseEmail,
        uplineId: uplineId,
        rank: 'Direct Distributor' as const,
        status: 'Inactive' as const,
      };
    }
    
    await addUserToFirestore(userData);
    
    return {
      success: true,
      message: isAdmin ? 'Admin account created successfully! You can now log in.' : 'Account created successfully! It is now pending approval from an administrator.',
    };
  } catch (error) {
    const e = error as AuthError;
    let message = 'An unexpected error occurred.';
    if (e.code === 'auth/email-already-in-use') {
      message = 'This email is already registered. Please sign in instead.';
    }
    console.error("Signup Error:", error);
    return {
      success: false,
      message,
    };
  }
}

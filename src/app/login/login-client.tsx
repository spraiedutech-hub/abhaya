
'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAction } from './actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogIn, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/icons/logo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialState = {
  success: false,
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <LogIn />}
      {pending ? 'Signing In...' : 'Sign In'}
    </Button>
  );
}

export default function LoginClient() {
  const [state, formAction] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (state.success === true) {
      // On successful login, redirect to the dashboard.
      window.location.href = '/';
    }
  }, [state.success]);

  return (
    <Card className="w-full max-w-sm">
      <form action={formAction}>
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <div className="group flex h-12 w-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base">
                    <Logo className="h-6 w-6 transition-all group-hover:scale-110" />
                </div>
            </div>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {state.message && !state.success && (
            <Alert variant="destructive">
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <SubmitButton />
           <p className="text-xs text-center text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/signup" className="underline hover:text-primary">
                Sign Up
              </Link>
            </p>
        </CardFooter>
      </form>
    </Card>
  );
}

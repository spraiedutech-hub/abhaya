'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { signupAction } from './actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserPlus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/icons/logo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { User } from '@/lib/user-service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const initialState = {
  success: false,
  message: '',
  errors: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <UserPlus />}
      {pending ? 'Creating Account...' : 'Create Account'}
    </Button>
  );
}

export default function SignupClient({ supervisors, referredBy }: { supervisors: User[], referredBy: User | null }) {
  const [state, formAction] = useActionState(signupAction, initialState);
  const [isAdminSignup, setIsAdminSignup] = useState(false);

  // If a valid referral is provided, and that user isn't in the supervisors list, add them.
  // This allows any active user to refer, not just supervisors.
  const supervisorList = [...supervisors];
  if (referredBy && !supervisorList.find(s => s.id === referredBy.id)) {
      supervisorList.unshift(referredBy);
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAdminSignup(e.target.value === 'alice@example.com');
  }


  return (
    <Card className="w-full max-w-md">
      <form action={formAction}>
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <div className="group flex h-12 w-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base">
                    <Logo className="h-6 w-6 transition-all group-hover:scale-110" />
                </div>
            </div>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Join the network by filling out the form below.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
            {state.message && (
                <Alert variant={state.success ? 'default' : 'destructive'} className={state.success ? 'bg-green-500/10 border-green-500/20 text-green-700' : ''}>
                    <AlertTitle>{state.success ? 'Success!' : 'Error'}</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}

          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" placeholder="Jane Doe" required />
            {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="jane.doe@example.com" required onChange={handleEmailChange}/>
            {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
          </div>
          
           <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
                {state.errors?.password && <p className="text-sm text-destructive">{state.errors.password[0]}</p>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required />
                {state.errors?.confirmPassword && <p className="text-sm text-destructive">{state.errors.confirmPassword[0]}</p>}
            </div>
           </div>

           {!isAdminSignup && (
            <div className="grid gap-2">
                <Label htmlFor="uplineId">Recruiter</Label>
                <Select name="uplineId" required defaultValue={referredBy?.id}>
                  <SelectTrigger id="uplineId" disabled={!!referredBy}>
                    <SelectValue placeholder="Select a recruiter" />
                  </SelectTrigger>
                  <SelectContent>
                    {referredBy && (
                      <SelectItem key={referredBy.id} value={referredBy.id}>
                        {referredBy.name}
                      </SelectItem>
                    )}
                    {!referredBy && supervisors.map(supervisor => (
                      <SelectItem key={supervisor.id} value={supervisor.id}>
                        {supervisor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {state.errors?.uplineId && (
                  <p className="text-sm text-destructive">{state.errors.uplineId[0]}</p>
                )}
              </div>
            )}


        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <SubmitButton />
          <p className="text-xs text-center text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="underline hover:text-primary">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

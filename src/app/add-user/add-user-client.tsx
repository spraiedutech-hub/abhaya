'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { createNewUserAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, UserPlus } from 'lucide-react';
import type { User } from '@/lib/user-service';

const initialState = {
  success: undefined,
  message: '',
  errors: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2" />
          Creating...
        </>
      ) : (
        <>
          <UserPlus className="mr-2" />
          Create User
        </>
      )}
    </Button>
  );
}

export default function AddUserClient({ supervisors }: { supervisors: User[] }) {
  const [state, formAction] = useActionState(createNewUserAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success === true && state.message) {
      toast({
        title: 'Success',
        description: state.message,
      });
      formRef.current?.reset();
    } else if (state.success === false && state.message && !state.errors) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <Card className="max-w-2xl">
      <form ref={formRef} action={formAction}>
        <CardHeader>
          <CardTitle>New User Details</CardTitle>
          <CardDescription>Enter the information for the new member.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Jane Doe"
                required
              />
              {state.errors?.name && (
                <p className="text-sm text-destructive">{state.errors.name[0]}</p>
              )}
            </div>
             <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="e.g., jane.doe@example.com"
                required
              />
              {state.errors?.email && (
                <p className="text-sm text-destructive">{state.errors.email[0]}</p>
              )}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="rank">Initial Rank</Label>
              <Select name="rank" required defaultValue="Direct Distributor">
                <SelectTrigger id="rank">
                  <SelectValue placeholder="Select a rank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Direct Distributor">Direct Distributor</SelectItem>
                  <SelectItem value="New Supervisor">New Supervisor</SelectItem>
                  <SelectItem value="Supervisor">Supervisor</SelectItem>
                </SelectContent>
              </Select>
              {state.errors?.rank && (
                <p className="text-sm text-destructive">{state.errors.rank[0]}</p>
              )}
            </div>
             <div className="grid gap-2">
              <Label htmlFor="uplineId">Recruiter (Supervisor)</Label>
              <Select name="uplineId" required>
                <SelectTrigger id="uplineId">
                  <SelectValue placeholder="Select a supervisor" />
                </SelectTrigger>
                <SelectContent>
                  {supervisors.map(supervisor => (
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
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}

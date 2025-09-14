
'use client';

import type { User } from '@/lib/user-service';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { createSaleAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save } from 'lucide-react';

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
          Saving...
        </>
      ) : (
        <>
          <Save className="mr-2" />
          Record Sale
        </>
      )}
    </Button>
  );
}

export default function RecordSaleClient({ users }: { users: User[] }) {
  const [state, formAction] = useActionState(createSaleAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.success === true && state.message) {
      toast({
        title: 'Success',
        description: state.message,
      });
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
      <form action={formAction}>
        <CardHeader>
          <CardTitle>Sale Details</CardTitle>
          <CardDescription>Select the user and enter the sale information.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="userId">User</Label>
            <Select name="userId" required>
              <SelectTrigger id="userId">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state.errors?.userId && (
              <p className="text-sm text-destructive">{state.errors.userId[0]}</p>
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (INR)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="e.g., 2500"
                required
              />
              {state.errors?.amount && (
                <p className="text-sm text-destructive">{state.errors.amount[0]}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product">Product Name</Label>
              <Input
                id="product"
                name="product"
                placeholder="e.g., Health Supplement"
                required
              />
              {state.errors?.product && (
                <p className="text-sm text-destructive">{state.errors.product[0]}</p>
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

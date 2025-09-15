
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';
import { createPurchaseRequest } from '@/lib/purchase-request-service';
import { z } from 'zod';

const formSchema = z.object({
  amount: z.coerce.number().positive('Please enter a positive sale amount.'),
  product: z.string().min(1, 'Please enter a product name or description.'),
});

type State = {
  success?: boolean;
  message?: string;
  errors?: {
    amount?: string[];
    product?: string[];
  };
};

const initialState: State = {
    success: undefined,
    message: undefined,
    errors: undefined,
}

async function requestPurchaseAction(prevState: State, formData: FormData): Promise<State> {
    const validatedFields = formSchema.safeParse({
        amount: formData.get('amount'),
        product: formData.get('product'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            message: 'Validation failed.',
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    return await createPurchaseRequest(validatedFields.data);
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2" />
          Submitting...
        </>
      ) : (
        <>
          <Send className="mr-2" />
          Submit for Approval
        </>
      )}
    </Button>
  );
}

export default function RequestPurchaseCard() {
  const [state, formAction] = useActionState(requestPurchaseAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: 'Success',
          description: state.message,
        });
        formRef.current?.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: state.message,
        });
      }
    }
  }, [state, toast]);

  return (
    <Card>
      <form ref={formRef} action={formAction}>
        <CardHeader>
          <CardTitle>Request a Purchase</CardTitle>
          <CardDescription>
            Submit your purchase details for admin approval.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Sale Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="e.g., 5000"
              required
            />
            {state.errors?.amount && (
              <p className="text-sm text-destructive">{state.errors.amount[0]}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="product">Product(s)</Label>
            <Input
              id="product"
              name="product"
              placeholder="e.g., Wellness Pack"
              required
            />
            {state.errors?.product && (
              <p className="text-sm text-destructive">{state.errors.product[0]}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}

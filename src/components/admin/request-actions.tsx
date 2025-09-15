'use client';

import { Button } from '@/components/ui/button';
import { Check, X, Loader2 } from 'lucide-react';
import type { PurchaseRequestWithUser } from '@/lib/purchase-request-service';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { approvePurchaseRequest, rejectPurchaseRequest } from '@/lib/purchase-request-service';

export default function RequestActions({ request }: { request: PurchaseRequestWithUser }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approvePurchaseRequest(request.id!, {
          userId: request.userId,
          amount: request.amount,
          product: request.product,
      });
      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message,
        });
      }
    });
  };
  
  const handleReject = () => {
    startTransition(async () => {
      const result = await rejectPurchaseRequest(request.id!);
       if (result.success) {
        toast({
          title: 'Rejected',
          description: result.message,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message,
        });
      }
    });
  }

  return (
    <div className="flex items-center gap-2 justify-end">
      {isPending ? <Loader2 className="animate-spin" /> : (
          <>
            <Button size="icon" variant="outline" className="h-8 w-8 bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-600 border-green-500/20" onClick={handleApprove}>
                <Check className="h-4 w-4" />
                <span className="sr-only">Approve</span>
            </Button>
            <Button size="icon" variant="outline" className="h-8 w-8 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600 border-red-500/20" onClick={handleReject}>
                <X className="h-4 w-4" />
                <span className="sr-only">Reject</span>
            </Button>
          </>
      )}
    </div>
  );
}

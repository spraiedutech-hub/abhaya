'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, UserCheck } from 'lucide-react';
import type { User } from '@/lib/user-service';
import { activateUserAction } from './actions';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function UserActions({ user }: { user: User }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleActivate = () => {
    startTransition(async () => {
      const result = await activateUserAction(user.id);
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.status === 'Inactive' && (
          <DropdownMenuItem onClick={handleActivate} disabled={isPending}>
            <UserCheck className="mr-2 h-4 w-4" />
            {isPending ? 'Activating...' : 'Activate'}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Suspend</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

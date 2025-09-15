'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { promoteUserAction } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, TrendingUp } from 'lucide-react';
import type { User } from '@/lib/user-service';

const initialState = {
  success: undefined,
  message: '',
  errors: undefined,
};

function SubmitButton({ userId }: { userId: string }) {
  const { pending, data } = useFormStatus();
  const isSubmittingForThisUser = pending && data?.get('userId') === userId;
  return (
    <Button type="submit" size="sm" disabled={isSubmittingForThisUser}>
      {isSubmittingForThisUser ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Updating...
        </>
      ) : (
        <>
          <TrendingUp className="mr-2 h-4 w-4" />
          Update Rank
        </>
      )}
    </Button>
  );
}

export default function PromoteUserClient({ users }: { users: User[] }) {
  const [state, formAction] = useActionState(promoteUserAction, initialState);
  const { toast } = useToast();
  const [selectedRanks, setSelectedRanks] = useState<Record<string, User['rank']>>({});

  useEffect(() => {
    // Initialize selected ranks
    const initialRanks = users.reduce((acc, user) => {
      acc[user.id] = user.rank;
      return acc;
    }, {} as Record<string, User['rank']>);
    setSelectedRanks(initialRanks);
  }, [users]);

  useEffect(() => {
    if (state.success === true && state.message) {
      toast({
        title: 'Success',
        description: state.message,
      });
    } else if (state.success === false && state.message) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  const handleRankChange = (userId: string, newRank: User['rank']) => {
    setSelectedRanks(prev => ({ ...prev, [userId]: newRank }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Ranks</CardTitle>
        <CardDescription>Update the rank for an active member in your network.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Current Rank</TableHead>
              <TableHead>New Rank</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="font-medium">{user.name}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {user.email}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{user.rank}</TableCell>
                <TableCell>
                  <form action={formAction}>
                    <input type="hidden" name="userId" value={user.id} />
                    <div className="flex items-center gap-2">
                       <Select
                         name="newRank"
                         required
                         value={selectedRanks[user.id] || user.rank}
                         onValueChange={(value) => handleRankChange(user.id, value as User['rank'])}
                       >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select new rank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Direct Distributor">Direct Distributor</SelectItem>
                          <SelectItem value="New Supervisor">New Supervisor</SelectItem>
                          <SelectItem value="Supervisor">Supervisor</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="md:hidden">
                        <SubmitButton userId={user.id} />
                      </div>
                    </div>
                  </form>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                   <form action={formAction}>
                     <input type="hidden" name="userId" value={user.id} />
                     <input type="hidden" name="newRank" value={selectedRanks[user.id] || user.rank} />
                     <SubmitButton userId={user.id} />
                   </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

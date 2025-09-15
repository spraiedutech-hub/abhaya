import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users2 } from 'lucide-react';
import { getInactiveDownline } from '@/lib/user-service';
import { cn } from '@/lib/utils';

export default async function DownlineStatus({ userId }: { userId: string }) {
  const inactiveMembers = await getInactiveDownline(userId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users2 className="h-5 w-5" />
          Downline Activation Status
        </CardTitle>
        <CardDescription>
          Status of new members you have referred.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {inactiveMembers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member Name</TableHead>
                <TableHead className="hidden md:table-cell">Joined Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inactiveMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {member.joinedDate}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-yellow-500/20 text-yellow-500 border-yellow-500/20"
                    >
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>Awaiting admin approval</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-8">
            No new members are currently pending activation.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { getAllUsers } from '@/lib/user-service';
import UserActions from './user-actions';
import { cn } from '@/lib/utils';

export default async function UserManagement() {
  const users = await getAllUsers();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
        </CardTitle>
        <CardDescription>View, edit, and manage user accounts.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Rank</TableHead>
              <TableHead className="hidden md:table-cell">Joined Date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>
                  <Badge 
                    variant={user.status === 'Active' ? 'default' : 'secondary'} 
                    className={cn({
                        'bg-green-500/20 text-green-500 border-green-500/20': user.status === 'Active',
                        'bg-yellow-500/20 text-yellow-500 border-yellow-500/20': user.status === 'Inactive'
                    })}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{user.rank}</TableCell>
                <TableCell className="hidden md:table-cell">{user.joinedDate}</TableCell>
                <TableCell>
                  <UserActions user={user} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

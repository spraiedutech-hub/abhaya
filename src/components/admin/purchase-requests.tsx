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
import { Button } from '@/components/ui/button';
import { ShoppingBag, Check, X } from 'lucide-react';
import { getPendingPurchaseRequests } from '@/lib/purchase-request-service';
import RequestActions from './request-actions';
import { adminData } from '@/lib/data';

export default async function PurchaseRequests() {
  const requests = await getPendingPurchaseRequests();
  const { currency } = adminData;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Pending Purchase Requests
        </CardTitle>
        <CardDescription>
          Review and approve purchase requests from your members.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="hidden md:table-cell">Product</TableHead>
                <TableHead className="hidden md:table-cell">Amount</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="font-medium">{request.user.name}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {request.user.email}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {request.product}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency,
                    }).format(request.amount)}
                  </TableCell>
                  <TableCell>
                    <RequestActions request={request} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-8">
            No pending purchase requests.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { adminData } from '@/lib/data';
import { TrendingUp } from 'lucide-react';

export default function RecentSales() {
  const { recentSales, currency } = adminData;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Sales
        </CardTitle>
        <CardDescription>An overview of the latest transactions.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {recentSales.map((sale) => (
          <div key={sale.id} className="flex items-center gap-4">
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarImage src={`https://picsum.photos/seed/${sale.id}/40/40`} alt="Avatar" />
              <AvatarFallback>{sale.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">{sale.name}</p>
              <p className="text-sm text-muted-foreground">{sale.email}</p>
            </div>
            <div className="ml-auto font-medium">
              +{new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency,
              }).format(sale.amount)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

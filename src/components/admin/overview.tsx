
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, Users, ShoppingCart, Percent, Wallet } from 'lucide-react';
import { getTotalUsers } from '@/lib/user-service';
import { getTotalSalesStats } from '@/lib/sales-service';
import { adminData } from '@/lib/data';
import { getTotalCommissionPaid, getTotalWeeklyCommission } from '@/lib/commission-service';

export default async function AdminOverview() {
  const { currency } = adminData.overview;
  
  const totalUsers = await getTotalUsers();
  const { totalSales, totalOrders } = await getTotalSalesStats();
  const totalCommission = await getTotalCommissionPaid();
  const weeklyCommission = await getTotalWeeklyCommission();

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers.toLocaleString(),
      icon: Users,
    },
    {
      title: 'Total Sales Volume',
      value: new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
      }).format(totalSales),
      icon: IndianRupee,
    },
    {
      title: 'Total Commission Paid',
      value: new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
      }).format(totalCommission),
      icon: Percent,
    },
    {
      title: 'Weekly Commission (Pending)',
      value: new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
      }).format(weeklyCommission),
      icon: Wallet,
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

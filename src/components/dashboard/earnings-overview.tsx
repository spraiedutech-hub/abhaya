import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, BarChart, UserCheck, Wallet } from 'lucide-react';
import { getUserEarnings, getUserWeeklyEarnings } from '@/lib/commission-service';
import { adminData } from '@/lib/data';

export default async function EarningsOverview() {
  const { currency } = adminData;
  // TODO: Replace with real user data
  const mockUser = {
      id: 'mock-user-id',
      rank: 'Supervisor',
      status: 'Active',
  }

  const totalEarnings = await getUserEarnings(mockUser.id);
  const weeklyEarnings = await getUserWeeklyEarnings(mockUser.id);

  const stats = [
    {
      title: 'Total Earnings (Paid)',
      value: new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
      }).format(totalEarnings),
      icon: IndianRupee,
    },
    {
      title: 'Weekly Earnings (Pending)',
      value: new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
      }).format(weeklyEarnings),
      icon: Wallet,
    },
    {
      title: 'Current Rank',
      value: mockUser.rank,
      icon: BarChart,
    },
    {
      title: 'Status',
      value: mockUser.status,
      icon: UserCheck,
    },
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

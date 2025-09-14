import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, BarChart, UserCheck } from 'lucide-react';
import { earningsData } from '@/lib/data';

export default function EarningsOverview() {
  const { totalEarnings, rank, status, currency } = earningsData;

  const stats = [
    {
      title: 'Total Earnings',
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
      }).format(totalEarnings),
      icon: DollarSign,
    },
    {
      title: 'Current Rank',
      value: rank,
      icon: BarChart,
    },
    {
      title: 'Status',
      value: status,
      icon: UserCheck,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
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

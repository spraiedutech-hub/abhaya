import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, BarChart, UserCheck } from 'lucide-react';
import { getUserEarnings } from '@/lib/commission-service';
import { getUsersByIds } from '@/lib/user-service';
import { adminData } from '@/lib/data';

// In a real app with authentication, this ID would come from the logged-in user's session.
// For now, we'll hardcode Alice's ID to demonstrate the dynamic data.
const MOCKED_USER_ID = 'Gth4q47v6sE3b2iDpQzN'; // This is a seeded ID for Alice

export default async function EarningsOverview() {
  const { currency } = adminData;
  const totalEarnings = await getUserEarnings(MOCKED_USER_ID);
  const users = await getUsersByIds([MOCKED_USER_ID]);
  const currentUser = users[0] || { rank: 'N/A', status: 'Unknown' };

  const stats = [
    {
      title: 'Total Earnings',
      value: new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
      }).format(totalEarnings),
      icon: IndianRupee,
    },
    {
      title: 'Current Rank',
      value: currentUser.rank,
      icon: BarChart,
    },
    {
      title: 'Status',
      value: currentUser.status,
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

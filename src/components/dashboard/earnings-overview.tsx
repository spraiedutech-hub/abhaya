
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, BarChart, UserCheck } from 'lucide-react';
import { getUserEarnings } from '@/lib/commission-service';
import { getUserByAuthId } from '@/lib/user-service';
import { adminData } from '@/lib/data';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from 'firebase-admin';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { decode } from 'jsonwebtoken';

async function getLoggedInUser() {
    const session = cookies().get('session')?.value;
    if (!session) return null;
    
    try {
        const decodedToken = decode(session);
        if (!decodedToken || typeof decodedToken === 'string' || !decodedToken.uid) {
             cookies().delete('session');
             redirect('/login');
        }
        const user = await getUserByAuthId(decodedToken.uid);
        return user;
    } catch (error) {
        console.error("Session verification failed:", error);
        // This is critical. If the cookie is invalid, we should clear it and redirect.
        cookies().delete('session');
        redirect('/login');
    }
}


export default async function EarningsOverview() {
  const { currency } = adminData;
  const currentUser = await getLoggedInUser();

  if (!currentUser) {
    // This case should be handled by the redirect in getLoggedInUser, but as a fallback:
     return (
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            <Card><CardHeader><CardTitle>Please log in to see your earnings.</CardTitle></CardHeader></Card>
        </div>
     )
  }

  const totalEarnings = await getUserEarnings(currentUser.id);

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

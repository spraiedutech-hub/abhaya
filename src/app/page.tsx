import MainLayout from '@/components/main-layout';
import EarningsOverview from '@/components/dashboard/earnings-overview';
import DownlineTree from '@/components/dashboard/downline-tree';
import RewardsGrid from '@/components/dashboard/rewards-grid';
import ReferralCard from '@/components/dashboard/referral-card';
import { getLoggedInUser } from '@/lib/user-service';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getLoggedInUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <EarningsOverview />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DownlineTree />
          </div>
          <div className="flex flex-col gap-8">
            <ReferralCard userId={user.id} />
            <RewardsGrid />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

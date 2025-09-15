import MainLayout from '@/components/main-layout';
import EarningsOverview from '@/components/dashboard/earnings-overview';
import DownlineTree from '@/components/dashboard/downline-tree';
import RewardsGrid from '@/components/dashboard/rewards-grid';
import ReferralCard from '@/components/dashboard/referral-card';
import RequestPurchaseCard from '@/components/dashboard/request-purchase-card';

export default async function MemberPage() {
  const mockUserId = 'mock-user-id';

  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold tracking-tight">Member Dashboard</h1>
        <EarningsOverview />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DownlineTree />
          </div>
          <div className="flex flex-col gap-8">
            <RequestPurchaseCard />
            <ReferralCard userId={mockUserId} />
            <RewardsGrid />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

import MainLayout from '@/components/main-layout';
import AdminOverview from '@/components/admin/overview';
import UserManagement from '@/components/admin/user-management';
import RecentSales from '@/components/admin/recent-sales';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import PurchaseRequests from '@/components/admin/purchase-requests';

export default async function AdminPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage users, monitor sales, and view site-wide metrics.
          </p>
        </div>
        <Suspense fallback={<Skeleton className="h-24" />}>
          <AdminOverview />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-96" />}>
          <PurchaseRequests />
        </Suspense>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <Suspense fallback={<Skeleton className="h-96" />}>
              <UserManagement />
            </Suspense>
          </div>
          <Suspense fallback={<Skeleton className="h-96" />}>
            <RecentSales />
          </Suspense>
        </div>
      </div>
    </MainLayout>
  );
}

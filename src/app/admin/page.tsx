import MainLayout from '@/components/main-layout';
import AdminOverview from '@/components/admin/overview';
import UserManagement from '@/components/admin/user-management';
import RecentSales from '@/components/admin/recent-sales';

export default function AdminPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage users, monitor sales, and view site-wide metrics.
          </p>
        </div>
        <AdminOverview />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <UserManagement />
          </div>
          <RecentSales />
        </div>
      </div>
    </MainLayout>
  );
}

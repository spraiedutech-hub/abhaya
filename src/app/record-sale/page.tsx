import MainLayout from '@/components/main-layout';
import RecordSaleClient from './record-sale-client';
import { getActiveUsers } from '@/lib/user-service';

export default async function RecordSalePage() {
  const users = await getActiveUsers();
  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight">Record a New Sale</h1>
          <p className="text-muted-foreground">
            Log a new sale for an existing, active user in your network.
          </p>
        </div>
        <RecordSaleClient users={users} />
      </div>
    </MainLayout>
  );
}

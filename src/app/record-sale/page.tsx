
import MainLayout from '@/components/main-layout';
import RecordSaleClient from './record-sale-client';
import { getAllUsers } from '@/lib/user-service';

export default async function RecordSalePage() {
  const users = await getAllUsers();

  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col">
          <h1 className="text-3-xl font-bold tracking-tight">Record a New Sale</h1>
          <p className="text-muted-foreground">
            Enter the details for a new transaction.
          </p>
        </div>
        <RecordSaleClient users={users} />
      </div>
    </MainLayout>
  );
}

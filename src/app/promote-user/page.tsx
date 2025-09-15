import MainLayout from '@/components/main-layout';
import { getActiveUsers } from '@/lib/user-service';
import PromoteUserClient from './promote-user-client';

export default async function PromoteUserPage() {
  const users = await getActiveUsers();
  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight">Promote Members</h1>
          <p className="text-muted-foreground">
            Manage and update the ranks of your active members.
          </p>
        </div>
        <PromoteUserClient users={users} />
      </div>
    </MainLayout>
  );
}

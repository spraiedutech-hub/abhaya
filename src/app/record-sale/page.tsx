import MainLayout from '@/components/main-layout';
import AddUserClient from './add-user-client';
import { getSupervisors } from '@/lib/user-service';

export default async function RecordSalePage() {
  const supervisors = await getSupervisors();
  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight">Add a New User</h1>
          <p className="text-muted-foreground">
            Create a new user profile. They will be inactive until activated by an admin.
          </p>
        </div>
        <AddUserClient supervisors={supervisors} />
      </div>
    </MainLayout>
  );
}

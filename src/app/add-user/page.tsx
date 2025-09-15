import MainLayout from '@/components/main-layout';
import AddUserClient from './add-user-client';
import { getSupervisors } from '@/lib/user-service';

export default async function AddUserPage() {
  const supervisors = await getSupervisors();

  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col">
           <h1 className="text-3xl font-bold tracking-tight">Add a New Member</h1>
           <p className="text-muted-foreground">
             Create a new user account and assign them to a supervisor.
           </p>
        </div>
        <AddUserClient supervisors={supervisors} />
      </div>
    </MainLayout>
  );
}

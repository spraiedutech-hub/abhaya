
import SignupClient from './signup-client';
import { getSupervisors } from '@/lib/user-service';

export default async function SignupPage() {
    const supervisors = await getSupervisors();
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 py-8">
      <SignupClient supervisors={supervisors} />
    </div>
  );
}

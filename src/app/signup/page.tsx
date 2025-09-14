import SignupClient from './signup-client';
import { getSupervisors, getUsersByIds } from '@/lib/user-service';
import type { User } from '@/lib/user-service';

export default async function SignupPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supervisors = await getSupervisors();
  let referredBy: User | null = null;

  const refId = searchParams?.ref;

  if (typeof refId === 'string' && refId) {
    const referredByUserArray = await getUsersByIds([refId]);
    if (referredByUserArray.length > 0) {
      referredBy = referredByUserArray[0];
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 py-8">
      <SignupClient supervisors={supervisors} referredBy={referredBy} />
    </div>
  );
}

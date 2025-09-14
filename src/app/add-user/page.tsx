
// This page is now obsolete and replaced by the /signup page.
// We are keeping the file to avoid breaking navigation, but redirecting.
import { redirect } from 'next/navigation';

export default function AddUserPage() {
    redirect('/signup');
}

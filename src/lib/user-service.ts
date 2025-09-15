
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, query, where, documentId, addDoc, writeBatch, updateDoc, limit, runTransaction } from 'firebase/firestore';
import { decode } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface User {
  id: string;
  authUid?: string;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
  rank: 'Supervisor' | 'New Supervisor' | 'Direct Distributor';
  joinedDate: string;
  uplineId?: string; // ID of the user who recruited them
}

async function seedInitialUsers() {
    console.log('Checking if initial users need to be seeded...');
    
    const settingsDocRef = doc(db, 'settings', 'userSeeding');

    try {
        await runTransaction(db, async (transaction) => {
            const settingsDoc = await transaction.get(settingsDocRef);
            if (settingsDoc.exists() && settingsDoc.data().completed) {
                console.log('User seeding has already been completed.');
                return;
            }

            console.log('Seeding initial users...');
            const usersCollection = collection(db, 'users');
            const batch = writeBatch(db);

            const aliceRef = doc(usersCollection, 'gth4q47v6se3b2idpqzn');
            const bobRef = doc(usersCollection);

            batch.set(aliceRef, { name: 'Alice', email: 'alice@example.com', status: 'Active', rank: 'Supervisor', joinedDate: '2023-01-15' });
            batch.set(bobRef, { name: 'Bob', email: 'bob@example.com', status: 'Active', rank: 'Supervisor', joinedDate: '2023-02-20' });

            const otherUsers = [
                { name: 'Charlie', email: 'charlie@example.com', status: 'Active', rank: 'Direct Distributor', joinedDate: '2023-03-01', uplineId: aliceRef.id },
                { name: 'David', email: 'david@example.com', status: 'Inactive', rank: 'Direct Distributor', joinedDate: '2023-03-05', uplineId: bobRef.id },
                { name: 'Eve', email: 'eve@example.com', status: 'Active', rank: 'Direct Distributor', joinedDate: '2023-04-10', uplineId: aliceRef.id },
                { name: 'Frank', email: 'frank@example.com', status: 'Active', rank: 'Direct Distributor', joinedDate: '2023-05-12', uplineId: bobRef.id },
            ];

            otherUsers.forEach(user => {
                const docRef = doc(usersCollection);
                batch.set(docRef, user);
            });
            
            await batch.commit();
            
            const newBatch = writeBatch(db);
            newBatch.set(settingsDocRef, { completed: true });
            await newBatch.commit();

            console.log('Initial users have been seeded to Firestore.');
        });
    } catch (error) {
        console.error("Transaction failed: ", error);
    }
}

export async function findUserByEmail(email: string): Promise<User | null> {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('email', '==', email), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as User;
}

export async function linkAuthToUser(userId: string, authUid: string): Promise<void> {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { authUid: authUid });
}


export async function addUserToFirestore(userData: Omit<User, 'id' | 'status' | 'joinedDate'>): Promise<string> {
    try {
        const usersCollection = collection(db, 'users');
        const docRef = await addDoc(usersCollection, {
            ...userData,
            status: 'Inactive',
            joinedDate: new Date().toISOString().split('T')[0],
        });
        return docRef.id;
    } catch(e) {
        console.error("Error adding user: ", e);
        throw new Error("Could not create user.");
    }
}


export async function getAllUsers(): Promise<User[]> {
  const usersCollection = collection(db, 'users');
  let userSnapshot = await getDocs(usersCollection);

  if (userSnapshot.empty) {
      await seedInitialUsers();
      // Re-fetch after seeding
      userSnapshot = await getDocs(usersCollection);
  }

  return userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

export async function getActiveUsers(): Promise<User[]> {
    await getAllUsers(); // Ensure users are seeded if necessary
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('status', '==', 'Active'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}


export async function getUsersByIds(userIds: string[]): Promise<User[]> {
  if (userIds.length === 0) {
    return [];
  }
  const usersCollection = collection(db, 'users');
  const q = query(usersCollection, where(documentId(), 'in', userIds));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

export async function getUserByAuthId(authId: string): Promise<User | null> {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('authUid', '==', authId), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as User;
}

export async function getLoggedInUser(): Promise<User | null> {
    const session = cookies().get('session')?.value;
    if (!session) return null;
    
    try {
        const decodedToken = decode(session);
        if (!decodedToken || typeof decodedToken === 'string' || !decodedToken.uid) {
             cookies().delete('session');
             redirect('/login');
        }
        const user = await getUserByAuthId(decodedToken.uid);
        return user;
    } catch (error) {
        console.error("Session verification failed:", error);
        cookies().delete('session');
        redirect('/login');
    }
}


export async function getTotalUsers(): Promise<number> {
    const usersCollection = collection(db, 'users');
    let userSnapshot = await getDocs(usersCollection);
    if (userSnapshot.empty) {
        await seedInitialUsers();
        userSnapshot = await getDocs(usersCollection);
    }
    return userSnapshot.size;
}

export async function activateUser(userId: string): Promise<void> {
    try {
        const userDoc = doc(db, 'users', userId);
        await updateDoc(userDoc, {
            status: 'Active'
        });
    } catch(e) {
        console.error("Error activating user: ", e);
        throw new Error("Could not activate user.");
    }
}

export async function getSupervisors(): Promise<User[]> {
    await getAllUsers(); // Ensure users exist before querying
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('rank', 'in', ['Supervisor', 'New Supervisor']), where('status', '==', 'Active'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

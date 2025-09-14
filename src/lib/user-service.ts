
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, documentId, addDoc, writeBatch } from 'firebase/firestore';

export interface User {
  id: string;
  name: string;
  email: string;
  status?: 'Active' | 'Inactive';
  rank?: 'Supervisor' | 'Direct Distributor';
  joinedDate?: string;
}

// Seed data - only used if the users collection is empty
const seedUsers: Omit<User, 'id'>[] = [
    { name: 'Alice', email: 'alice@example.com', status: 'Active', rank: 'Supervisor', joinedDate: '2023-01-15' },
    { name: 'Bob', email: 'bob@example.com', status: 'Active', rank: 'Supervisor', joinedDate: '2023-02-20' },
    { name: 'Charlie', email: 'charlie@example.com', status: 'Active', rank: 'Direct Distributor', joinedDate: '2023-03-01' },
    { name: 'David', email: 'david@example.com', status: 'Inactive', rank: 'Direct Distributor', joinedDate: '2023-03-05' },
    { name: 'Eve', email: 'eve@example.com', status: 'Active', rank: 'Direct Distributor', joinedDate: '2023-04-10' },
];

async function seedInitialUsers() {
    const usersCollection = collection(db, 'users');
    const batch = writeBatch(db);
    seedUsers.forEach(user => {
        const docRef = doc(usersCollection);
        batch.set(docRef, user);
    });
    await batch.commit();
    console.log('Initial users have been seeded to Firestore.');
}


export async function getAllUsers(): Promise<User[]> {
  const usersCollection = collection(db, 'users');
  const userSnapshot = await getDocs(usersCollection);

  // If there are no users, seed them for the first time
  if (userSnapshot.empty) {
      await seedInitialUsers();
      const seededSnapshot = await getDocs(usersCollection);
      const userList = seededSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      return userList;
  }

  const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  return userList;
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

export async function getTotalUsers(): Promise<number> {
    const usersCollection = collection(db, 'users');
    const userSnapshot = await getDocs(usersCollection);
     // If there are no users, seed them and recount
    if (userSnapshot.empty) {
        await seedInitialUsers();
        const seededSnapshot = await getDocs(usersCollection);
        return seededSnapshot.size;
    }
    return userSnapshot.size;
}


'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, documentId } from 'firebase/firestore';

export interface User {
  id: string;
  name: string;
  email: string;
  status?: 'Active' | 'Inactive';
  rank?: 'Supervisor' | 'Direct Distributor';
  joinedDate?: string;
}

export async function getAllUsers(): Promise<User[]> {
  const usersCollection = collection(db, 'users');
  const userSnapshot = await getDocs(usersCollection);
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
    return userSnapshot.size;
}

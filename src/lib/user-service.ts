
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, query, where, documentId, addDoc, updateDoc, limit } from 'firebase/firestore';
import { decode } from 'jsonwebtoken';
import { cookies } from 'next/headers';

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

export async function addUserToFirestore(userData: Omit<User, 'id' | 'joinedDate'>): Promise<string> {
    try {
        const usersCollection = collection(db, 'users');
        const docRef = await addDoc(usersCollection, {
            ...userData,
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
  const userSnapshot = await getDocs(usersCollection);
  return userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

export async function getActiveUsers(): Promise<User[]> {
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
    
    // The middleware is responsible for validating the token.
    // This function can now safely assume the token is valid if it exists.
    const decodedToken = decode(session);
    if (!decodedToken || typeof decodedToken === 'string' || !decodedToken.uid) {
         return null;
    }
    const user = await getUserByAuthId(decodedToken.uid);
    return user;
}


export async function getTotalUsers(): Promise<number> {
    const usersCollection = collection(db, 'users');
    const userSnapshot = await getDocs(usersCollection);
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
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('rank', 'in', ['Supervisor', 'New Supervisor']), where('status', '==', 'Active'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

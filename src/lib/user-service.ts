'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, documentId, addDoc, writeBatch, updateDoc, Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
  rank: 'Supervisor' | 'New Supervisor' | 'Direct Distributor';
  joinedDate: string;
  uplineId?: string; // ID of the user who recruited them
}

async function seedInitialUsers() {
    console.log('Checking if initial users need to be seeded...');
    const usersCollection = collection(db, 'users');
    const batch = writeBatch(db);

    const aliceRef = doc(usersCollection, 'Gth4q47v6sE3b2iDpQzN'); // Hardcoded ID for Alice
    const bobRef = doc(usersCollection);

    batch.set(aliceRef, { name: 'Alice', email: 'alice@example.com', status: 'Active', rank: 'Supervisor', joinedDate: '2023-01-15' });
    batch.set(bobRef, { name: 'Bob', email: 'bob@example.com', status: 'Active', rank: 'Supervisor', joinedDate: '2023-02-20' });

    const otherUsers = [
        { name: 'Charlie', email: 'charlie@example.com', status: 'Active', rank: 'Direct Distributor', joinedDate: '2023-03-01', uplineId: aliceRef.id },
        { name: 'David', email: 'david@example.com', status: 'Inactive', rank: 'Direct Distributor', joinedDate: '2023-03-05', uplineId: bobRef.id },
        { name: 'Eve', email: 'eve@example.com', status: 'Active', rank: 'Direct Distributor', joinedDate: '2023-04-10', uplineId: aliceRef.id },
    ];

    otherUsers.forEach(user => {
        const docRef = doc(usersCollection);
        batch.set(docRef, user);
    });
    
    await batch.commit();
    console.log('Initial users have been seeded to Firestore.');
}

export async function addUser(userData: Omit<User, 'id' | 'status' | 'joinedDate'>): Promise<string> {
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
  const userSnapshot = await getDocs(usersCollection);

  if (userSnapshot.empty) {
      await seedInitialUsers();
      // Re-fetch after seeding
      const seededSnapshot = await getDocs(usersCollection);
      return seededSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  }

  return userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

export async function getActiveUsers(): Promise<User[]> {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('status', '==', 'Active'));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
        // Ensure there are users first.
        const allUsers = await getAllUsers();
        if (allUsers.length === 0) {
             // getAllUsers will seed, so we re-call
             return await getActiveUsers();
        }
        return [];
    }
    
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

export async function getTotalUsers(): Promise<number> {
    const usersCollection = collection(db, 'users');
    const userSnapshot = await getDocs(usersCollection);
    if (userSnapshot.empty) {
        await seedInitialUsers();
        const seededSnapshot = await getDocs(usersCollection);
        return seededSnapshot.size;
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
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('rank', 'in', ['Supervisor', 'New Supervisor']), where('status', '==', 'Active'));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
        // If there are no supervisors, we might need to handle this case.
        // For now, let's ensure there are users first.
        const allUsers = await getAllUsers();
        if (allUsers.length === 0) {
             // getAllUsers will seed, so we re-call getSupervisors
             return await getSupervisors();
        }
        return [];
    }
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

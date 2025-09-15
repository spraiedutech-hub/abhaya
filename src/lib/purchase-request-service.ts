
'use server';

import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { getLoggedInUser } from './user-service';

export interface PurchaseRequest {
  id?: string;
  userId: string;
  amount: number;
  product: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: Timestamp;
}

export async function createPurchaseRequest(
  data: Pick<PurchaseRequest, 'amount' | 'product'>
): Promise<{ success: boolean; message: string }> {
  const user = await getLoggedInUser();
  if (!user) {
    return { success: false, message: 'You must be logged in to make a request.' };
  }

  if (user.status === 'Inactive') {
      return { success: false, message: 'Your account must be active to request a purchase.'}
  }

  try {
    const requestsCollection = collection(db, 'purchaseRequests');
    const newRequest: Omit<PurchaseRequest, 'id'> = {
      ...data,
      userId: user.id,
      status: 'pending',
      requestDate: Timestamp.now(),
    };
    await addDoc(requestsCollection, newRequest);
    return { success: true, message: 'Purchase request submitted for admin approval.' };
  } catch (error) {
    console.error('Error creating purchase request:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}


'use server';

import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  Timestamp,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { getUsersByIds, type User } from './user-service';
import { recordSale } from './sales-service';
import { revalidatePath } from 'next/cache';

export interface PurchaseRequest {
  id?: string;
  userId: string;
  amount: number;
  product: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: Timestamp;
}

export interface PurchaseRequestWithUser extends PurchaseRequest {
    user: User;
}

export async function createPurchaseRequest(
  data: Pick<PurchaseRequest, 'amount' | 'product'>
): Promise<{ success: boolean; message: string }> {
  // TODO: Add back logged in user check
  const mockUser = { id: 'mock-user-id', status: 'Active' };

  if (mockUser.status === 'Inactive') {
      return { success: false, message: 'Your account must be active to request a purchase.'}
  }

  try {
    const requestsCollection = collection(db, 'purchaseRequests');
    const newRequest: Omit<PurchaseRequest, 'id'> = {
      ...data,
      userId: mockUser.id,
      status: 'pending',
      requestDate: Timestamp.now(),
    };
    await addDoc(requestsCollection, newRequest);
    revalidatePath('/');
    return { success: true, message: 'Purchase request submitted for admin approval.' };
  } catch (error) {
    console.error('Error creating purchase request:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function getPendingPurchaseRequests(): Promise<PurchaseRequestWithUser[]> {
    const requestsCollection = collection(db, 'purchaseRequests');
    const q = query(requestsCollection, where('status', '==', 'pending'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return [];
    }

    const requests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PurchaseRequest));
    const userIds = [...new Set(requests.map(req => req.userId))];
    const users = await getUsersByIds(userIds);
    const usersMap = new Map(users.map(user => [user.id, user]));

    return requests.map(req => ({
        ...req,
        user: usersMap.get(req.userId) || { id: req.userId, name: 'Unknown User', email: '', rank: 'Direct Distributor', status: 'Inactive', joinedDate: '' },
    }));
}

export async function approvePurchaseRequest(requestId: string, saleData: Pick<PurchaseRequest, 'userId' | 'amount' | 'product'>): Promise<{success: boolean, message: string}> {
    try {
        // 1. Record the sale, which triggers commission calculation
        await recordSale(saleData);

        // 2. Update the status of the purchase request
        const requestDoc = doc(db, 'purchaseRequests', requestId);
        await updateDoc(requestDoc, { status: 'approved' });
        
        revalidatePath('/admin');
        return { success: true, message: 'Request approved and sale recorded.' };
    } catch(e) {
        console.error('Error approving request:', e);
        return { success: false, message: 'Failed to approve request.' };
    }
}

export async function rejectPurchaseRequest(requestId: string): Promise<{success: boolean, message: string}> {
     try {
        const requestDoc = doc(db, 'purchaseRequests', requestId);
        await updateDoc(requestDoc, { status: 'rejected' });

        revalidatePath('/admin');
        return { success: true, message: 'Request has been rejected.' };
    } catch(e) {
        console.error('Error rejecting request:', e);
        return { success: false, message: 'Failed to reject request.' };
    }
}

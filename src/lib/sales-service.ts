
'use server';

import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  Timestamp,
  where,
  documentId,
} from 'firebase/firestore';
import type { User } from './user-service';
import { getUsersByIds } from './user-service';

export interface Sale {
  id?: string;
  userId: string;
  amount: number;
  date: Timestamp;
  product: string;
}

export interface SaleWithUser extends Sale {
  user: User;
}

export async function recordSale(saleData: Omit<Sale, 'date'>): Promise<string> {
  try {
    const salesCollection = collection(db, 'sales');
    const docRef = await addDoc(salesCollection, {
      ...saleData,
      date: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error recording sale:', error);
    throw new Error('Could not record sale.');
  }
}

export async function getRecentSales(count: number = 5): Promise<SaleWithUser[]> {
  const salesCollection = collection(db, 'sales');
  const q = query(salesCollection, orderBy('date', 'desc'), limit(count));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return [];
  }
  
  const sales = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
  
  const userIds = [...new Set(sales.map(sale => sale.userId))];
  const users = await getUsersByIds(userIds);
  const usersMap = new Map(users.map(user => [user.id, user]));

  return sales.map(sale => ({
    ...sale,
    user: usersMap.get(sale.userId) || { id: sale.userId, name: 'Unknown User', email: '' },
  }));
}

export async function getTotalSalesStats(): Promise<{ totalSales: number; totalOrders: number }> {
    const salesCollection = collection(db, 'sales');
    const querySnapshot = await getDocs(salesCollection);

    if (querySnapshot.empty) {
        return { totalSales: 0, totalOrders: 0 };
    }

    const stats = querySnapshot.docs.reduce((acc, doc) => {
        const sale = doc.data() as Sale;
        acc.totalSales += sale.amount;
        acc.totalOrders += 1;
        return acc;
    }, { totalSales: 0, totalOrders: 0 });

    return stats;
}

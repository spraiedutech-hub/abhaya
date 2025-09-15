
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp, writeBatch, doc, query, where, getDocs } from 'firebase/firestore';
import type { Sale } from './sales-service';
import type { User } from './user-service';
import { getUsersByIds } from './user-service';

export interface Commission {
  id?: string;
  saleId: string;
  userId: string; // User receiving the commission
  sourceUserId: string; // User who made the sale
  amount: number;
  type: 'personal' | 'upline';
  calculationDate: Timestamp;
}

function getPersonalCommissionRate(user: User): number {
    if (user.rank === 'Supervisor') {
        return 0.30;
    }
    if (user.rank === 'New Supervisor') {
        return 0.20;
    }
    // Direct Distributors don't earn personal commission in this model, only uplines do.
    return 0;
}

function getUplineCommissionRate(upline: User): number {
    if (upline.rank === 'Supervisor' || upline.rank === 'New Supervisor') {
        return 0.10;
    }
    return 0;
}

export async function calculateAndRecordCommissions(sale: Sale): Promise<void> {
  try {
    const sellerId = sale.userId;
    const users = await getUsersByIds([sellerId]);
    const seller = users.find(u => u.id === sellerId);

    if (!seller) {
      console.error(`Seller with ID ${sellerId} not found.`);
      return;
    }

    const batch = writeBatch(db);
    const commissionsCollection = collection(db, 'commissions');

    // 1. Calculate Personal Commission for the seller
    const personalRate = getPersonalCommissionRate(seller);
    if (personalRate > 0) {
      const personalCommissionAmount = sale.amount * personalRate;
      const personalCommission: Omit<Commission, 'id'> = {
        saleId: sale.id!,
        userId: seller.id,
        sourceUserId: seller.id,
        amount: personalCommissionAmount,
        type: 'personal',
        calculationDate: Timestamp.now(),
      };
      const personalCommRef = doc(commissionsCollection);
      batch.set(personalCommRef, personalCommission);
    }
    
    // 2. Calculate Upline Commission for the seller's supervisor
    if (seller.uplineId) {
      const uplineUsers = await getUsersByIds([seller.uplineId]);
      const upline = uplineUsers.find(u => u.id === seller.uplineId);

      if (upline) {
        const uplineRate = getUplineCommissionRate(upline);
        if (uplineRate > 0) {
          const uplineCommissionAmount = sale.amount * uplineRate;
          const uplineCommission: Omit<Commission, 'id'> = {
            saleId: sale.id!,
            userId: upline.id,
            sourceUserId: seller.id,
            amount: uplineCommissionAmount,
            type: 'upline',
            calculationDate: Timestamp.now(),
          };
          const uplineCommRef = doc(commissionsCollection);
          batch.set(uplineCommRef, uplineCommission);
        }
      }
    }

    await batch.commit();
    console.log(`Commissions calculated for sale ID: ${sale.id}`);
  } catch (error) {
    console.error('Error calculating and recording commissions:', error);
    // In a real application, you'd add more robust error handling,
    // like a retry queue or logging to an external service.
    throw new Error('Could not process commissions.');
  }
}

export async function getUserEarnings(userId: string): Promise<number> {
    const commissionsCollection = collection(db, 'commissions');
    const q = query(commissionsCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return 0;
    }

    return querySnapshot.docs.reduce((total, doc) => {
        const commission = doc.data() as Commission;
        return total + commission.amount;
    }, 0);
}

export async function getUserWeeklyEarnings(userId: string): Promise<number> {
    const commissionsCollection = collection(db, 'commissions');
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoTimestamp = Timestamp.fromDate(oneWeekAgo);

    const q = query(
        commissionsCollection, 
        where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return 0;
    }

    return querySnapshot.docs.reduce((total, doc) => {
        const commission = doc.data() as Commission;
        if (commission.calculationDate.toMillis() >= oneWeekAgoTimestamp.toMillis()) {
             return total + commission.amount;
        }
        return total;
    }, 0);
}

export async function getTotalCommissionPaid(): Promise<number> {
    const commissionsCollection = collection(db, 'commissions');
    const querySnapshot = await getDocs(commissionsCollection);

    if (querySnapshot.empty) {
        return 0;
    }

    return querySnapshot.docs.reduce((total, doc) => {
        const commission = doc.data() as Commission;
        return total + commission.amount;
    }, 0);
}

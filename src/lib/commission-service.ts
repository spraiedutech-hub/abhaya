
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp, writeBatch, doc } from 'firebase/firestore';
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

// NOTE: For simplicity, this model assumes a "Newly Promoted Supervisor"
// is any Supervisor. A more complex system might track their first month.
function getPersonalCommissionRate(user: User): number {
    if (user.rank === 'Supervisor') {
        // "Newly Promoted Supervisor" gets 20%, but for now, we'll treat all supervisors the same for simplicity.
        // A real system might check the promotion date.
        // Let's assume the 30% for established supervisors is the main rule.
        return 0.30; 
    }
    // Direct Distributors don't earn personal commission in this model, only uplines do.
    return 0;
}

function getUplineCommissionRate(upline: User): number {
    if (upline.rank === 'Supervisor') {
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
    // This model gives personal commission only to Supervisors.
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

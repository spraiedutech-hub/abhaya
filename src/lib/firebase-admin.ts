
import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : null;

const app = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount!),
    })
  : getApp();

const auth = getAuth(app);

export { app, auth };

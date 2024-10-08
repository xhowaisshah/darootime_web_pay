import { initializeApp, getApps, App, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import serviceAccount from '../../daro-time-firebase-adminsdk-pzav5-426cabcda8.json';

// Initialize Firebase Admin only once
let adminApp: App;

if (!getApps().length) {
  adminApp = initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
    databaseURL: process.env.FIREBASE_ADMIN_DATABASE_URL,
  });
} else {
  adminApp = getApps()[0];
}

// Initialize Firestore and Auth services
const adminFirestore = getFirestore(adminApp);
const adminAuth = getAuth(adminApp);

export { adminApp, adminFirestore, adminAuth };
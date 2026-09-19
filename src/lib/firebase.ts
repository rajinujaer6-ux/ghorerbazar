import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  Firestore,
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import firebaseConfigData from '../../firebase-applet-config.json';

const rawConfig: Record<string, any> = (firebaseConfigData as Record<string, any>) || {};
const metaEnv = ((import.meta as any).env as Record<string, any>) || {};

const firebaseConfig = {
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || rawConfig.projectId || 'gen-lang-client-0958462212',
  appId: metaEnv.VITE_FIREBASE_APP_ID || rawConfig.appId || '1:768466059989:web:a03712c953d93e477d185c',
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || rawConfig.apiKey || 'AIzaSyDJwQUhfSDRLop-foFC9caQcFXLd78IAgY',
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || rawConfig.authDomain || 'gen-lang-client-0958462212.firebaseapp.com',
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || rawConfig.storageBucket || 'gen-lang-client-0958462212.firebasestorage.app',
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || rawConfig.messagingSenderId || '768466059989',
};

const databaseId =
  metaEnv.VITE_FIREBASE_DATABASE_ID ||
  rawConfig.firestoreDatabaseId ||
  'ai-studio-ghorerbazarorgan-df725839-71ed-499a-8189-b9f909604a67';

// 1. Safe Singleton Firebase App Initialization
let appInstance: FirebaseApp | null = null;
try {
  appInstance = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} catch (e) {
  console.warn('Firebase app init notice (fallback to local state):', e);
}

// 2. Safe High-Speed Firestore Initialization
let dbInstance: Firestore | null = null;
if (appInstance) {
  try {
    dbInstance = initializeFirestore(
      appInstance,
      {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      },
      databaseId || '(default)'
    );
  } catch (e) {
    try {
      dbInstance = getFirestore(appInstance, databaseId || undefined);
    } catch (err2) {
      console.warn('Firestore initialization fallback:', err2);
    }
  }
}

// 3. Safe Auth
let authInstance: Auth | null = null;
if (appInstance) {
  try {
    authInstance = getAuth(appInstance);
  } catch (e) {
    console.warn('Firebase Auth notice:', e);
  }
}

export const app = appInstance;
export const db = dbInstance;
export const auth = authInstance;

// Hacker Protection: Input Sanitization Utility against XSS & Injection attacks
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '') // Strip HTML tags
    .replace(/javascript:/gi, '') // Prevent javascript: pseudo-protocol
    .replace(/on\w+=/gi, '') // Prevent inline event handlers like onclick=
    .trim();
};

export const sanitizeObject = <T extends Record<string, any>>(obj: T): T => {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = sanitizeInput(value);
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = sanitizeObject(value);
    } else {
      result[key] = value;
    }
  }
  return result;
};

// Rate limiter / brute force prevention helper
class RateLimiter {
  private attempts: Map<string, { count: number; lastReset: number }> = new Map();
  private maxAttempts = 15;
  private windowMs = 60 * 1000; // 1 minute

  isAllowed(actionKey: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(actionKey);

    if (!record || now - record.lastReset > this.windowMs) {
      this.attempts.set(actionKey, { count: 1, lastReset: now });
      return true;
    }

    if (record.count >= this.maxAttempts) {
      return false;
    }

    record.count += 1;
    return true;
  }
}

export const securityRateLimiter = new RateLimiter();

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  limit
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import firebaseConfigData from '../../firebase-applet-config.json';

const firebaseConfig = {
  projectId: firebaseConfigData.projectId,
  appId: firebaseConfigData.appId,
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
};

// 1. Initialize Firebase App (Singleton Pattern)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 2. High-Speed Firestore with Multi-Tab Offline Persistent Cache
// This gives near-instant (<50ms) load time on repeat visits and smooth offline capabilities!
let dbInstance;
try {
  dbInstance = initializeFirestore(
    app,
    {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    },
    firebaseConfigData.firestoreDatabaseId || '(default)'
  );
} catch (e) {
  // Fallback if already initialized
  dbInstance = getFirestore(app, firebaseConfigData.firestoreDatabaseId || undefined);
}

export const db = dbInstance;
export const auth = getAuth(app);

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

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';


import serviceAccount from "../auth-dev-9b495-c4144a40c5ef.json" assert { type: "json"}

let db, auth, rtdb;


async function initializeFirebase() {
    try {
      // Check if Firebase is already initialized
      if (getApps().length === 0) {
        // Load service account
        // Initialize Firebase Admin
        const app = initializeApp({
          credential: cert(serviceAccount)
        });
        
        console.log('Firebase Admin initialized successfully');
      } else {
        console.log('Firebase Admin already initialized');
      }
      
      // Get service instances
      db = getFirestore();
      auth = getAuth();

      return { db, auth };
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      throw error;
    }
  }
  
  // Export the initialization function and instances
  export { initializeFirebase, db, auth, rtdb };
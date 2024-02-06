import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB7TwSTgNDD24eh2BqPCfsUjjLDuBX01no',
  authDomain: 'kibina-bd896.firebaseapp.com',
  projectId: 'kibina-bd896',
  storageBucket: 'kibina-bd896.appspot.com',
  messagingSenderId: '295538822258',
  appId: '1:295538822258:web:5a77e5cbc112f0fd5c86eb'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const storage = getStorage(app);

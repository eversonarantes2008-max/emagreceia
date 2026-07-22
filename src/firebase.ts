import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuration parsed from /firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyCMJVIVFrBtvdq0ysFhaAC9BW1aPAQ8pX8",
  authDomain: "e-lexicon-424119-p9.firebaseapp.com",
  projectId: "e-lexicon-424119-p9",
  storageBucket: "e-lexicon-424119-p9.firebasestorage.app",
  messagingSenderId: "320570067554",
  appId: "1:320570067554:web:27e2222316c69d092f5f3b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Use the specific firestoreDatabaseId created during provisioning
const db = getFirestore(app, "ai-studio-emagreceia-4fd0e982-89b1-4ffa-8e64-7f2c5c4ad5ba");

export { app, auth, db };

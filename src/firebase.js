import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCGoNftlf7MIF5B4EphhtqL002JWX8hi-0",
  authDomain: "agent-arc-a2bb5.firebaseapp.com",
  projectId: "agent-arc-a2bb5",
  storageBucket: "agent-arc-a2bb5.firebasestorage.app",
  messagingSenderId: "292211593242",
  appId: "1:292211593242:web:1332007ef904ed240701a3",
  measurementId: "G-67H9GKW5LE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

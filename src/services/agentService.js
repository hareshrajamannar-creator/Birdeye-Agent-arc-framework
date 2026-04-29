import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

const COLLECTION = 'agents';

// Save or update an agent (creates if new, overwrites if exists)
export function saveAgent(agentId, snapshot) {
  return setDoc(doc(db, COLLECTION, agentId), {
    ...snapshot,
    updatedAt: serverTimestamp(),
  });
}

// Delete an agent by id
export function deleteAgent(agentId) {
  return deleteDoc(doc(db, COLLECTION, agentId));
}

// Subscribe to all agents in real-time
// onAgents is called immediately and on every change
// Returns the unsubscribe function — call it on component unmount
export function subscribeToAgents(onAgents) {
  return onSnapshot(collection(db, COLLECTION), (snapshot) => {
    const agents = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    onAgents(agents);
  });
}

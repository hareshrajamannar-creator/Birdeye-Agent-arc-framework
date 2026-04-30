import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';

const COLLECTION = 'agents';
const RESERVED_FIELD_PREFIX = 'reservedField_';

function encodeFieldKey(key) {
  if (/^__.*__$/.test(key)) return `${RESERVED_FIELD_PREFIX}${key.slice(2, -2)}`;
  return key;
}

function decodeFieldKey(key) {
  if (key.startsWith(RESERVED_FIELD_PREFIX)) {
    return `__${key.slice(RESERVED_FIELD_PREFIX.length)}__`;
  }
  return key;
}

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function sanitizeForFirestore(value) {
  if (value === undefined || typeof value === 'function') return undefined;
  if (Array.isArray(value)) {
    return value.map((item) => {
      const sanitized = sanitizeForFirestore(item);
      return sanitized === undefined ? null : sanitized;
    });
  }
  if (value && isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, nestedValue]) => [encodeFieldKey(key), sanitizeForFirestore(nestedValue)])
        .filter(([, nestedValue]) => nestedValue !== undefined)
    );
  }
  return value;
}

function restoreFromFirestore(value) {
  if (Array.isArray(value)) return value.map(restoreFromFirestore);
  if (value && isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, nestedValue]) => [decodeFieldKey(key), restoreFromFirestore(nestedValue)])
    );
  }
  return value;
}

// Save or update an agent (creates if new, overwrites if exists)
export function saveAgent(agentId, snapshot) {
  return setDoc(doc(db, COLLECTION, agentId), {
    ...sanitizeForFirestore(snapshot),
    updatedAt: serverTimestamp(),
  });
}

// Fetch a single agent by id (one-time read)
export async function getAgent(agentId) {
  const snap = await getDoc(doc(db, COLLECTION, agentId));
  if (!snap.exists()) return null;
  return restoreFromFirestore({ id: snap.id, ...snap.data() });
}

// Delete an agent by id
export function deleteAgent(agentId) {
  return deleteDoc(doc(db, COLLECTION, agentId));
}

// Fetch a single agent by moduleSlug + agentSlug
export async function getAgentBySlug(moduleSlug, agentSlug) {
  const q = query(
    collection(db, COLLECTION),
    where('agentSlug', '==', agentSlug),
    where('moduleSlug', '==', moduleSlug)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return restoreFromFirestore({ id: snap.docs[0].id, ...snap.docs[0].data() });
}

// Subscribe to all agents in real-time
// onAgents is called immediately and on every change
// Returns the unsubscribe function — call it on component unmount
export function subscribeToAgents(onAgents) {
  return onSnapshot(collection(db, COLLECTION), (snapshot) => {
    const agents = snapshot.docs.map((d) => restoreFromFirestore({ id: d.id, ...d.data() }));
    onAgents(agents);
  });
}

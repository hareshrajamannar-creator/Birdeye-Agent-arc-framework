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

// Save or update an agent. Use merge semantics so independent autosaves
// for group metrics, tables, and builder details do not erase each other.
export function saveAgent(agentId, snapshot) {
  // Keep the in-memory cache in sync so re-navigation within the same session
  // doesn't load stale data instead of the version just written to Firestore.
  if (snapshot.agentSlug && snapshot.moduleSlug) {
    agentCache[cacheKey(snapshot.moduleSlug, snapshot.agentSlug)] = { ...snapshot, id: agentId };
  }
  return setDoc(doc(db, COLLECTION, agentId), {
    ...sanitizeForFirestore(snapshot),
    updatedAt: serverTimestamp(),
  }, { merge: true });
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

// ─── Module-level prefetch cache ─────────────────────────────────────────────
const agentCache = {};

function cacheKey(moduleSlug, agentSlug) {
  return `${moduleSlug}/${agentSlug}`;
}

export async function prefetchAgent(agentSlug, moduleSlug) {
  if (!agentSlug || !moduleSlug) return;
  const key = cacheKey(moduleSlug, agentSlug);
  if (agentCache[key]) return;
  const q = query(
    collection(db, COLLECTION),
    where('agentSlug', '==', agentSlug),
    where('moduleSlug', '==', moduleSlug)
  );
  const snap = await getDocs(q);
  if (!snap.empty) {
    agentCache[key] = restoreFromFirestore({ id: snap.docs[0].id, ...snap.docs[0].data() });
  }
}

export function getCachedAgent(agentSlug, moduleSlug) {
  if (!agentSlug || !moduleSlug) return null;
  return agentCache[cacheKey(moduleSlug, agentSlug)] ?? null;
}

export async function getAgentsByModuleSlug(moduleSlug) {
  if (!moduleSlug) return [];
  const q = query(collection(db, COLLECTION), where('moduleSlug', '==', moduleSlug));
  const snap = await getDocs(q);
  return snap.docs.map((d) => restoreFromFirestore({ id: d.id, ...d.data() }));
}

// Fetch a single agent by moduleSlug + agentSlug (checks cache first)
export async function getAgentBySlug(moduleSlug, agentSlug) {
  const key = cacheKey(moduleSlug, agentSlug);
  if (agentCache[key]) return agentCache[key];
  const q = query(
    collection(db, COLLECTION),
    where('agentSlug', '==', agentSlug),
    where('moduleSlug', '==', moduleSlug)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const result = restoreFromFirestore({ id: snap.docs[0].id, ...snap.docs[0].data() });
  agentCache[key] = result;
  return result;
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

// ─── Custom tools collection ───────────────────────────────────────────────────

const TOOLS_COLLECTION = 'customTools';

export function saveCustomTool(tool) {
  const toolId = tool.id || doc(collection(db, TOOLS_COLLECTION)).id;
  const toolToSave = { ...tool, id: toolId };
  return setDoc(doc(db, TOOLS_COLLECTION, toolId), {
    ...sanitizeForFirestore(toolToSave),
    updatedAt: serverTimestamp(),
  });
}

export function deleteCustomTool(toolId) {
  return deleteDoc(doc(db, TOOLS_COLLECTION, toolId));
}

export function subscribeToCustomTools(onTools) {
  return onSnapshot(collection(db, TOOLS_COLLECTION), (snapshot) => {
    const tools = snapshot.docs.map((d) => restoreFromFirestore({ id: d.id, ...d.data() }));
    onTools(tools);
  });
}

export async function getCustomTools() {
  const snap = await getDocs(collection(db, TOOLS_COLLECTION));
  return snap.docs.map((d) => restoreFromFirestore({ id: d.id, ...d.data() }));
}

export async function getCustomToolsByIds(toolIds) {
  const uniqueIds = [...new Set((toolIds || []).filter(Boolean))];
  if (uniqueIds.length === 0) return [];
  const snaps = await Promise.all(uniqueIds.map((toolId) => getDoc(doc(db, TOOLS_COLLECTION, toolId))));
  return snaps
    .filter((snap) => snap.exists())
    .map((snap) => restoreFromFirestore({ id: snap.id, ...snap.data() }));
}

import { db } from '../firebase';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

const COLLECTION = 'agentTemplates';
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

export function saveTemplate(templateId, template) {
  return setDoc(doc(db, COLLECTION, templateId), {
    ...sanitizeForFirestore(template),
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export function deleteTemplate(templateId) {
  return deleteDoc(doc(db, COLLECTION, templateId));
}

export function subscribeToTemplates(onTemplates) {
  return onSnapshot(collection(db, COLLECTION), (snapshot) => {
    const templates = snapshot.docs.map((d) => restoreFromFirestore({ id: d.id, ...d.data() }));
    onTemplates(templates);
  });
}

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

export function saveTemplate(templateId, template) {
  return setDoc(doc(db, COLLECTION, templateId), {
    ...template,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export function deleteTemplate(templateId) {
  return deleteDoc(doc(db, COLLECTION, templateId));
}

export function subscribeToTemplates(onTemplates) {
  return onSnapshot(collection(db, COLLECTION), (snapshot) => {
    const templates = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    onTemplates(templates);
  });
}

import { 
  collection, doc, getDoc, getDocs, setDoc, deleteDoc, writeBatch
} from 'firebase/firestore';
import { signInWithPopup, signOut } from 'firebase/auth';
import { db, auth, googleProvider, handleFirestoreError, OperationType } from './firebase';
import type { 
  UserProfile, EducationItem, SkillItem, ProjectItem, GalleryItem, CertificateItem, SiteSettings, ContactMessage 
} from '../types/index';

export interface FirebaseSyncStatus {
  lastSyncedAt: string | null;
  status: 'idle' | 'syncing' | 'success' | 'error';
  message: string;
}

// Push all local/server data to Cloud Firestore
export async function syncAllToFirestore(data: {
  profile: UserProfile;
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  gallery: GalleryItem[];
  certificates: CertificateItem[];
  settings: SiteSettings;
}): Promise<void> {
  const batch = writeBatch(db);

  try {
    // 1. Profile
    const profileRef = doc(db, 'profile', 'main');
    batch.set(profileRef, { ...data.profile, updatedAt: new Date().toISOString() }, { merge: true });

    // 2. Settings
    const settingsRef = doc(db, 'settings', 'global');
    batch.set(settingsRef, data.settings, { merge: true });

    // 3. Education
    for (const item of data.education) {
      const ref = doc(db, 'education', item.id);
      batch.set(ref, item, { merge: true });
    }

    // 4. Skills
    for (const item of data.skills) {
      const ref = doc(db, 'skills', item.id);
      batch.set(ref, item, { merge: true });
    }

    // 5. Projects
    for (const item of data.projects) {
      const ref = doc(db, 'projects', item.id);
      batch.set(ref, item, { merge: true });
    }

    // 6. Gallery
    for (const item of data.gallery) {
      const ref = doc(db, 'gallery', item.id);
      batch.set(ref, item, { merge: true });
    }

    // 7. Certificates
    for (const item of data.certificates) {
      const ref = doc(db, 'certificates', item.id);
      batch.set(ref, item, { merge: true });
    }

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'all_collections');
  }
}

// Fetch all data from Cloud Firestore
export async function fetchAllFromFirestore(): Promise<{
  profile?: UserProfile;
  education?: EducationItem[];
  skills?: SkillItem[];
  projects?: ProjectItem[];
  gallery?: GalleryItem[];
  certificates?: CertificateItem[];
  settings?: SiteSettings;
}> {
  try {
    const result: any = {};

    // 1. Profile
    try {
      const profileSnap = await getDoc(doc(db, 'profile', 'main'));
      if (profileSnap.exists()) {
        result.profile = profileSnap.data() as UserProfile;
      }
    } catch (err) {
      console.warn('Profile doc get warning in Firestore:', err);
    }

    // 2. Settings
    try {
      const settingsSnap = await getDoc(doc(db, 'settings', 'global'));
      if (settingsSnap.exists()) {
        result.settings = settingsSnap.data() as SiteSettings;
      }
    } catch (err) {
      console.warn('Settings doc get warning in Firestore:', err);
    }

    // 3. Education
    const eduSnap = await getDocs(collection(db, 'education'));
    result.education = eduSnap.docs.map(d => d.data() as EducationItem).sort((a, b) => a.order - b.order);

    // 4. Skills
    const skillSnap = await getDocs(collection(db, 'skills'));
    result.skills = skillSnap.docs.map(d => d.data() as SkillItem).sort((a, b) => a.order - b.order);

    // 5. Projects
    const projSnap = await getDocs(collection(db, 'projects'));
    result.projects = projSnap.docs.map(d => d.data() as ProjectItem).sort((a, b) => a.order - b.order);

    // 6. Gallery
    const galSnap = await getDocs(collection(db, 'gallery'));
    result.gallery = galSnap.docs.map(d => d.data() as GalleryItem).sort((a, b) => a.order - b.order);

    // 7. Certificates
    const certSnap = await getDocs(collection(db, 'certificates'));
    result.certificates = certSnap.docs.map(d => d.data() as CertificateItem).sort((a, b) => a.order - b.order);

    return result;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'firestore_fetch_all');
  }
}

// Send Contact Message to Cloud Firestore
export async function sendContactMessageToFirestore(message: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<void> {
  const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const messageData: ContactMessage = {
    id: messageId,
    name: message.name.trim(),
    email: message.email.trim(),
    subject: message.subject?.trim() || '',
    message: message.message.trim(),
    isRead: false,
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'messages', messageId), messageData);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `messages/${messageId}`);
  }
}

// Admin Google Authentication with Firebase Auth
export async function signInWithGoogleAdmin() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
}

export async function signOutFirebase() {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Sign Out Error:', error);
  }
}

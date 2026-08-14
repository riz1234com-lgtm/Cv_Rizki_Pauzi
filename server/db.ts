import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import type {
  UserProfile,
  EducationItem,
  SkillItem,
  ProjectItem,
  GalleryItem,
  CertificateItem,
  ContactMessage,
  SiteSettings,
  AdminUser,
  StatsOverview
} from '../src/types/index';

interface DatabaseSchema {
  admin: {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
    updatedAt: string;
  };
  profile: UserProfile;
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  gallery: GalleryItem[];
  certificates: CertificateItem[];
  messages: ContactMessage[];
  settings: SiteSettings;
}

const IS_VERCEL = process.env.VERCEL === '1' || !!process.env.VERCEL;
const ROOT_DATA_DIR = path.join(process.cwd(), 'data');
const ROOT_DB_FILE = path.join(ROOT_DATA_DIR, 'database.json');

const DATA_DIR = IS_VERCEL ? path.join('/tmp', 'data') : ROOT_DATA_DIR;
const DB_FILE = path.join(DATA_DIR, 'database.json');

const INITIAL_EDUCATION: EducationItem[] = [
  {
    id: 'edu-sdn-sukahati-2',
    institution: 'SDN Sukahati 2',
    level: 'Sekolah Dasar',
    status: 'Completed',
    startYear: 'Belum diatur',
    endYear: 'Belum diatur',
    description: 'Pendidikan tingkat dasar (SD) diselesaikan di SDN Sukahati 2.',
    logoUrl: '',
    order: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'edu-smp-mekar-arum',
    institution: 'SMP Mekar Arum',
    level: 'Sekolah Menengah Pertama',
    status: 'Completed',
    startYear: 'Belum diatur',
    endYear: 'Belum diatur',
    description: 'Pendidikan tingkat menengah pertama (SMP) diselesaikan di SMP Mekar Arum.',
    logoUrl: '',
    order: 2,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'edu-smk-medikacom',
    institution: 'SMK Medikacom',
    level: 'Sekolah Menengah Kejuruan',
    status: 'Completed',
    startYear: 'Belum diatur',
    endYear: 'Belum diatur',
    description: 'Pendidikan tingkat kejuruan (SMK) diselesaikan di SMK Medikacom.',
    logoUrl: '',
    order: 3,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'edu-upi-bandung',
    institution: 'Universitas Pendidikan Indonesia (UPI)',
    level: 'Perguruan Tinggi / Sarjana',
    status: 'In Progress',
    startYear: 'Belum diatur',
    endYear: 'Sekarang',
    description: 'Sedang menempuh studi pendidikan tinggi di Universitas Pendidikan Indonesia (UPI).',
    logoUrl: '',
    order: 4,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  }
];

const INITIAL_PROFILE: UserProfile = {
  name: 'Rizki Pauzi',
  headline: 'Personal Portfolio & Digital Journey',
  bio: 'Selamat datang di personal portfolio dan dokumentasi perjalanan digital saya.',
  about: 'Halo, saya Rizki Pauzi. Saat ini sedang menempuh pendidikan di Universitas Pendidikan Indonesia (UPI). Website ini dirancang untuk mendokumentasikan perjalanan akademis, keahlian, project, dan karya saya.',
  educationStatusSummary: 'Mahasiswa Aktif @ Universitas Pendidikan Indonesia (UPI)',
  avatarUrl: '',
  location: 'Bandung, Indonesia',
  email: '',
  whatsapp: '',
  instagram: '',
  linkedin: '',
  github: '',
  website: '',
  availableForWork: true
};

const INITIAL_SETTINGS: SiteSettings = {
  siteTitle: 'Rizki Pauzi — Personal Portfolio & Digital Journey',
  metaDescription: 'Website portfolio resmi Rizki Pauzi. Menampilkan riwayat pendidikan di Universitas Pendidikan Indonesia (UPI), karya, keahlian, dan dokumentasi.',
  heroGreeting: "Hello, I'm",
  heroName: 'Rizki Pauzi',
  heroHeadline: 'Personal Portfolio & Digital Journey',
  heroDescription: 'Mendokumentasikan perjalanan akademis di Universitas Pendidikan Indonesia (UPI) dan dedikasi dalam eksplorasi teknologi & kreativitas.',
  primaryAccent: '#0ea5e9',
  accentGlow: true,
  footerText: '© 2026 Rizki Pauzi. All Rights Reserved.',
  showAdminButton: true,
  enableSoundEffects: false
};

function getInitialData(): DatabaseSchema {
  const defaultEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@rizkipauzi.com';
  const defaultPass = process.env.ADMIN_DEFAULT_PASSWORD || 'AdminPassword2026!';
  const passwordHash = bcrypt.hashSync(defaultPass, 10);

  return {
    admin: {
      id: 'admin-main',
      email: defaultEmail,
      passwordHash,
      name: 'Rizki Pauzi (Admin)',
      updatedAt: new Date().toISOString()
    },
    profile: INITIAL_PROFILE,
    education: INITIAL_EDUCATION,
    skills: [],
    projects: [],
    gallery: [],
    certificates: [],
    messages: [],
    settings: INITIAL_SETTINGS
  };
}

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadData();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    try {
      const targetFile = fs.existsSync(DB_FILE) ? DB_FILE : (fs.existsSync(ROOT_DB_FILE) ? ROOT_DB_FILE : null);
      if (targetFile) {
        const raw = fs.readFileSync(targetFile, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure all required fields exist
        const result: DatabaseSchema = {
          ...getInitialData(),
          ...parsed,
          profile: { ...INITIAL_PROFILE, ...(parsed.profile || {}) },
          settings: { ...INITIAL_SETTINGS, ...(parsed.settings || {}) },
          education: parsed.education && parsed.education.length > 0 ? parsed.education : INITIAL_EDUCATION
        };
        // If we loaded from ROOT_DB_FILE in Vercel, copy it to DB_FILE (/tmp)
        if (targetFile !== DB_FILE) {
          this.saveData(result);
        }
        return result;
      }
    } catch (err) {
      console.error('Error loading database, resetting to initial seed:', err);
    }
    const initial = getInitialData();
    this.saveData(initial);
    return initial;
  }

  private saveData(dataToSave: DatabaseSchema = this.data) {
    try {
      this.ensureDirectory();
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  // Admin User
  getAdmin() {
    return this.data.admin;
  }

  updateAdminPassword(newPasswordHash: string) {
    this.data.admin.passwordHash = newPasswordHash;
    this.data.admin.updatedAt = new Date().toISOString();
    this.saveData();
  }

  updateAdminEmail(email: string, name?: string) {
    this.data.admin.email = email;
    if (name) this.data.admin.name = name;
    this.data.admin.updatedAt = new Date().toISOString();
    this.saveData();
  }

  // Profile
  getProfile(): UserProfile {
    return this.data.profile;
  }

  updateProfile(profile: Partial<UserProfile>): UserProfile {
    this.data.profile = { ...this.data.profile, ...profile };
    this.saveData();
    return this.data.profile;
  }

  // Education
  getEducation(): EducationItem[] {
    return [...this.data.education].sort((a, b) => a.order - b.order);
  }

  getEducationById(id: string): EducationItem | undefined {
    return this.data.education.find((e) => e.id === id);
  }

  addEducation(item: Omit<EducationItem, 'id' | 'createdAt' | 'updatedAt'>): EducationItem {
    const newItem: EducationItem = {
      ...item,
      id: `edu-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      order: item.order || this.data.education.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.education.push(newItem);
    this.saveData();
    return newItem;
  }

  updateEducation(id: string, updates: Partial<EducationItem>): EducationItem | null {
    const idx = this.data.education.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    this.data.education[idx] = {
      ...this.data.education[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData();
    return this.data.education[idx];
  }

  deleteEducation(id: string): boolean {
    const initialLen = this.data.education.length;
    this.data.education = this.data.education.filter((e) => e.id !== id);
    if (this.data.education.length !== initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  reorderEducation(orderedIds: string[]): EducationItem[] {
    this.data.education.forEach((item) => {
      const newOrder = orderedIds.indexOf(item.id);
      if (newOrder !== -1) {
        item.order = newOrder + 1;
      }
    });
    this.saveData();
    return this.getEducation();
  }

  // Skills
  getSkills(): SkillItem[] {
    return [...this.data.skills].sort((a, b) => a.order - b.order);
  }

  getSkillById(id: string): SkillItem | undefined {
    return this.data.skills.find((s) => s.id === id);
  }

  addSkill(item: Omit<SkillItem, 'id' | 'createdAt' | 'updatedAt'>): SkillItem {
    const newItem: SkillItem = {
      ...item,
      id: `skill-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      order: item.order || this.data.skills.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.skills.push(newItem);
    this.saveData();
    return newItem;
  }

  updateSkill(id: string, updates: Partial<SkillItem>): SkillItem | null {
    const idx = this.data.skills.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.skills[idx] = {
      ...this.data.skills[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData();
    return this.data.skills[idx];
  }

  deleteSkill(id: string): boolean {
    const len = this.data.skills.length;
    this.data.skills = this.data.skills.filter((s) => s.id !== id);
    if (this.data.skills.length !== len) {
      this.saveData();
      return true;
    }
    return false;
  }

  reorderSkills(orderedIds: string[]): SkillItem[] {
    this.data.skills.forEach((item) => {
      const idx = orderedIds.indexOf(item.id);
      if (idx !== -1) {
        item.order = idx + 1;
      }
    });
    this.saveData();
    return this.getSkills();
  }

  // Projects
  getProjects(publicOnly: boolean = false): ProjectItem[] {
    let list = [...this.data.projects];
    if (publicOnly) {
      list = list.filter((p) => p.isPublished);
    }
    return list.sort((a, b) => a.order - b.order);
  }

  getProjectById(id: string): ProjectItem | undefined {
    return this.data.projects.find((p) => p.id === id);
  }

  addProject(item: Omit<ProjectItem, 'id' | 'createdAt' | 'updatedAt'>): ProjectItem {
    const newItem: ProjectItem = {
      ...item,
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      order: item.order || this.data.projects.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.projects.push(newItem);
    this.saveData();
    return newItem;
  }

  updateProject(id: string, updates: Partial<ProjectItem>): ProjectItem | null {
    const idx = this.data.projects.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.projects[idx] = {
      ...this.data.projects[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData();
    return this.data.projects[idx];
  }

  deleteProject(id: string): boolean {
    const len = this.data.projects.length;
    this.data.projects = this.data.projects.filter((p) => p.id !== id);
    if (this.data.projects.length !== len) {
      this.saveData();
      return true;
    }
    return false;
  }

  reorderProjects(orderedIds: string[]): ProjectItem[] {
    this.data.projects.forEach((item) => {
      const idx = orderedIds.indexOf(item.id);
      if (idx !== -1) {
        item.order = idx + 1;
      }
    });
    this.saveData();
    return this.getProjects();
  }

  // Gallery
  getGallery(publicOnly: boolean = false): GalleryItem[] {
    let list = [...this.data.gallery];
    if (publicOnly) {
      list = list.filter((g) => g.isPublished);
    }
    return list.sort((a, b) => a.order - b.order);
  }

  addGalleryItem(item: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>): GalleryItem {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      order: item.order || this.data.gallery.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.gallery.push(newItem);
    this.saveData();
    return newItem;
  }

  updateGalleryItem(id: string, updates: Partial<GalleryItem>): GalleryItem | null {
    const idx = this.data.gallery.findIndex((g) => g.id === id);
    if (idx === -1) return null;
    this.data.gallery[idx] = {
      ...this.data.gallery[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData();
    return this.data.gallery[idx];
  }

  deleteGalleryItem(id: string): boolean {
    const len = this.data.gallery.length;
    this.data.gallery = this.data.gallery.filter((g) => g.id !== id);
    if (this.data.gallery.length !== len) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Certificates
  getCertificates(): CertificateItem[] {
    return [...this.data.certificates].sort((a, b) => a.order - b.order);
  }

  addCertificate(item: Omit<CertificateItem, 'id' | 'createdAt' | 'updatedAt'>): CertificateItem {
    const newItem: CertificateItem = {
      ...item,
      id: `cert-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      order: item.order || this.data.certificates.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.certificates.push(newItem);
    this.saveData();
    return newItem;
  }

  updateCertificate(id: string, updates: Partial<CertificateItem>): CertificateItem | null {
    const idx = this.data.certificates.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.certificates[idx] = {
      ...this.data.certificates[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData();
    return this.data.certificates[idx];
  }

  deleteCertificate(id: string): boolean {
    const len = this.data.certificates.length;
    this.data.certificates = this.data.certificates.filter((c) => c.id !== id);
    if (this.data.certificates.length !== len) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Messages
  getMessages(): ContactMessage[] {
    return [...this.data.messages].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  addMessage(msg: Omit<ContactMessage, 'id' | 'isRead' | 'createdAt'>): ContactMessage {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    this.data.messages.unshift(newMsg);
    this.saveData();
    return newMsg;
  }

  markMessageRead(id: string, isRead: boolean = true): boolean {
    const msg = this.data.messages.find((m) => m.id === id);
    if (msg) {
      msg.isRead = isRead;
      this.saveData();
      return true;
    }
    return false;
  }

  deleteMessage(id: string): boolean {
    const len = this.data.messages.length;
    this.data.messages = this.data.messages.filter((m) => m.id !== id);
    if (this.data.messages.length !== len) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Settings
  getSettings(): SiteSettings {
    return this.data.settings;
  }

  updateSettings(settings: Partial<SiteSettings>): SiteSettings {
    this.data.settings = { ...this.data.settings, ...settings };
    this.saveData();
    return this.data.settings;
  }

  // Overview Stats
  getStats(): StatsOverview {
    return {
      totalEducation: this.data.education.length,
      totalSkills: this.data.skills.length,
      totalProjects: this.data.projects.length,
      totalGallery: this.data.gallery.length,
      totalCertificates: this.data.certificates.length,
      totalMessages: this.data.messages.length,
      unreadMessages: this.data.messages.filter((m) => !m.isRead).length
    };
  }
}

export const db = new DatabaseManager();

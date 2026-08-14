export type EducationStatus = 'Completed' | 'In Progress';

export interface UserProfile {
  name: string;
  headline: string;
  bio: string;
  about: string;
  educationStatusSummary: string;
  avatarUrl: string;
  location: string;
  email: string;
  whatsapp: string;
  instagram: string;
  linkedin: string;
  github: string;
  website: string;
  availableForWork: boolean;
}

export interface EducationItem {
  id: string;
  institution: string;
  level: string;
  status: EducationStatus;
  startYear: string;
  endYear: string;
  description: string;
  logoUrl?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Programming' | 'Web Development' | 'Design' | 'Digital Skills' | 'Other Skills' | string;
  proficiency: number; // 0 - 100
  levelLabel: string; // Beginner, Intermediate, Advanced, Expert
  icon: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  thumbnailUrl: string;
  category: 'Web' | 'Application' | 'Design' | 'Other' | string;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  isPublished: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  category: 'Foto' | 'Project' | 'Sertifikat' | 'Dokumentasi' | 'Achievement' | 'Other' | string;
  isPublished: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  institution: string;
  year: string;
  credentialId?: string;
  imageUrl?: string;
  verificationUrl?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface SiteSettings {
  siteTitle: string;
  metaDescription: string;
  heroGreeting: string;
  heroName: string;
  heroHeadline: string;
  heroDescription: string;
  primaryAccent: string;
  accentGlow: boolean;
  footerText: string;
  showAdminButton: boolean;
  enableSoundEffects?: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: AdminUser;
}

export interface StatsOverview {
  totalEducation: number;
  totalSkills: number;
  totalProjects: number;
  totalGallery: number;
  totalCertificates: number;
  totalMessages: number;
  unreadMessages: number;
}

import React, { useState, useEffect, useCallback } from 'react';
import { ToastProvider, useToast } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { EducationSection } from './components/sections/EducationSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { GallerySection } from './components/sections/GallerySection';
import { CertificatesSection } from './components/sections/CertificatesSection';
import { ContactSection } from './components/sections/ContactSection';
import { DownloadSection } from './components/sections/DownloadSection';
import { PortfolioExportModal } from './components/common/PortfolioExportModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout, type AdminTab } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminProfile } from './components/admin/AdminProfile';
import { AdminEducation } from './components/admin/AdminEducation';
import { AdminSkills } from './components/admin/AdminSkills';
import { AdminProjects } from './components/admin/AdminProjects';
import { AdminGallery } from './components/admin/AdminGallery';
import { AdminCertificates } from './components/admin/AdminCertificates';
import { AdminMessages } from './components/admin/AdminMessages';
import { AdminSettings } from './components/admin/AdminSettings';
import { api } from './services/api';
import type {
  UserProfile,
  EducationItem,
  SkillItem,
  ProjectItem,
  GalleryItem,
  CertificateItem,
  ContactMessage,
  SiteSettings,
  StatsOverview
} from './types/index';

type ViewMode = 'public' | 'admin';

const defaultProfile: UserProfile = {
  name: 'Rizki Pauzi',
  headline: 'Personal Portfolio & Digital Journey',
  bio: 'Mahasiswa Universitas Pendidikan Indonesia (UPI) dengan komitmen belajar yang berkelanjutan dan dedikasi terhadap perkembangan teknologi digital.',
  about: 'Halo, saya Rizki Pauzi. Saat ini sedang menempuh pendidikan di Universitas Pendidikan Indonesia (UPI). Website ini dirancang untuk mendokumentasikan perjalanan akademis, keahlian, project, dan karya saya.',
  educationStatusSummary: 'Universitas Pendidikan Indonesia (UPI)',
  avatarUrl: '',
  location: 'Indonesia',
  email: '',
  whatsapp: '',
  instagram: '',
  linkedin: '',
  github: '',
  website: '',
  availableForWork: true
};

const defaultSettings: SiteSettings = {
  siteTitle: 'Rizki Pauzi — Official Portfolio & CMS',
  metaDescription: 'Website portfolio resmi dan sistem informasi profesional Rizki Pauzi.',
  heroGreeting: 'Halo, Selamat Datang di Portfolio Resmi',
  heroName: 'Rizki Pauzi',
  heroHeadline: 'Personal Portfolio & Digital Journey',
  heroDescription: 'Dokumentasi rekam jejak akademis, kompetensi teknologi, dan portofolio karya digital.',
  primaryAccent: '#06b6d4',
  accentGlow: true,
  footerText: '© 2026 Rizki Pauzi. All Rights Reserved. Powered by Full-Stack CMS.',
  showAdminButton: true
};

function MainAppContent() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { error: toastError } = useToast();

  const [viewMode, setViewMode] = useState<ViewMode>('public');
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('dashboard');

  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [educationList, setEducationList] = useState<EducationItem[]>([]);
  const [skillsList, setSkillsList] = useState<SkillItem[]>([]);
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([]);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);
  const [certificatesList, setCertificatesList] = useState<CertificateItem[]>([]);
  const [messagesList, setMessagesList] = useState<ContactMessage[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [stats, setStats] = useState<StatsOverview>({
    totalEducation: 4,
    totalSkills: 0,
    totalProjects: 0,
    totalGallery: 0,
    totalCertificates: 0,
    totalMessages: 0,
    unreadMessages: 0
  });

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Sync hash routing if user opens #admin or #login
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#admin' || hash === '#login') {
        setViewMode('admin');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Fetch Public Data
  const loadPublicData = useCallback(async () => {
    try {
      const [
        profRes,
        eduRes,
        skillRes,
        projRes,
        galRes,
        certRes,
        settRes
      ] = await Promise.allSettled([
        api.getProfile(),
        api.getEducation(),
        api.getSkills(),
        api.getProjects(),
        api.getGallery(),
        api.getCertificates(),
        api.getSettings()
      ]);

      if (profRes.status === 'fulfilled') setProfile(profRes.value.data);
      if (eduRes.status === 'fulfilled') setEducationList(eduRes.value.data);
      if (skillRes.status === 'fulfilled') setSkillsList(skillRes.value.data);
      if (projRes.status === 'fulfilled') setProjectsList(projRes.value.data);
      if (galRes.status === 'fulfilled') setGalleryList(galRes.value.data);
      if (certRes.status === 'fulfilled') setCertificatesList(certRes.value.data);
      if (settRes.status === 'fulfilled') setSettings(settRes.value.data);
    } catch (err: any) {
      console.error('Error fetching data:', err);
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  // Fetch Admin Specific Data (Messages & Stats)
  const loadAdminData = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const [msgRes, statsRes] = await Promise.allSettled([
        api.getMessages(),
        api.getStats()
      ]);

      if (msgRes.status === 'fulfilled') setMessagesList(msgRes.value.data);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
    } catch (err) {
      console.error('Error loading admin stats:', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadPublicData();
  }, [loadPublicData]);

  useEffect(() => {
    if (isAuthenticated && viewMode === 'admin') {
      loadAdminData();
    }
  }, [isAuthenticated, viewMode, loadAdminData]);

  // Update document title dynamically based on settings
  useEffect(() => {
    if (settings.siteTitle) {
      document.title = settings.siteTitle;
    }
  }, [settings.siteTitle]);

  const [activeSection, setActiveSection] = useState('hero');

  // Scroll spy to detect active section in viewport
  useEffect(() => {
    const sectionIds = ['hero', 'about', 'education', 'skills', 'projects', 'gallery', 'certificates', 'contact'];
    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 180;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateToAdmin = () => {
    setViewMode('admin');
    window.location.hash = 'admin';
  };

  const handleNavigateToPublic = () => {
    setViewMode('public');
    window.location.hash = '';
  };

  if (isInitialLoading || authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 flex items-center justify-center font-display font-black text-white text-xl shadow-xl shadow-cyan-500/20 mb-4 animate-pulse">
          RP
        </div>
        <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-2" />
        <span className="text-xs text-slate-400 font-mono-code">Memuat data portfolio...</span>
      </div>
    );
  }

  // Admin View
  if (viewMode === 'admin') {
    if (!isAuthenticated) {
      return (
        <AdminLogin
          onBackToWebsite={handleNavigateToPublic}
          onLoginSuccess={() => loadAdminData()}
        />
      );
    }

    const unreadCount = messagesList.filter((m) => !m.isRead).length;

    return (
      <AdminLayout
        activeTab={activeAdminTab}
        onSelectTab={setActiveAdminTab}
        onViewWebsite={handleNavigateToPublic}
        unreadCount={unreadCount}
      >
        {activeAdminTab === 'dashboard' && (
          <AdminDashboard
            stats={{
              ...stats,
              totalEducation: educationList.length,
              totalSkills: skillsList.length,
              totalProjects: projectsList.length,
              totalGallery: galleryList.length,
              totalCertificates: certificatesList.length,
              totalMessages: messagesList.length,
              unreadMessages: unreadCount
            }}
            recentMessages={messagesList}
            educationList={educationList}
            onNavigateTab={setActiveAdminTab}
          />
        )}

        {activeAdminTab === 'profile' && (
          <AdminProfile profile={profile} onProfileUpdated={setProfile} />
        )}

        {activeAdminTab === 'education' && (
          <AdminEducation educationList={educationList} onListUpdated={setEducationList} />
        )}

        {activeAdminTab === 'skills' && (
          <AdminSkills skillsList={skillsList} onListUpdated={setSkillsList} />
        )}

        {activeAdminTab === 'projects' && (
          <AdminProjects projectsList={projectsList} onListUpdated={setProjectsList} />
        )}

        {activeAdminTab === 'gallery' && (
          <AdminGallery galleryList={galleryList} onListUpdated={setGalleryList} />
        )}

        {activeAdminTab === 'certificates' && (
          <AdminCertificates
            certificatesList={certificatesList}
            onListUpdated={setCertificatesList}
          />
        )}

        {activeAdminTab === 'messages' && (
          <AdminMessages messagesList={messagesList} onListUpdated={setMessagesList} />
        )}

        {activeAdminTab === 'settings' && (
          <AdminSettings settings={settings} onSettingsUpdated={setSettings} />
        )}
      </AdminLayout>
    );
  }

  // Public Portfolio View
  return (
    <div className="min-h-screen bg-[#05070A] text-slate-200 selection:bg-cyan-500 selection:text-[#05070A] relative font-sans">
      {/* Top Navigation */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenAdmin={handleNavigateToAdmin}
        onNavigateToAdmin={handleNavigateToAdmin}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        siteTitle={settings.siteTitle}
        showAdminButton={settings.showAdminButton}
      />

      {/* Main Content Sections */}
      <main>
        <HeroSection
          profile={profile}
          settings={settings}
          onNavigate={handleNavigate}
          onNavigateToAdmin={handleNavigateToAdmin}
          onOpenExportModal={() => setIsExportModalOpen(true)}
        />

        <AboutSection
          profile={profile}
          educationList={educationList}
          skillsList={skillsList}
          projectsList={projectsList}
          certificatesList={certificatesList}
        />

        <EducationSection educationList={educationList} />

        <SkillsSection skillsList={skillsList} />

        <ProjectsSection projectsList={projectsList} />

        <GallerySection galleryList={galleryList} />

        <CertificatesSection certificatesList={certificatesList} />

        <DownloadSection
          profile={profile}
          onOpenExportModal={() => setIsExportModalOpen(true)}
        />

        <ContactSection profile={profile} />
      </main>

      {/* Portfolio Export / Download Modal */}
      <PortfolioExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        profile={profile}
        educationList={educationList}
        skillsList={skillsList}
        projectsList={projectsList}
        certificatesList={certificatesList}
      />

      {/* Footer */}
      <Footer
        profile={profile}
        settings={settings}
        onNavigate={handleNavigate}
        onOpenAdmin={handleNavigateToAdmin}
        onNavigateToAdmin={handleNavigateToAdmin}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ToastProvider>
  );
}

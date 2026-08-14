import React, { useState } from 'react';
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Code2,
  FolderGit2,
  Image as ImageIcon,
  Award,
  MessageSquare,
  Settings,
  Globe,
  LogOut,
  Menu,
  X,
  Shield,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export type AdminTab =
  | 'dashboard'
  | 'profile'
  | 'education'
  | 'skills'
  | 'projects'
  | 'gallery'
  | 'certificates'
  | 'messages'
  | 'settings';

interface AdminLayoutProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onViewWebsite: () => void;
  unreadCount?: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  onSelectTab,
  onViewWebsite,
  unreadCount = 0,
  children
}) => {
  const { user, logout } = useAuth();
  const { info } = useToast();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const menuItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Biodata & Profil', icon: User },
    { id: 'education', label: 'Riwayat Pendidikan', icon: GraduationCap },
    { id: 'skills', label: 'Skills & Keahlian', icon: Code2 },
    { id: 'projects', label: 'Karya / Projects', icon: FolderGit2 },
    { id: 'gallery', label: 'Galeri Foto', icon: ImageIcon },
    { id: 'certificates', label: 'Sertifikat', icon: Award },
    { id: 'messages', label: 'Pesan Masuk', icon: MessageSquare, badge: unreadCount },
    { id: 'settings', label: 'Pengaturan Web', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    info('Anda telah keluar dari sesi Admin.');
  };

  const handleSelectTab = (tab: AdminTab) => {
    onSelectTab(tab);
    setIsMobileDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-100 flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-[#0A0E17] border-r border-white/5 p-5 shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto">
        {/* Brand */}
        <div className="flex items-center gap-3 pb-6 border-b border-white/5">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-b from-[#0F172A] to-[#05070A] border border-cyan-500/40 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-950/50">
            <div className="w-full h-full rounded-[9px] bg-[#0A0E17] flex items-center justify-center relative overflow-hidden">
              <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6 8C6 6.89543 6.89543 6 8 6H16C19.3137 6 22 8.68629 22 12C22 14.8638 19.9922 17.2588 17.2996 17.8485L23 26H18.2L13 18.5H10V26H6V8ZM10 10V14.5H15.5C16.8807 14.5 18 13.3807 18 12C18 10.6193 16.8807 9.5 15.5 9.5H10V10Z"
                  fill="currentColor"
                />
                <circle cx="24" cy="9" r="2.5" className="fill-cyan-400" />
              </svg>
            </div>
          </div>
          <div className="min-w-0">
            <h1 className="font-black text-sm text-white tracking-tight truncate">RIZKI<span className="text-cyan-400 font-light ml-1">PAUZI</span></h1>
            <span className="text-[10px] text-cyan-400 font-semibold tracking-widest uppercase">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="my-6 flex-1 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-[#05070A] font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#05070A]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-[#05070A] text-cyan-400' : 'bg-rose-500 text-white animate-pulse'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-white/5 space-y-2">
          <button
            onClick={onViewWebsite}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition-colors cursor-pointer"
          >
            <Globe className="w-4 h-4" />
            <span>Lihat Website Publik</span>
          </button>

          <div className="p-3 rounded-xl bg-[#05070A] border border-white/5 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-[#0A0E17] border-b border-white/5 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-[#05070A] font-bold text-sm">
            RP
          </div>
          <div>
            <span className="font-bold text-sm text-white">Rizki Pauzi CMS</span>
            <span className="text-[10px] text-cyan-400 font-semibold block uppercase tracking-widest">Admin</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onViewWebsite}
            className="p-2 rounded-xl bg-[#0F172A] text-cyan-400 hover:bg-[#1E293B] border border-white/10"
            title="Lihat Website"
          >
            <Globe className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
            className="p-2 rounded-xl bg-[#0F172A] text-slate-300 border border-white/10"
          >
            {isMobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-40 bg-[#05070A]/95 backdrop-blur-xl lg:hidden flex flex-col p-6 overflow-y-auto">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <span className="font-bold text-base text-white">Menu Administrator</span>
            <button
              onClick={() => setIsMobileDrawerOpen(false)}
              className="p-2 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="my-6 space-y-2 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500 text-[#05070A] font-bold'
                      : 'text-slate-300 hover:bg-[#0F172A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={onViewWebsite}
              className="w-full py-3 rounded-xl text-sm font-bold text-center bg-cyan-500 text-[#05070A] cursor-pointer"
            >
              Lihat Website Publik
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-center bg-[#0F172A] text-rose-400 border border-white/10 cursor-pointer"
            >
              Logout Admin
            </button>
          </div>
        </div>
      )}

      {/* Main Content View Container */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl">
        {children}
      </main>
    </div>
  );
};

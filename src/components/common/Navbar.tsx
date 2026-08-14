import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Shield, UserCheck, Sparkles, ArrowRight, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
  onOpenAdmin?: () => void;
  onNavigateToAdmin?: () => void;
  onOpenExportModal?: () => void;
  siteTitle?: string;
  showAdminButton?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection = 'hero',
  onNavigate,
  onOpenAdmin,
  onNavigateToAdmin,
  onOpenExportModal,
  siteTitle = 'Rizki Pauzi',
  showAdminButton = true
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const handleOpenAdmin = () => {
    if (onOpenAdmin) {
      onOpenAdmin();
    } else if (onNavigateToAdmin) {
      onNavigateToAdmin();
    } else {
      window.location.hash = 'admin';
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'download', label: 'Download CV' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleItemClick = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0A0E17]/80 backdrop-blur-md border-b border-white/5 shadow-2xl py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => handleItemClick('hero')}
            className="flex items-center gap-3 group focus:outline-none cursor-pointer select-none"
            aria-label="Kembali ke atas"
          >
            {/* Cool Geometric Logo Icon */}
            <div className="relative">
              {/* Ambient Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur-sm opacity-60 group-hover:opacity-100 group-hover:blur transition-all duration-300" />
              
              {/* Main Badge */}
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-b from-[#0F172A] to-[#05070A] border border-cyan-500/40 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-950/50 group-hover:border-cyan-400 transition-all duration-300">
                {/* Internal High-tech Frame */}
                <div className="w-full h-full rounded-[9px] bg-[#0A0E17] flex items-center justify-center relative overflow-hidden">
                  {/* Subtle Grid / Scanline backdrop */}
                  <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:6px_6px] opacity-25" />
                  
                  {/* Stylized Vector Monogram */}
                  <svg className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M6 8C6 6.89543 6.89543 6 8 6H16C19.3137 6 22 8.68629 22 12C22 14.8638 19.9922 17.2588 17.2996 17.8485L23 26H18.2L13 18.5H10V26H6V8ZM10 10V14.5H15.5C16.8807 14.5 18 13.3807 18 12C18 10.6193 16.8807 9.5 15.5 9.5H10V10Z"
                      fill="currentColor"
                    />
                    <circle cx="24" cy="9" r="2.5" className="fill-cyan-400 animate-pulse" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Typography Wordmark */}
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  RIZKI<span className="text-cyan-400 font-light ml-1">PAUZI</span>
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400 group-hover:scale-125 transition-transform" />
              </div>
              <div className="flex items-center gap-1.5 -mt-0.5">
                <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  Digital Portfolio
                </span>
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 bg-[#0F172A]/70 px-5 py-2 rounded-full border border-white/5 backdrop-blur-md">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`relative text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'text-cyan-400 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-400 rounded-full shadow-sm shadow-cyan-400/50"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Download, Admin & Connect button */}
          <div className="hidden sm:flex items-center gap-2.5">
            {onOpenExportModal && (
              <button
                onClick={onOpenExportModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-full transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                title="Unduh Portofolio dalam format PDF atau Gambar"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Portofolio</span>
              </button>
            )}

            {showAdminButton && (
              <button
                onClick={handleOpenAdmin}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium border border-white/10 rounded-full hover:bg-white/5 transition-all cursor-pointer ${
                  isAuthenticated
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isAuthenticated ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Dashboard</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => handleItemClick('contact')}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-[#05070A] bg-cyan-500 hover:bg-cyan-400 rounded-full transition-all shadow-md shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Connect</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            {showAdminButton && (
              <button
                onClick={handleOpenAdmin}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-cyan-400 cursor-pointer"
                aria-label="Admin Portal"
              >
                <Shield className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[65px] z-30 bg-[#0A0E17]/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl p-5 lg:hidden max-h-[85vh] overflow-y-auto"
          >
            <div className="flex flex-col gap-1.5">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
                  </button>
                );
              })}

              <div className="pt-4 mt-2 border-t border-white/5 flex flex-col gap-2">
                {onOpenExportModal && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenExportModal();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 cursor-pointer transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Portofolio (PDF / Gambar)</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    handleItemClick('contact');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-[#05070A] bg-cyan-500 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <span>Let's Connect</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleOpenAdmin();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium text-slate-400 bg-white/5 border border-white/10 hover:text-white cursor-pointer"
                >
                  <Shield className="w-4 h-4" />
                  <span>{isAuthenticated ? 'Buka Dashboard Admin' : 'Admin Login'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

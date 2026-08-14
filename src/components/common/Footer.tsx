import React from 'react';
import { ArrowUp, Github, Linkedin, Instagram, Mail, Globe, Shield } from 'lucide-react';
import type { UserProfile, SiteSettings } from '../../types/index';

interface FooterProps {
  profile: UserProfile;
  settings: SiteSettings;
  onNavigate?: (sectionId: string) => void;
  onOpenAdmin?: () => void;
  onNavigateToAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  profile,
  settings,
  onNavigate,
  onOpenAdmin,
  onNavigateToAdmin
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollTo = (sectionId: string) => {
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleOpenAdmin = () => {
    if (onOpenAdmin) {
      onOpenAdmin();
    } else if (onNavigateToAdmin) {
      onNavigateToAdmin();
    } else {
      window.location.hash = 'admin';
    }
  };

  const currentYear = 2026;

  return (
    <footer className="relative bg-[#05070A] border-t border-white/5 pt-16 pb-12 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/5">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-b from-[#0F172A] to-[#05070A] border border-cyan-500/40 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-950/50">
                <div className="w-full h-full rounded-[8px] bg-[#0A0E17] flex items-center justify-center relative overflow-hidden">
                  <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M6 8C6 6.89543 6.89543 6 8 6H16C19.3137 6 22 8.68629 22 12C22 14.8638 19.9922 17.2588 17.2996 17.8485L23 26H18.2L13 18.5H10V26H6V8ZM10 10V14.5H15.5C16.8807 14.5 18 13.3807 18 12C18 10.6193 16.8807 9.5 15.5 9.5H10V10Z"
                      fill="currentColor"
                    />
                    <circle cx="24" cy="9" r="2.5" className="fill-cyan-400" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg text-white tracking-tight">
                  RIZKI<span className="text-cyan-400 font-light ml-1">PAUZI</span>
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed font-light">
              {profile.headline || 'Personal Portfolio & Digital Journey'}. Mendokumentasikan perjalanan akademis di Universitas Pendidikan Indonesia (UPI) dan eksplorasi karya digital.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{profile.educationStatusSummary || 'Universitas Pendidikan Indonesia (UPI)'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Navigasi</h4>
            <ul className="space-y-2 text-sm text-slate-400 font-light">
              <li>
                <button onClick={() => handleScrollTo('hero')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleScrollTo('about')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  About Me
                </button>
              </li>
              <li>
                <button onClick={() => handleScrollTo('education')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  Education Journey
                </button>
              </li>
              <li>
                <button onClick={() => handleScrollTo('skills')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  Skills
                </button>
              </li>
              <li>
                <button onClick={() => handleScrollTo('projects')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  Featured Projects
                </button>
              </li>
              <li>
                <button onClick={() => handleScrollTo('contact')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Connect / Socials */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sosial & Kontak</h4>
            <div className="flex flex-wrap gap-2.5">
              {profile.github && (
                <a
                  href={profile.github.startsWith('http') ? profile.github : `https://${profile.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#0F172A] border border-white/10 text-slate-400 hover:text-white hover:border-cyan-500/30 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#0F172A] border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile.instagram && (
                <a
                  href={profile.instagram.startsWith('http') ? profile.instagram : `https://instagram.com/${profile.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#0F172A] border border-white/10 text-slate-400 hover:text-pink-400 hover:border-pink-500/30 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="p-2.5 rounded-xl bg-[#0F172A] border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
              {profile.website && (
                <a
                  href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#0F172A] border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
                  aria-label="Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
            <div className="pt-2">
              <button
                onClick={handleOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-medium text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Administrator CMS Login</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-light">
          <p>{settings.footerText || `© ${currentYear} Rizki Pauzi. All Rights Reserved.`}</p>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAdmin}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              CMS Portal
            </button>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <span>Kembali ke Atas</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

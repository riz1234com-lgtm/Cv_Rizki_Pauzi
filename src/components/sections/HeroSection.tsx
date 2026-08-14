import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Sparkles, FolderGit2, User, GraduationCap, ChevronDown, Download } from 'lucide-react';
import type { UserProfile, SiteSettings } from '../../types/index';
import { resolveImageUrl } from '../../lib/imageHelper';

interface HeroSectionProps {
  profile: UserProfile;
  settings: SiteSettings;
  onNavigate?: (sectionId: string) => void;
  onNavigateToAdmin?: () => void;
  onOpenExportModal?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile, settings, onNavigate, onNavigateToAdmin, onOpenExportModal }) => {
  const [imageError, setImageError] = useState(false);
  const avatarSrc = resolveImageUrl(profile.avatarUrl);
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
  return (
    <section id="hero" className="relative flex items-center justify-center pt-24 pb-10 sm:pt-28 sm:pb-12 overflow-hidden bg-[#05070A]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/10 via-sky-600/5 to-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/5 blur-[110px] rounded-full pointer-events-none" />

      {/* Subtle particle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Column: Greeting & Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Greeting pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>{settings.heroGreeting || "Hello, I'm"}</span>
            </div>

            {/* Big Name */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-3">
              {settings.heroName || profile.name || 'Rizki Pauzi'}
            </h1>

            {/* Editable Headline */}
            <div className="relative mb-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">
                {settings.heroHeadline || profile.headline || 'Personal Portfolio & Digital Journey'}
              </h2>
            </div>

            {/* Short Description */}
            <p className="text-base sm:text-lg text-slate-400 max-w-xl font-light leading-relaxed mb-6">
              {settings.heroDescription ||
                profile.bio ||
                'Mendokumentasikan perjalanan akademis di Universitas Pendidikan Indonesia (UPI) dan dedikasi dalam eksplorasi teknologi & kreativitas.'}
            </p>

            {/* Call to action buttons */}
            <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
              <button
                onClick={() => handleScrollTo('projects')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold text-[#05070A] bg-cyan-500 hover:bg-cyan-400 transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <FolderGit2 className="w-4 h-4" />
                <span>Lihat Portfolio</span>
              </button>

              <button
                onClick={() => handleScrollTo('about')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 backdrop-blur-md cursor-pointer"
              >
                <User className="w-4 h-4 text-cyan-400" />
                <span>Tentang Saya</span>
              </button>

              {onOpenExportModal && (
                <button
                  onClick={onOpenExportModal}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all duration-300 backdrop-blur-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Unduh Portofolio</span>
                </button>
              )}
            </div>

            {/* Live Education Quick Tag */}
            <div className="mt-6 flex items-center gap-3 text-xs text-slate-400 bg-[#0F172A]/70 px-4 py-2 rounded-xl border border-white/5">
              <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Status: <strong className="text-slate-200">{profile.educationStatusSummary || 'Universitas Pendidikan Indonesia (UPI)'}</strong>
              </span>
            </div>
          </motion.div>

          {/* Right Column: Hero Profile Photo / Visual Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center lg:justify-end relative"
          >
            <div className="relative group">
              {/* Circular Glow behind photo */}
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl opacity-20 blur-2xl group-hover:opacity-40 transition duration-700 animate-subtle-glow" />

              {/* Card container */}
              <div className="relative w-72 sm:w-80 md:w-96 aspect-square rounded-3xl p-3 bg-[#0F172A] border border-white/10 shadow-2xl overflow-hidden group-hover:border-cyan-500/30 transition-colors duration-500">
                {avatarSrc && !imageError ? (
                  <img
                    src={avatarSrc}
                    alt={profile.name || 'Rizki Pauzi'}
                    className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  /* Elegant Modern Placeholder with Initials & Tech Rings */
                  <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#0A0E17] to-[#05070A] flex flex-col items-center justify-center p-6 border border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(6,182,212,0.12),transparent_70%)]" />

                    {/* Animated ring graphics */}
                    <div className="relative w-36 h-36 rounded-full border border-dashed border-cyan-500/30 flex items-center justify-center animate-[spin_30s_linear_infinite]">
                      <div className="w-28 h-28 rounded-full border border-sky-400/20 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                          <span className="text-3xl font-extrabold text-white">RP</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 text-center relative z-10">
                      <span className="text-sm font-bold text-white tracking-wide">{profile.name || 'Rizki Pauzi'}</span>
                      <p className="text-xs text-slate-400 mt-1">Universitas Pendidikan Indonesia</p>
                    </div>

                    <div className="mt-3 px-3 py-1 rounded-full text-[10px] font-semibold bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                      Foto dapat diatur di CMS Admin
                    </div>
                  </div>
                )}

                {/* Floating subtle badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#0A0E17]/90 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-xl">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">Pendidikan Terkini</p>
                    <p className="text-[11px] text-slate-400 truncate">Universitas Pendidikan Indonesia (UPI)</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator at the bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-8 sm:mt-10 flex flex-col items-center justify-center"
        >
          <button
            onClick={() => handleScrollTo('about')}
            className="flex flex-col items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors group cursor-pointer"
            aria-label="Scroll ke bagian About"
          >
            <span className="tracking-widest uppercase text-[10px]">Scroll Down</span>
            <div className="w-5 h-8 rounded-full border border-white/20 group-hover:border-cyan-400 flex items-start justify-center p-1 transition-colors">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1 h-1 rounded-full bg-cyan-400"
              />
            </div>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

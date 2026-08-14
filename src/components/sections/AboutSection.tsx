import React from 'react';
import { motion } from 'motion/react';
import { SectionHeader } from '../common/SectionHeader';
import { User, GraduationCap, MapPin, Sparkles, BookOpen, Code2, Award, FolderGit2 } from 'lucide-react';
import type { UserProfile, EducationItem, SkillItem, ProjectItem, CertificateItem } from '../../types/index';

interface AboutSectionProps {
  profile: UserProfile;
  educationList: EducationItem[];
  skillsList: SkillItem[];
  projectsList: ProjectItem[];
  certificatesList: CertificateItem[];
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  profile,
  educationList,
  skillsList,
  projectsList,
  certificatesList
}) => {
  const stats = [
    {
      label: 'Jenjang Pendidikan',
      value: educationList.length,
      icon: GraduationCap,
      color: 'from-cyan-500 to-sky-500',
      badge: 'Verified Track'
    },
    {
      label: 'Keahlian & Skills',
      value: skillsList.length > 0 ? skillsList.length : '0 (Proses)',
      icon: Code2,
      color: 'from-sky-500 to-blue-500',
      badge: 'Dynamic'
    },
    {
      label: 'Project & Karya',
      value: projectsList.length > 0 ? projectsList.length : '0 (Proses)',
      icon: FolderGit2,
      color: 'from-indigo-500 to-violet-500',
      badge: 'Showcase'
    },
    {
      label: 'Sertifikasi',
      value: certificatesList.length > 0 ? certificatesList.length : '0 (Proses)',
      icon: Award,
      color: 'from-purple-500 to-pink-500',
      badge: 'Achievement'
    }
  ];

  return (
    <section id="about" className="py-14 sm:py-16 relative bg-[#05070A] border-t border-white/5 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Tentang Saya"
          title="About Me & Background"
          subtitle="Mengenal lebih dekat profil, dedikasi akademis, dan perjalanan Rizki Pauzi."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Academic Profile & Key Details (Clean layout without duplicate photo) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col justify-between gap-4"
          >
            {/* Academic Identity Card */}
            <div className="rounded-3xl p-6 sm:p-7 bg-[#0F172A] border border-white/10 shadow-xl relative overflow-hidden flex flex-col justify-between flex-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    {profile.availableForWork ? 'Active & Open' : 'In Study'}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">{profile.name || 'Rizki Pauzi'}</h3>
                  <p className="text-sm text-cyan-400 font-medium mt-0.5">
                    {profile.educationStatusSummary || 'Universitas Pendidikan Indonesia (UPI)'}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
                  Menempuh pendidikan tinggi di Universitas Pendidikan Indonesia (UPI) dengan komitmen belajar berkelanjutan dan eksplorasi dunia teknologi serta kreativitas digital.
                </p>
              </div>

              {/* Status Tags */}
              <div className="pt-6 mt-6 border-t border-white/5 grid grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate">{profile.location || 'Indonesia'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate">Akademisi UPI</span>
                </div>
              </div>
            </div>

            {/* Quick Track Highlight */}
            <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/5 flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white">Jejak Pendidikan Terverifikasi</h4>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">SDN Sukahati 2 → SMP Mekar Arum → SMK Medikacom → UPI</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Bio & Detailed Intro */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                Personal Introduction
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {profile.headline || 'Personal Portfolio & Digital Journey'}
              </h3>
            </div>

            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed font-light">
              <p>
                {profile.about ||
                  `Halo, saya Rizki Pauzi. Saat ini sedang menempuh pendidikan di Universitas Pendidikan Indonesia (UPI). Website ini dirancang untuk mendokumentasikan perjalanan akademis, keahlian, project, dan karya saya.`}
              </p>
              <p className="text-slate-400">
                {profile.bio ||
                  `Melalui komitmen belajar yang berkelanjutan dan dedikasi terhadap perkembangan teknologi serta keahlian kreatif, saya terus memperluas wawasan akademis dan praktis.`}
              </p>
            </div>

            {/* Metric / Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-4">
              {stats.map((st, idx) => {
                const Icon = st.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#0F172A] border border-white/5 flex flex-col items-start hover:border-cyan-500/30 transition-colors"
                  >
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xl font-extrabold text-white">{st.value}</span>
                    <span className="text-xs text-slate-400 mt-0.5 leading-tight">{st.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

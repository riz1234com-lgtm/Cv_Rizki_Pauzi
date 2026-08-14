import React from 'react';
import { motion } from 'motion/react';
import { SectionHeader } from '../common/SectionHeader';
import { GraduationCap, CheckCircle2, Clock, Calendar, Building2, ArrowRight } from 'lucide-react';
import type { EducationItem } from '../../types/index';

interface EducationSectionProps {
  educationList: EducationItem[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({ educationList }) => {
  return (
    <section id="education" className="py-24 relative bg-[#05070A] border-t border-white/5 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-500/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Riwayat Akademis"
          title="My Education Journey"
          subtitle="Jejak langkah pendidikan resmi Rizki Pauzi dari tingkat dasar hingga perguruan tinggi."
        />

        {/* Desktop Horizontal Timeline / Grid View */}
        <div className="hidden lg:block relative mt-16 mb-8">
          {/* Connecting Line */}
          <div className="absolute top-12 left-12 right-12 h-0.5 bg-gradient-to-r from-cyan-500/40 via-blue-500/30 to-indigo-500/30 rounded-full" />

          <div className="grid grid-cols-4 gap-6 relative z-10">
            {educationList.map((edu, idx) => {
              const isProgress = edu.status === 'In Progress';
              return (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Timeline Node Circle */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-xl transition-all duration-300 border ${
                      isProgress
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-cyan-400/50 shadow-cyan-500/25 scale-110'
                        : 'bg-[#0F172A] text-slate-400 border-white/10 group-hover:border-cyan-500/30 group-hover:text-cyan-400'
                    }`}
                  >
                    {isProgress ? (
                      <Clock className="w-5 h-5 animate-pulse" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>

                  {/* Card content */}
                  <div
                    className={`w-full p-6 rounded-2xl bg-[#0F172A] border transition-all duration-300 flex flex-col h-full ${
                      isProgress
                        ? 'border-cyan-500/30 shadow-xl shadow-cyan-500/10'
                        : 'border-white/5 hover:border-white/15'
                    }`}
                  >
                    {/* Status Badge */}
                    <div className="mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          isProgress
                            ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {isProgress ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                            In Progress
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Selesai
                          </>
                        )}
                      </span>
                    </div>

                    {/* Level Label */}
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">
                      {edu.level || 'Pendidikan'}
                    </span>

                    {/* Institution Name */}
                    <h3 className="text-base font-bold text-white line-clamp-2 min-h-[44px]">
                      {edu.institution}
                    </h3>

                    {/* Year Range */}
                    <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>
                        {edu.startYear && edu.startYear !== 'Belum diatur' ? edu.startYear : 'Tahun Masuk'} —{' '}
                        {edu.endYear && edu.endYear !== 'Belum diatur' ? edu.endYear : (isProgress ? 'Sekarang' : 'Tahun Lulus')}
                      </span>
                    </div>

                    {/* Description */}
                    {edu.description && (
                      <p className="mt-4 text-xs text-slate-400 leading-relaxed text-left border-t border-white/5 pt-3 flex-1 font-light">
                        {edu.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile / Tablet Vertical Timeline */}
        <div className="block lg:hidden relative pl-8 border-l border-white/10 space-y-6 mt-10">
          {educationList.map((edu, idx) => {
            const isProgress = edu.status === 'In Progress';
            return (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative"
              >
                {/* Node Dot */}
                <div
                  className={`absolute -left-[45px] top-1.5 w-8 h-8 rounded-xl flex items-center justify-center border ${
                    isProgress
                      ? 'bg-cyan-600 text-white border-cyan-400'
                      : 'bg-[#0F172A] text-emerald-400 border-white/10'
                  }`}
                >
                  {isProgress ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                </div>

                {/* Vertical Card */}
                <div
                  className={`p-5 rounded-2xl bg-[#0F172A] border ${
                    isProgress ? 'border-cyan-500/30' : 'border-white/5'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                      {edu.level}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        isProgress
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      }`}
                    >
                      {isProgress ? 'In Progress' : 'Completed'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{edu.institution}</h3>

                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>
                      {edu.startYear} — {edu.endYear}
                    </span>
                  </div>

                  {edu.description && (
                    <p className="mt-3 text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-2.5 font-light">
                      {edu.description}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

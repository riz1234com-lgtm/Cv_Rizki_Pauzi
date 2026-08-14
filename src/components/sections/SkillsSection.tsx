import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { SectionHeader } from '../common/SectionHeader';
import {
  Code,
  Globe,
  Layout,
  Terminal,
  Database,
  Cpu,
  Layers,
  Sparkles,
  Palette,
  Server,
  FileCode,
  Wrench
} from 'lucide-react';
import type { SkillItem } from '../../types/index';

interface SkillsSectionProps {
  skillsList: SkillItem[];
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Code,
  Globe,
  Layout,
  Terminal,
  Database,
  Cpu,
  Layers,
  Palette,
  Server,
  FileCode,
  Wrench
};

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skillsList }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    skillsList.forEach((s) => {
      if (s.category) cats.add(s.category);
    });
    return ['All', ...Array.from(cats)];
  }, [skillsList]);

  const filteredSkills = useMemo(() => {
    if (activeCategory === 'All') return skillsList;
    return skillsList.filter((s) => s.category === activeCategory);
  }, [skillsList, activeCategory]);

  return (
    <section id="skills" className="py-24 relative bg-[#05070A] border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Kompetensi"
          title="My Skills & Expertise"
          subtitle="Keahlian teknis dan kompetensi digital yang dikembangkan secara bertahap."
        />

        {skillsList.length === 0 ? (
          /* Elegant Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto p-8 rounded-3xl bg-[#0F172A] border border-white/10 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Skills information will be updated soon</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed font-light">
              Daftar keahlian teknis dan spesialisasi keahlian dapat dikonfigurasi secara dinamis melalui Administrator CMS.
            </p>
          </motion.div>
        ) : (
          <>
            {/* Category Filter Tabs */}
            {categories.length > 2 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-cyan-500 text-[#05070A] font-bold shadow-md shadow-cyan-500/20'
                        : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map((skill, idx) => {
                const IconComponent = ICON_MAP[skill.icon] || Code;
                return (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="p-6 rounded-2xl bg-[#0F172A] border border-white/5 hover:border-cyan-500/30 transition-all duration-300 group hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-slate-300 border border-white/10">
                        {skill.levelLabel || 'Intermediate'}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {skill.name}
                    </h4>

                    {skill.category && (
                      <span className="text-xs text-slate-400 block mt-0.5">{skill.category}</span>
                    )}

                    {skill.description && (
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 font-light">{skill.description}</p>
                    )}

                    {/* Progress indicator */}
                    <div className="mt-4 pt-3 border-t border-white/5">
                      <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                        <span className="text-slate-400">Proficiency</span>
                        <span className="text-cyan-400 font-mono-code">{skill.proficiency}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#05070A] rounded-full overflow-hidden border border-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

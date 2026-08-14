import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { SectionHeader } from '../common/SectionHeader';
import { ExternalLink, Github, FolderGit2, Star, Sparkles, Layers } from 'lucide-react';
import type { ProjectItem } from '../../types/index';

interface ProjectsSectionProps {
  projectsList: ProjectItem[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projectsList }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    projectsList.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return ['All', ...Array.from(cats)];
  }, [projectsList]);

  const filteredProjects = useMemo(() => {
    const visible = projectsList.filter((p) => p.isPublished !== false);
    if (activeCategory === 'All') return visible;
    return visible.filter((p) => p.category === activeCategory);
  }, [projectsList, activeCategory]);

  return (
    <section id="projects" className="py-24 relative bg-[#05070A] border-t border-white/5 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-cyan-600/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Karya & Inovasi"
          title="Featured Projects"
          subtitle="Koleksi karya teknologi, perancangan aplikasi, dan inovasi yang telah dirintis."
        />

        {projectsList.length === 0 ? (
          /* Elegant Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-lg mx-auto p-8 sm:p-10 rounded-3xl bg-[#0F172A] border border-white/10 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center mb-4">
              <FolderGit2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Project portfolio will be added soon</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed font-light">
              Dokumentasi proyek, source code, dan tautan demo interaktif dapat ditambahkan dan dipublikasikan kapan saja melalui Administrator Dashboard.
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

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="rounded-3xl bg-[#0F172A] border border-white/5 hover:border-cyan-500/30 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-cyan-500/10 group"
                >
                  {/* Thumbnail */}
                  <div className="aspect-video relative overflow-hidden bg-[#05070A]">
                    {project.thumbnailUrl ? (
                      <img
                        src={project.thumbnailUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#0F172A] via-[#0A0E17] to-[#05070A]">
                        <FolderGit2 className="w-10 h-10 text-cyan-400/60 mb-2" />
                        <span className="text-xs text-slate-400 font-medium">{project.title}</span>
                      </div>
                    )}

                    {/* Featured Tag */}
                    {project.featured && (
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                        <Star className="w-3 h-3 fill-amber-300" />
                        <span>Featured</span>
                      </div>
                    )}

                    {/* Category badge */}
                    <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#0A0E17]/90 text-cyan-400 border border-white/10 backdrop-blur-md">
                      {project.category}
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {project.title}
                    </h3>

                    <p className="mt-2.5 text-xs text-slate-400 leading-relaxed line-clamp-3 flex-1 font-light">
                      {project.description}
                    </p>

                    {/* Tech Badges */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.technologies.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono-code bg-white/5 text-slate-300 border border-white/10"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Links */}
                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl.startsWith('http') ? project.githubUrl : `https://${project.githubUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                            title="Tautan GitHub"
                            aria-label="GitHub Project"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl.startsWith('http') ? project.demoUrl : `https://${project.demoUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#05070A] bg-cyan-500 hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
                          >
                            <span>Live Demo</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      {!project.demoUrl && !project.githubUrl && (
                        <span className="text-[11px] text-slate-500 italic">Dokumentasi Internal</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

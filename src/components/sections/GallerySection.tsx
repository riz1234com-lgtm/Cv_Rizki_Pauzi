import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { SectionHeader } from '../common/SectionHeader';
import { LightboxModal } from '../common/LightboxModal';
import { Image as ImageIcon, ZoomIn, Sparkles } from 'lucide-react';
import type { GalleryItem } from '../../types/index';

interface GallerySectionProps {
  galleryList: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ galleryList }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    galleryList.forEach((g) => {
      if (g.category) cats.add(g.category);
    });
    return ['All', ...Array.from(cats)];
  }, [galleryList]);

  const filteredGallery = useMemo(() => {
    const visible = galleryList.filter((g) => g.isPublished !== false);
    if (activeCategory === 'All') return visible;
    return visible.filter((g) => g.category === activeCategory);
  }, [galleryList, activeCategory]);

  return (
    <section id="gallery" className="py-24 relative bg-[#05070A] border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Dokumentasi Visual"
          title="Gallery & Activities"
          subtitle="Koleksi dokumentasi kegiatan, momen penting, dan visualisasi aktivitas."
        />

        {galleryList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto p-8 rounded-3xl bg-[#0F172A] border border-white/10 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center mb-4">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No gallery items yet</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed font-light">
              Dokumentasi foto, sertifikat, dan foto kegiatan dapat diunggah dengan mudah melalui halaman Administrator.
            </p>
          </motion.div>
        ) : (
          <>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredGallery.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  onClick={() => setSelectedItem(item)}
                  className="group relative rounded-2xl overflow-hidden bg-[#0F172A] border border-white/5 hover:border-cyan-500/40 cursor-pointer shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-square overflow-hidden bg-[#05070A]">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] via-[#05070A]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                    <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-widest">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5 line-clamp-1">{item.title}</h4>
                    {item.caption && <p className="text-xs text-slate-300 mt-1 line-clamp-2 font-light">{item.caption}</p>}
                    <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-300">
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Lihat Preview</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <LightboxModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          imageUrl={selectedItem.imageUrl}
          title={selectedItem.title}
          caption={selectedItem.caption}
          category={selectedItem.category}
        />
      )}
    </section>
  );
};

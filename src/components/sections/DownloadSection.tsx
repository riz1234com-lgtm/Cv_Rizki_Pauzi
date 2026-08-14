import React from 'react';
import { motion } from 'motion/react';
import { Download, FileText, Image as ImageIcon, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import type { UserProfile } from '../../types/index';

interface DownloadSectionProps {
  profile: UserProfile;
  onOpenExportModal: () => void;
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({ profile, onOpenExportModal }) => {
  return (
    <section id="download" className="py-16 sm:py-20 relative bg-[#05070A] border-t border-white/5 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Dokumen & Arsip Digital"
          title="Unduh Berkas Portofolio"
          subtitle="Dapatkan ringkasan riwayat akademis, proyek, sertifikasi, dan kompetensi dalam format dokumen resmi."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-gradient-to-b from-[#0F172A] to-[#0A0E17] border border-cyan-500/20 p-6 sm:p-10 shadow-2xl relative overflow-hidden group"
        >
          {/* Subtle top cyan line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Format Siap Cetak & Bagikan</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Simpan & Bagikan Rekam Jejak Portofolio {profile.name || 'Rizki Pauzi'}
              </h3>

              <p className="text-sm sm:text-base text-slate-400 font-light leading-relaxed">
                Semua data portofolio yang terbarui secara dinamis (Pendidikan UPI, Proyek, Sertifikasi, Keahlian) dapat diekspor langsung dalam format PDF profesional atau Gambar grafis beresolusi tinggi (PNG/JPG).
              </p>

              {/* Feature bullet list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Tata letak standar A4 dokumen resmi</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Grafis tajam Retina (2x scale)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Pilihan tema Clean Print atau Cyber Dark</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Data terverifikasi & terstruktur</span>
                </div>
              </div>
            </div>

            {/* Right Action Box */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#070A10]/80 border border-white/10 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
                <Download className="w-7 h-7 animate-bounce" />
              </div>

              <div>
                <h4 className="text-base font-bold text-white">Buka Panel Unduhan</h4>
                <p className="text-xs text-slate-400 mt-1 font-light">
                  Pilih bagian data, sesuaikan gaya tema, dan simpan berkas dengan cepat.
                </p>
              </div>

              <div className="flex flex-col w-full gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onOpenExportModal}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-[#05070A] bg-cyan-500 hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Unduh Dokumen PDF / CV</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  type="button"
                  onClick={onOpenExportModal}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-cyan-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  <span>Unduh Gambar Banner / Card (PNG & JPG)</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

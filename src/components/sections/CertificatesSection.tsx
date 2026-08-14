import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SectionHeader } from '../common/SectionHeader';
import { LightboxModal } from '../common/LightboxModal';
import { Award, ExternalLink, Calendar, Building, Sparkles, ZoomIn } from 'lucide-react';
import type { CertificateItem } from '../../types/index';

interface CertificatesSectionProps {
  certificatesList: CertificateItem[];
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({ certificatesList }) => {
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  return (
    <section id="certificates" className="py-24 relative bg-[#05070A] border-t border-white/5 overflow-hidden">
      {/* Background radial */}
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Pencapaian"
          title="Certificates & Achievements"
          subtitle="Sertifikasi kompetensi, pencapaian akademis, dan penghargaan profesional."
        />

        {certificatesList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto p-8 rounded-3xl bg-[#0F172A] border border-white/10 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center mb-4">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No certificates added yet</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed font-light">
              Sertifikat dan pencapaian akan ditampilkan di sini setelah ditambahkan melalui Administrator Dashboard.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificatesList.map((cert, idx) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-6 rounded-2xl bg-[#0F172A] border border-white/5 hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                      <Award className="w-6 h-6" />
                    </div>
                    {cert.year && cert.year !== 'Belum diatur' && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10">
                        <Calendar className="w-3 h-3 text-cyan-400" />
                        {cert.year}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {cert.title}
                  </h4>

                  {cert.institution && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 font-light">
                      <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{cert.institution}</span>
                    </div>
                  )}

                  {cert.credentialId && (
                    <p className="mt-2 text-[10px] text-slate-500 font-mono-code">
                      ID: <span className="text-slate-400">{cert.credentialId}</span>
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  {cert.imageUrl ? (
                    <button
                      onClick={() => setSelectedCert(cert)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Lihat Sertifikat</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500 italic">Terverifikasi</span>
                  )}

                  {cert.verificationUrl && (
                    <a
                      href={cert.verificationUrl.startsWith('http') ? cert.verificationUrl : `https://${cert.verificationUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <span>Verifikasi</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selectedCert && (
        <LightboxModal
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
          imageUrl={selectedCert.imageUrl || ''}
          title={selectedCert.title}
          caption={`${selectedCert.institution} (${selectedCert.year})`}
          externalUrl={selectedCert.verificationUrl}
        />
      )}
    </section>
  );
};

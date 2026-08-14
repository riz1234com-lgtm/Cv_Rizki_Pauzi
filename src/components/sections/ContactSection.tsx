import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SectionHeader } from '../common/SectionHeader';
import { Mail, Send, CheckCircle2, MessageSquare, Phone, Instagram, Linkedin, Github, Globe, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { sendContactMessageToFirestore } from '../../lib/firebaseSync';
import { useToast } from '../../context/ToastContext';
import type { UserProfile } from '../../types/index';

interface ContactSectionProps {
  profile: UserProfile;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      error('Mohon isi Nama, Email, dan Pesan.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      error('Format email tidak valid.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.sendMessage(formData);
      // Also back up to Cloud Firestore asynchronously
      sendContactMessageToFirestore(formData).catch((e) => {
        console.warn('Firestore message backup warning:', e);
      });
      setIsSuccess(true);
      success('Pesan Anda berhasil dikirim! Terima kasih.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSuccess(false), 6000);
    } catch (err: any) {
      error(err.message || 'Gagal mengirim pesan. Silakan coba kembali.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactItems = [
    {
      id: 'email',
      icon: Mail,
      label: 'Email',
      value: profile.email || 'Belum diatur oleh Admin',
      href: profile.email ? `mailto:${profile.email}` : undefined,
      color: 'text-cyan-400',
      active: !!profile.email
    },
    {
      id: 'whatsapp',
      icon: Phone,
      label: 'WhatsApp',
      value: profile.whatsapp || 'Belum diatur oleh Admin',
      href: profile.whatsapp ? `https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}` : undefined,
      color: 'text-emerald-400',
      active: !!profile.whatsapp
    },
    {
      id: 'linkedin',
      icon: Linkedin,
      label: 'LinkedIn',
      value: profile.linkedin ? 'Profil LinkedIn' : 'Belum diatur oleh Admin',
      href: profile.linkedin ? (profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`) : undefined,
      color: 'text-sky-400',
      active: !!profile.linkedin
    },
    {
      id: 'instagram',
      icon: Instagram,
      label: 'Instagram',
      value: profile.instagram ? `@${profile.instagram.replace('@', '')}` : 'Belum diatur oleh Admin',
      href: profile.instagram ? `https://instagram.com/${profile.instagram.replace('@', '')}` : undefined,
      color: 'text-pink-400',
      active: !!profile.instagram
    }
  ];

  return (
    <section id="contact" className="py-24 relative bg-[#05070A] border-t border-white/5 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-cyan-600/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Hubungi Saya"
          title="Let's Connect"
          subtitle="Kirimkan pesan, pertanyaan kolaborasi, atau sekadar bertegur sapa."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Contacts & Status */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="p-8 rounded-3xl bg-[#0F172A] border border-white/5">
              <h3 className="text-xl font-bold text-white mb-2">Informasi Kontak</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed font-light">
                Tersedia saluran komunikasi untuk keperluan diskusi akademis, project, maupun kemitraan profesional.
              </p>

              <div className="space-y-4">
                {contactItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#05070A] border border-white/5 hover:border-cyan-500/30 transition-colors group"
                    >
                      <div className={`p-2.5 rounded-xl bg-cyan-500/10 ${item.color} border border-cyan-500/20 shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          {item.label}
                        </span>
                        {item.href ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-xs sm:text-sm font-medium text-white hover:text-cyan-400 transition-colors truncate"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <span className="block text-xs sm:text-sm font-medium text-slate-500 truncate">
                            {item.value}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Availability Notice */}
            <div className="p-5 rounded-2xl bg-[#0F172A] border border-cyan-500/20 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
              <p className="text-xs text-slate-300 font-light">
                Pesan yang dikirimkan melalui form akan otomatis masuk ke inbox Administrator Rizki Pauzi.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Interactive Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="p-8 sm:p-10 rounded-3xl bg-[#0F172A] border border-white/5 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-2">Kirim Pesan Langsung</h3>
              <p className="text-xs text-slate-400 mb-8 font-light">
                Isi formulir berikut dan pesan Anda akan tersimpan dengan aman di database.
              </p>

              {isSuccess && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold">
                    Pesan Anda berhasil dikirimkan! Kami akan segera merespons.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-300 mb-2">
                      Nama Lengkap <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Masukkan nama Anda"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[#05070A] border border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-300 mb-2">
                      Alamat Email <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@contoh.com"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[#05070A] border border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-semibold text-slate-300 mb-2">
                    Subjek / Topik
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Contoh: Diskusi Project / Sapaan"
                    className="w-full px-4 py-3 rounded-xl bg-[#05070A] border border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-300 mb-2">
                    Isi Pesan <span className="text-cyan-400">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tuliskan pesan lengkap Anda di sini..."
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#05070A] border border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 outline-none transition-colors resize-none font-light"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-[#05070A] bg-cyan-500 hover:bg-cyan-400 transition-all duration-300 shadow-xl shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#05070A]/30 border-t-[#05070A] rounded-full animate-spin" />
                      <span>Mengirimkan Pesan...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Kirimkan Pesan</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

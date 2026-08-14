import React, { useState, useRef } from 'react';
import {
  User,
  Upload,
  Trash2,
  Save,
  CheckCircle2,
  Mail,
  Phone,
  Instagram,
  Linkedin,
  Github,
  Globe,
  MapPin,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ImageUploader } from '../common/ImageUploader';
import type { UserProfile } from '../../types/index';

interface AdminProfileProps {
  profile: UserProfile;
  onProfileUpdated: (updated: UserProfile) => void;
}

export const AdminProfile: React.FC<AdminProfileProps> = ({ profile, onProfileUpdated }) => {
  const { success, error } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size < 5MB
    if (file.size > 5 * 1024 * 1024) {
      error('Ukuran file maksimal 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const res = await api.uploadFile(file);
      setFormData((prev) => ({ ...prev, avatarUrl: res.url }));
      success('Foto profil berhasil diunggah! Jangan lupa klik Simpan Profil.');
    } catch (err: any) {
      error(err.message || 'Gagal mengunggah foto');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = () => {
    setFormData((prev) => ({ ...prev, avatarUrl: '' }));
    success('Foto profil dihapus.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await api.updateProfile(formData);
      onProfileUpdated(res.data);
      success('Profil berhasil diperbarui!');
    } catch (err: any) {
      error(err.message || 'Gagal memperbarui profil');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Biodata & Profil</h2>
          <p className="text-xs text-slate-400 mt-1">
            Ubah informasi personal, foto profil, headline, dan media sosial Anda.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-sky-500 hover:from-cyan-500 hover:to-sky-400 transition-all shadow-md shadow-cyan-600/20 disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSaving ? 'Menyimpan...' : 'Simpan Profil'}</span>
        </button>
      </div>

      {/* Avatar Management Card */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Foto Profil</h3>

        <div className="max-w-md">
          <ImageUploader
            label="Unggah Foto Profil"
            value={formData.avatarUrl || ''}
            onChange={(url) => setFormData((prev) => ({ ...prev, avatarUrl: url }))}
            aspectRatio="square"
            helperText="Format: JPG, PNG, WEBP. Mendukung Drag & Drop atau Klik untuk memilih file."
            placeholder="Atau tempel link URL foto..."
          />
        </div>
      </div>

      {/* Basic Profile Details */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Informasi Utama</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Rizki Pauzi"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Headline / Tagline</label>
            <input
              type="text"
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              placeholder="Personal Portfolio & Digital Journey"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Status Akademis Ringkas</label>
            <input
              type="text"
              name="educationStatusSummary"
              value={formData.educationStatusSummary}
              onChange={handleChange}
              placeholder="Mahasiswa Aktif @ Universitas Pendidikan Indonesia (UPI)"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Lokasi / Domisili</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Bandung, Indonesia"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Deskripsi Singkat (Hero)</label>
          <textarea
            name="bio"
            rows={2}
            value={formData.bio}
            onChange={handleChange}
            placeholder="Deskripsi singkat yang tampil di Hero section..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Tentang Saya (About Me Section)</label>
          <textarea
            name="about"
            rows={4}
            value={formData.about}
            onChange={handleChange}
            placeholder="Biografi lengkap, latar belakang, dan pengenalan diri..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none resize-none"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="availableForWork"
            name="availableForWork"
            checked={formData.availableForWork}
            onChange={handleChange}
            className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 bg-slate-950 border-slate-800 cursor-pointer"
          />
          <label htmlFor="availableForWork" className="text-xs text-slate-300 cursor-pointer select-none">
            Tampilkan status aktif / terbuka untuk diskusi kolaborasi
          </label>
        </div>
      </div>

      {/* Social Links & Contact Channels */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          Kontak & Media Sosial
        </h3>
        <p className="text-xs text-slate-400">
          Field yang dikosongkan akan disembunyikan atau menampilkan status placeholder di halaman publik.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>Email Publik</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@domain.com"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </label>
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="081234567890"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              <span>Instagram</span>
            </label>
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="username_instagram"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5 text-sky-400" />
              <span>LinkedIn</span>
            </label>
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5 text-slate-300" />
              <span>GitHub</span>
            </label>
            <input
              type="text"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Website Lain</span>
            </label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://mywebsite.com"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-600 via-sky-500 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 transition-all shadow-lg shadow-cyan-600/20 disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Menyimpan Perubahan...' : 'Simpan Seluruh Perubahan'}</span>
        </button>
      </div>
    </form>
  );
};

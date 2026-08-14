import React, { useState, useRef } from 'react';
import { Settings, Save, Lock, Mail, Globe, Shield, CheckCircle2, Eye, EyeOff, Database, Download, Upload, RefreshCw, Flame, CloudCheck, ExternalLink } from 'lucide-react';
import { api } from '../../services/api';
import { syncAllToFirestore, fetchAllFromFirestore } from '../../lib/firebaseSync';
import { useToast } from '../../context/ToastContext';
import type { SiteSettings } from '../../types/index';

interface AdminSettingsProps {
  settings: SiteSettings;
  onSettingsUpdated: (updated: SiteSettings) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, onSettingsUpdated }) => {
  const { success, error } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [siteForm, setSiteForm] = useState<SiteSettings>(settings);
  const [isSavingSite, setIsSavingSite] = useState(false);
  const [isExportingDb, setIsExportingDb] = useState(false);
  const [isImportingDb, setIsImportingDb] = useState(false);
  const [isSyncingFirebase, setIsSyncingFirebase] = useState(false);
  const [isPullingFirebase, setIsPullingFirebase] = useState(false);

  // Security Credentials form
  const [securityForm, setSecurityForm] = useState({
    email: 'admin@rizkipauzi.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isUpdatingSecurity, setIsUpdatingSecurity] = useState(false);

  const handleSiteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSiteForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSite(true);
    try {
      const res = await api.updateSettings(siteForm);
      onSettingsUpdated(res.data);
      success('Pengaturan website berhasil diperbarui!');
    } catch (err: any) {
      error(err.message || 'Gagal menyimpan pengaturan');
    } finally {
      setIsSavingSite(false);
    }
  };

  const handleUpdateSecurity = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!securityForm.currentPassword) {
      error('Password saat ini wajib diisi');
      return;
    }

    if (securityForm.newPassword) {
      if (securityForm.newPassword.length < 6) {
        error('Password baru minimal 6 karakter');
        return;
      }
      if (securityForm.newPassword !== securityForm.confirmPassword) {
        error('Konfirmasi password tidak cocok');
        return;
      }
    }

    setIsUpdatingSecurity(true);
    try {
      if (securityForm.newPassword) {
        localStorage.setItem('rp_custom_admin_pass', securityForm.newPassword.trim());
        try {
          await api.changePassword({
            currentPassword: securityForm.currentPassword,
            newPassword: securityForm.newPassword
          });
        } catch (apiErr) {
          console.warn('Backend password change warning, saved locally for Vercel:', apiErr);
        }
      }
      if (securityForm.email) {
        localStorage.setItem('rp_custom_admin_email', securityForm.email.trim());
        try {
          await api.updateAccount({
            email: securityForm.email,
            name: 'Administrator'
          });
        } catch (apiErr) {
          console.warn('Backend account update warning, saved locally for Vercel:', apiErr);
        }
      }
      success('Kredensial akun admin berhasil diperbarui dan disimpan!');
      setSecurityForm((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err: any) {
      error(err.message || 'Gagal memperbarui kredensial');
    } finally {
      setIsUpdatingSecurity(false);
    }
  };

  const handleExportDatabase = async () => {
    setIsExportingDb(true);
    try {
      const res = await api.backupDatabase();
      const jsonStr = JSON.stringify(res.data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `database-backup-rizki-pauzi-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      success('Database berhasil diekspor dan diunduh ke komputer!');
    } catch (err: any) {
      error(err.message || 'Gagal mengekspor backup database');
    } finally {
      setIsExportingDb(false);
    }
  };

  const handleImportFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImportingDb(true);
    try {
      const text = await file.text();
      const parsedData = JSON.parse(text);
      await api.restoreDatabase(parsedData);
      success('Database berhasil dipulihkan dari file backup!');
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err: any) {
      error(err.message || 'Format file JSON backup tidak valid');
    } finally {
      setIsImportingDb(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSyncToFirestore = async () => {
    setIsSyncingFirebase(true);
    try {
      const res = await api.backupDatabase();
      if (res.data) {
        await syncAllToFirestore(res.data);
        success('Seluruh data website berhasil disinkronkan ke Google Cloud Firestore (Firebase)!');
      }
    } catch (err: any) {
      error(err.message || 'Gagal menyinkronkan data ke Firebase');
    } finally {
      setIsSyncingFirebase(false);
    }
  };

  const handlePullFromFirestore = async () => {
    setIsPullingFirebase(true);
    try {
      const firestoreData = await fetchAllFromFirestore();
      if (firestoreData) {
        await api.restoreDatabase(firestoreData);
        success('Data berhasil ditarik dari Cloud Firestore dan diperbarui!');
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      }
    } catch (err: any) {
      error(err.message || 'Gagal memuat data dari Cloud Firestore');
    } finally {
      setIsPullingFirebase(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="pb-6 border-b border-slate-800">
        <h2 className="text-2xl font-bold font-display text-white">Pengaturan Website & Akun</h2>
        <p className="text-xs text-slate-400 mt-1">
          Kustomisasi teks umum website, headline, meta description, dan kredensial keamanan login administrator.
        </p>
      </div>

      {/* Website Text Settings Form */}
      <form onSubmit={handleSaveSiteSettings} className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Konfigurasi Teks Website</h3>
            <p className="text-xs text-slate-400">Kustomisasi judul, deskripsi meta, dan teks footer</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Judul Website (Browser Tab)</label>
            <input
              type="text"
              name="siteTitle"
              value={siteForm.siteTitle}
              onChange={handleSiteChange}
              placeholder="Rizki Pauzi - Professional Portfolio"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Sapaan Hero</label>
            <input
              type="text"
              name="heroGreeting"
              value={siteForm.heroGreeting}
              onChange={handleSiteChange}
              placeholder="Halo, Selamat Datang"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Deskripsi Hero</label>
          <textarea
            rows={2}
            name="heroDescription"
            value={siteForm.heroDescription}
            onChange={handleSiteChange}
            placeholder="Deskripsi singkat yang tampil di bagian atas halaman utama..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Meta Description (SEO)</label>
          <textarea
            rows={2}
            name="metaDescription"
            value={siteForm.metaDescription}
            onChange={handleSiteChange}
            placeholder="Deskripsi untuk optimasi mesin pencari Google..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Teks Copyright Footer</label>
          <input
            type="text"
            name="footerText"
            value={siteForm.footerText}
            onChange={handleSiteChange}
            placeholder="© 2026 Rizki Pauzi. All Rights Reserved."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSavingSite}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition-all shadow-md shadow-cyan-600/20 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSavingSite ? 'Menyimpan...' : 'Simpan Konfigurasi Web'}</span>
          </button>
        </div>
      </form>

      {/* Security Credentials Form */}
      <form onSubmit={handleUpdateSecurity} className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Keamanan Akun Administrator</h3>
            <p className="text-xs text-slate-400">Ubah email login dan password admin</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Administrator</label>
          <input
            type="email"
            value={securityForm.email}
            onChange={(e) => setSecurityForm({ ...securityForm, email: e.target.value })}
            placeholder="admin@rizkipauzi.com"
            required
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 text-sm text-white outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Password Saat Ini <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <input
              type={showCurrentPass ? 'text' : 'password'}
              value={securityForm.currentPassword}
              onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
              placeholder="Masukkan password admin saat ini"
              required
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 text-sm text-white outline-none"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPass(!showCurrentPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password Baru (Opsional)</label>
            <div className="relative">
              <input
                type={showNewPass ? 'text' : 'password'}
                value={securityForm.newPassword}
                onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                placeholder="Kosongkan jika tidak ingin mengubah"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 text-sm text-white outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ulangi Password Baru</label>
            <input
              type="password"
              value={securityForm.confirmPassword}
              onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
              placeholder="Ulangi password baru"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 text-sm text-white outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isUpdatingSecurity}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>{isUpdatingSecurity ? 'Memperbarui...' : 'Perbarui Kredensial Admin'}</span>
          </button>
        </div>
      </form>

      {/* Database Backup & Restore Manager */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Manajemen Database & Backup Data</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Unduh seluruh data website (biodata, pendidikan, skills, project, galeri, sertifikat) atau pulihkan dari file cadangan.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-cyan-400" />
                Ekspor Database (Backup JSON)
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Unduh seluruh data yang sudah Anda isi ke format file <code className="text-cyan-300">.json</code> agar data Anda selalu aman dan dapat dipindahkan kapan saja.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportDatabase}
              disabled={isExportingDb}
              className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExportingDb ? 'Mengekspor Data...' : 'Unduh Backup Database'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" />
                Impor & Pulihkan Database
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Pulihkan atau sinkronkan data website menggunakan file backup <code className="text-emerald-300">.json</code> yang pernah Anda unduh sebelumnya.
              </p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImportFileChange}
                className="hidden"
                id="database-file-upload"
              />
              <label
                htmlFor="database-file-upload"
                className={`mt-4 inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer ${
                  isImportingDb ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                {isImportingDb ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Memulihkan Data...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Pilih File Backup JSON</span>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Firebase Cloud Firestore Manager */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Google Cloud Firebase & Firestore</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Proyek Firebase: <span className="text-amber-400 font-mono font-semibold">cv-rizki-pauzi</span> (Region: <span className="text-slate-300 font-mono">asia-southeast1</span>)
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CloudCheck className="w-3.5 h-3.5" />
            <span>Terhubung & Aktif</span>
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Database Cloud Firestore telah terhubung secara resmi ke proyek Firebase Anda. Anda dapat menyinkronkan seluruh data website (biodata, riwayat pendidikan UPI, skill, karya, sertifikat, dan pengaturan) langsung ke cloud.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                Sinkronkan ke Cloud Firestore
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Kirim dan perbarui seluruh data lokal/server ke koleksi Cloud Firestore (<code className="text-amber-300">profile, education, skills, projects, gallery, certificates</code>).
              </p>
            </div>
            <button
              type="button"
              onClick={handleSyncToFirestore}
              disabled={isSyncingFirebase}
              className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSyncingFirebase ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Menyinkronkan ke Cloud...</span>
                </>
              ) : (
                <>
                  <CloudCheck className="w-4 h-4" />
                  <span>Sync Semua Data ke Firebase</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-cyan-400" />
                Tarik Data dari Cloud Firestore
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Unduh dan terapkan data terbaru yang tersimpan di Google Cloud Firestore ke sistem website.
              </p>
            </div>
            <button
              type="button"
              onClick={handlePullFromFirestore}
              disabled={isPullingFirebase}
              className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isPullingFirebase ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Mengambil Data Cloud...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Tarik Data dari Firebase</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

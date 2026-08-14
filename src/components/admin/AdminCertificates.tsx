import React, { useState } from 'react';
import { Award, Plus, Edit2, Trash2, Save, X, ExternalLink, Calendar, Building } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import { ImageUploader } from '../common/ImageUploader';
import type { CertificateItem } from '../../types/index';

interface AdminCertificatesProps {
  certificatesList: CertificateItem[];
  onListUpdated: (updated: CertificateItem[]) => void;
}

export const AdminCertificates: React.FC<AdminCertificatesProps> = ({ certificatesList, onListUpdated }) => {
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CertificateItem | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    institution: '',
    year: '2026',
    credentialId: '',
    imageUrl: '',
    verificationUrl: ''
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      institution: '',
      year: new Date().getFullYear().toString(),
      credentialId: '',
      imageUrl: '',
      verificationUrl: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: CertificateItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      institution: item.institution || '',
      year: item.year || '',
      credentialId: item.credentialId || '',
      imageUrl: item.imageUrl || '',
      verificationUrl: item.verificationUrl || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      error('Nama sertifikat wajib diisi');
      return;
    }

    setIsSaving(true);
    try {
      if (editingItem) {
        const res = await api.updateCertificate(editingItem.id, formData);
        const updatedList = certificatesList.map((c) => (c.id === editingItem.id ? res.data : c));
        onListUpdated(updatedList);
        success('Sertifikat berhasil diperbarui');
      } else {
        const res = await api.addCertificate(formData);
        onListUpdated([...certificatesList, res.data]);
        success('Sertifikat baru berhasil ditambahkan');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      error(err.message || 'Gagal menyimpan sertifikat');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItemId) return;
    setIsDeleting(true);
    try {
      await api.deleteCertificate(deleteItemId);
      onListUpdated(certificatesList.filter((c) => c.id !== deleteItemId));
      success('Sertifikat berhasil dihapus');
      setDeleteItemId(null);
    } catch (err: any) {
      error(err.message || 'Gagal menghapus sertifikat');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Sertifikat & Lisensi</h2>
          <p className="text-xs text-slate-400 mt-1">
            Kelola piagam kompetensi, pencapaian akademis, dan URL verifikasi credential.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-sky-500 hover:from-cyan-500 hover:to-sky-400 transition-all shadow-md shadow-cyan-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Sertifikat</span>
        </button>
      </div>

      {certificatesList.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800">
          <Award className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Belum Ada Sertifikat Ditambahkan</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
            Tambahkan sertifikat pelatihan atau kompetensi Anda untuk meningkatkan kredibilitas portofolio.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 text-white"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Sertifikat Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {certificatesList.map((cert) => (
            <div
              key={cert.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Award className="w-5 h-5" />
                  </div>
                  {cert.year && (
                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                      {cert.year}
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-white font-display line-clamp-2">
                  {cert.title}
                </h4>

                {cert.institution && (
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <Building className="w-3 h-3 text-slate-500" />
                    <span>{cert.institution}</span>
                  </p>
                )}

                {cert.credentialId && (
                  <p className="text-[11px] text-slate-500 font-mono-code mt-2">
                    ID: {cert.credentialId}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800">
                {cert.verificationUrl ? (
                  <a
                    href={cert.verificationUrl.startsWith('http') ? cert.verificationUrl : `https://${cert.verificationUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:underline"
                  >
                    <span>Verifikasi</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-500">Tervalidasi</span>
                )}

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(cert)}
                    className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteItemId(cert.id)}
                    className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Edit Sertifikat' : 'Tambah Sertifikat'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nama Sertifikat / Lisensi <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Certified Web Developer / Course Completion"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Penyelenggara / Institusi</label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="Contoh: Dicoding / Coursera"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tahun</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2026"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Credential ID / Nomor Seri</label>
                <input
                  type="text"
                  value={formData.credentialId}
                  onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                  placeholder="Contoh: CERT-2026-XYZ123"
                  className="w-full px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white outline-none"
                />
              </div>

              {/* Upload Certificate Image */}
              <ImageUploader
                label="Foto / Berkas Sertifikat"
                value={formData.imageUrl}
                onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
                aspectRatio="wide"
                helperText="Mendukung JPG, PNG, WEBP, PDF screenshot. Drag & Drop langsung ke kotak."
                placeholder="Atau tempel URL gambar sertifikat..."
              />

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Link Verifikasi Online</label>
                <input
                  type="text"
                  value={formData.verificationUrl}
                  onChange={(e) => setFormData({ ...formData, verificationUrl: e.target.value })}
                  placeholder="https://verify.example.com/id/123"
                  className="w-full px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Sertifikat'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!deleteItemId}
        onClose={() => setDeleteItemId(null)}
        onConfirm={handleDelete}
        title="Hapus Sertifikat"
        message="Apakah Anda yakin ingin menghapus data sertifikat ini?"
        isLoading={isDeleting}
      />
    </div>
  );
};

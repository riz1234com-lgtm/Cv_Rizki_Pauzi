import React, { useState } from 'react';
import { Image as ImageIcon, Plus, Edit2, Trash2, Save, X, ZoomIn } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import { ImageUploader } from '../common/ImageUploader';
import type { GalleryItem } from '../../types/index';
import { resolveImageUrl, DEFAULT_FALLBACK_THUMBNAIL } from '../../lib/imageHelper';

interface AdminGalleryProps {
  galleryList: GalleryItem[];
  onListUpdated: (updated: GalleryItem[]) => void;
}

export const AdminGallery: React.FC<AdminGalleryProps> = ({ galleryList, onListUpdated }) => {
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    caption: '',
    category: 'Dokumentasi'
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      imageUrl: '',
      caption: '',
      category: 'Dokumentasi'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      imageUrl: resolveImageUrl(item.imageUrl) || item.imageUrl,
      caption: item.caption || '',
      category: item.category || 'Dokumentasi'
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.imageUrl.trim()) {
      error('Judul dan URL Foto wajib diisi');
      return;
    }

    setIsSaving(true);
    try {
      if (editingItem) {
        const res = await api.updateGalleryItem(editingItem.id, formData);
        const updatedList = galleryList.map((g) => (g.id === editingItem.id ? res.data : g));
        onListUpdated(updatedList);
        success('Foto galeri berhasil diperbarui');
      } else {
        const res = await api.addGalleryItem(formData);
        onListUpdated([...galleryList, res.data]);
        success('Foto galeri baru berhasil ditambahkan');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      error(err.message || 'Gagal menyimpan foto');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItemId) return;
    setIsDeleting(true);
    try {
      await api.deleteGalleryItem(deleteItemId);
      onListUpdated(galleryList.filter((g) => g.id !== deleteItemId));
      success('Foto berhasil dihapus dari galeri');
      setDeleteItemId(null);
    } catch (err: any) {
      error(err.message || 'Gagal menghapus foto');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Galeri & Dokumentasi</h2>
          <p className="text-xs text-slate-400 mt-1">
            Unggah dan kelola foto kegiatan, momen penting, dan visualisasi aktivitas.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-sky-500 hover:from-cyan-500 hover:to-sky-400 transition-all shadow-md shadow-cyan-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Foto Baru</span>
        </button>
      </div>

      {galleryList.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800">
          <ImageIcon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Galeri Masih Kosong</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
            Tambahkan foto pertama Anda untuk mempercantik halaman portfolio publik.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 text-white"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Foto Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {galleryList.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="aspect-square bg-slate-950 relative overflow-hidden">
                  <img
                    src={resolveImageUrl(item.imageUrl)}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = DEFAULT_FALLBACK_THUMBNAIL;
                    }}
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/80 text-cyan-300 border border-slate-700">
                    {item.category}
                  </span>
                </div>
                <div className="p-3.5">
                  <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                  {item.caption && (
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{item.caption}</p>
                  )}
                </div>
              </div>

              <div className="p-3 bg-slate-950/40 border-t border-slate-800 flex items-center justify-end gap-1.5">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteItemId(item.id)}
                  className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Edit Foto Galeri' : 'Upload Foto Galeri'}
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
                  Judul Foto / Kegiatan <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Dokumentasi Kampus UPI / Seminar"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-xs text-white outline-none"
                >
                  <option value="Dokumentasi">Dokumentasi</option>
                  <option value="Kegiatan">Kegiatan</option>
                  <option value="Foto Profil">Foto Profil</option>
                  <option value="Sertifikat">Sertifikat</option>
                  <option value="Project">Project</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <ImageUploader
                label="Foto / Gambar Galeri"
                value={formData.imageUrl}
                onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
                aspectRatio="video"
                helperText="Mendukung JPG, PNG, WEBP, GIF (maks 5MB). Drag & drop langsung ke kotak."
                placeholder="Atau tempel link URL foto..."
              />

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Keterangan / Caption</label>
                <textarea
                  rows={2}
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Keterangan singkat momen ini..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none resize-none"
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
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Foto'}</span>
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
        title="Hapus Foto Galeri"
        message="Apakah Anda yakin ingin menghapus foto ini dari galeri?"
        isLoading={isDeleting}
      />
    </div>
  );
};

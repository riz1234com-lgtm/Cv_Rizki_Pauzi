import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  MoveUp,
  MoveDown,
  CheckCircle2,
  Clock,
  Save,
  X,
  Calendar
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import type { EducationItem, EducationStatus } from '../../types/index';

interface AdminEducationProps {
  educationList: EducationItem[];
  onListUpdated: (updated: EducationItem[]) => void;
}

export const AdminEducation: React.FC<AdminEducationProps> = ({ educationList, onListUpdated }) => {
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EducationItem | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    institution: '',
    level: 'Sekolah Dasar',
    status: 'Completed' as EducationStatus,
    startYear: 'Belum diatur',
    endYear: 'Belum diatur',
    description: '',
    order: 0
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      institution: '',
      level: 'Perguruan Tinggi / Sarjana',
      status: 'In Progress',
      startYear: 'Belum diatur',
      endYear: 'Sekarang',
      description: '',
      order: educationList.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: EducationItem) => {
    setEditingItem(item);
    setFormData({
      institution: item.institution,
      level: item.level || '',
      status: item.status,
      startYear: item.startYear || 'Belum diatur',
      endYear: item.endYear || 'Belum diatur',
      description: item.description || '',
      order: item.order || 0
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.institution.trim()) {
      error('Nama institusi pendidikan wajib diisi');
      return;
    }

    setIsSaving(true);
    try {
      if (editingItem) {
        const res = await api.updateEducation(editingItem.id, formData);
        const updatedList = educationList.map((e) => (e.id === editingItem.id ? res.data : e));
        onListUpdated(updatedList);
        success('Data pendidikan berhasil diperbarui');
      } else {
        const res = await api.addEducation(formData);
        onListUpdated([...educationList, res.data]);
        success('Data pendidikan baru berhasil ditambahkan');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      error(err.message || 'Gagal menyimpan data pendidikan');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItemId) return;
    setIsDeleting(true);
    try {
      await api.deleteEducation(deleteItemId);
      onListUpdated(educationList.filter((e) => e.id !== deleteItemId));
      success('Data pendidikan berhasil dihapus');
      setDeleteItemId(null);
    } catch (err: any) {
      error(err.message || 'Gagal menghapus data pendidikan');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= educationList.length) return;

    const newList = [...educationList];
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;

    const orderedIds = newList.map((item) => item.id);
    onListUpdated(newList);

    try {
      await api.reorderEducation(orderedIds);
      success('Urutan pendidikan berhasil disimpan');
    } catch (err: any) {
      error('Gagal menyimpan urutan');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Riwayat Pendidikan</h2>
          <p className="text-xs text-slate-400 mt-1">
            Kelola jejak akademis mulai dari SDN Sukahati 2 hingga Universitas Pendidikan Indonesia (UPI).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-sky-500 hover:from-cyan-500 hover:to-sky-400 transition-all shadow-md shadow-cyan-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pendidikan</span>
        </button>
      </div>

      {/* Education Items List */}
      <div className="space-y-4">
        {educationList.map((item, idx) => {
          const isProgress = item.status === 'In Progress';
          return (
            <div
              key={item.id}
              className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-4 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isProgress
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'bg-slate-800 text-emerald-400 border border-slate-700'
                  }`}
                >
                  <GraduationCap className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                      {item.level}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        isProgress
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {isProgress ? (
                        <>
                          <Clock className="w-3 h-3" />
                          <span>In Progress</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Completed</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white font-display truncate">
                    {item.institution}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>
                      {item.startYear} — {item.endYear}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 max-w-xl">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                <button
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                  title="Pindah ke Atas"
                >
                  <MoveUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === educationList.length - 1}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                  title="Pindah ke Bawah"
                >
                  <MoveDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded-xl bg-slate-800 text-cyan-400 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteItemId(item.id)}
                  className="p-2 rounded-xl bg-slate-800 text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Edit Data Pendidikan' : 'Tambah Riwayat Pendidikan'}
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
                  Nama Institusi / Sekolah <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="Contoh: Universitas Pendidikan Indonesia (UPI)"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Jenjang</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-xs text-white outline-none"
                  >
                    <option value="Sekolah Dasar">Sekolah Dasar (SD)</option>
                    <option value="Sekolah Menengah Pertama">Sekolah Menengah Pertama (SMP)</option>
                    <option value="Sekolah Menengah Kejuruan">Sekolah Menengah Kejuruan (SMK)</option>
                    <option value="Sekolah Menengah Atas">Sekolah Menengah Atas (SMA)</option>
                    <option value="Perguruan Tinggi / Sarjana">Perguruan Tinggi / Sarjana (S1)</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as EducationStatus })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-xs text-white outline-none"
                  >
                    <option value="Completed">Completed / Selesai</option>
                    <option value="In Progress">In Progress / Sedang Berjalan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tahun Masuk</label>
                  <input
                    type="text"
                    value={formData.startYear}
                    onChange={(e) => setFormData({ ...formData, startYear: e.target.value })}
                    placeholder="Contoh: 2022 atau Belum diatur"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tahun Selesai</label>
                  <input
                    type="text"
                    value={formData.endYear}
                    onChange={(e) => setFormData({ ...formData, endYear: e.target.value })}
                    placeholder="Contoh: 2026 / Sekarang"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Deskripsi</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Keterangan singkat mengenai jenjang atau aktivitas..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none resize-none"
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
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Data'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={!!deleteItemId}
        onClose={() => setDeleteItemId(null)}
        onConfirm={handleDelete}
        title="Hapus Riwayat Pendidikan"
        message="Apakah Anda yakin ingin menghapus data institusi pendidikan ini?"
        isLoading={isDeleting}
      />
    </div>
  );
};

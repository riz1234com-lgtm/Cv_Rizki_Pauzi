import React, { useState } from 'react';
import { Code2, Plus, Edit2, Trash2, Save, X, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import type { SkillItem } from '../../types/index';

interface AdminSkillsProps {
  skillsList: SkillItem[];
  onListUpdated: (updated: SkillItem[]) => void;
}

export const AdminSkills: React.FC<AdminSkillsProps> = ({ skillsList, onListUpdated }) => {
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SkillItem | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Web Development',
    proficiency: 80,
    levelLabel: 'Intermediate',
    icon: 'Code',
    description: ''
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Web Development',
      proficiency: 80,
      levelLabel: 'Intermediate',
      icon: 'Code',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: SkillItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category || 'Web Development',
      proficiency: item.proficiency,
      levelLabel: item.levelLabel || 'Intermediate',
      icon: item.icon || 'Code',
      description: item.description || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      error('Nama skill wajib diisi');
      return;
    }

    setIsSaving(true);
    try {
      if (editingItem) {
        const res = await api.updateSkill(editingItem.id, formData);
        const updatedList = skillsList.map((s) => (s.id === editingItem.id ? res.data : s));
        onListUpdated(updatedList);
        success('Skill berhasil diperbarui');
      } else {
        const res = await api.addSkill(formData);
        onListUpdated([...skillsList, res.data]);
        success('Skill baru berhasil ditambahkan');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      error(err.message || 'Gagal menyimpan skill');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItemId) return;
    setIsDeleting(true);
    try {
      await api.deleteSkill(deleteItemId);
      onListUpdated(skillsList.filter((s) => s.id !== deleteItemId));
      success('Skill berhasil dihapus');
      setDeleteItemId(null);
    } catch (err: any) {
      error(err.message || 'Gagal menghapus skill');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Skills & Keahlian</h2>
          <p className="text-xs text-slate-400 mt-1">
            Kelola daftar keahlian, teknologi, dan tingkat kecakapan (proficiency).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-sky-500 hover:from-cyan-500 hover:to-sky-400 transition-all shadow-md shadow-cyan-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Skill Baru</span>
        </button>
      </div>

      {skillsList.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800">
          <Code2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Belum Ada Skill Terdaftar</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
            Tambahkan skill pertama Anda untuk ditampilkan di halaman publik secara dinamis.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 text-white"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillsList.map((skill) => (
            <div
              key={skill.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                    {skill.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono-code font-bold">
                    {skill.proficiency}%
                  </span>
                </div>

                <h4 className="text-base font-bold text-white font-display mt-1">{skill.name}</h4>
                <p className="text-xs text-slate-400 mt-1">{skill.levelLabel}</p>

                {skill.description && (
                  <p className="text-xs text-slate-400/80 mt-2 line-clamp-2">{skill.description}</p>
                )}

                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-4">
                  <div
                    className="h-full bg-cyan-500 rounded-full"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-800">
                <button
                  onClick={() => handleOpenEdit(skill)}
                  className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteItemId(skill.id)}
                  className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
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
                {editingItem ? 'Edit Skill' : 'Tambah Skill Baru'}
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
                  Nama Keahlian / Teknologi <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: React.js, TypeScript, UI Design"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-xs text-white outline-none"
                  >
                    <option value="Programming">Programming</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Design & UI/UX">Design & UI/UX</option>
                    <option value="Digital Skills">Digital Skills</option>
                    <option value="Database">Database</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tingkat</label>
                  <select
                    value={formData.levelLabel}
                    onChange={(e) => setFormData({ ...formData, levelLabel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-xs text-white outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-1.5">
                  <span>Persentase Penguasaan</span>
                  <span className="text-cyan-400 font-mono-code">{formData.proficiency}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={formData.proficiency}
                  onChange={(e) => setFormData({ ...formData, proficiency: Number(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Deskripsi / Catatan Singkat</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Keterangan singkat penguasaan..."
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
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Skill'}</span>
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
        title="Hapus Skill"
        message="Apakah Anda yakin ingin menghapus skill ini dari daftar?"
        isLoading={isDeleting}
      />
    </div>
  );
};

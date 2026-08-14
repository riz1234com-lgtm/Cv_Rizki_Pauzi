import React, { useState } from 'react';
import { FolderGit2, Plus, Edit2, Trash2, Save, X, ExternalLink, Github, Star } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import { ImageUploader } from '../common/ImageUploader';
import type { ProjectItem } from '../../types/index';
import { resolveImageUrl, DEFAULT_FALLBACK_THUMBNAIL } from '../../lib/imageHelper';

interface AdminProjectsProps {
  projectsList: ProjectItem[];
  onListUpdated: (updated: ProjectItem[]) => void;
}

export const AdminProjects: React.FC<AdminProjectsProps> = ({ projectsList, onListUpdated }) => {
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjectItem | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Application',
    thumbnailUrl: '',
    demoUrl: '',
    githubUrl: '',
    technologiesString: 'React, TypeScript, Tailwind CSS',
    featured: false,
    published: true
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      category: 'Web Application',
      thumbnailUrl: '',
      demoUrl: '',
      githubUrl: '',
      technologiesString: 'React, TypeScript, Tailwind CSS',
      featured: false,
      published: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ProjectItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category || 'Web Application',
      thumbnailUrl: resolveImageUrl(item.thumbnailUrl) || item.thumbnailUrl || '',
      demoUrl: item.demoUrl || '',
      githubUrl: item.githubUrl || '',
      technologiesString: item.technologies ? item.technologies.join(', ') : '',
      featured: !!item.featured,
      published: item.isPublished !== false
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      error('Judul dan deskripsi project wajib diisi');
      return;
    }

    const techArray = formData.technologiesString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      thumbnailUrl: formData.thumbnailUrl,
      demoUrl: formData.demoUrl,
      githubUrl: formData.githubUrl,
      technologies: techArray,
      featured: formData.featured,
      isPublished: formData.published
    };

    setIsSaving(true);
    try {
      if (editingItem) {
        const res = await api.updateProject(editingItem.id, payload);
        const updatedList = projectsList.map((p) => (p.id === editingItem.id ? res.data : p));
        onListUpdated(updatedList);
        success('Project berhasil diperbarui');
      } else {
        const res = await api.addProject(payload);
        onListUpdated([...projectsList, res.data]);
        success('Project baru berhasil ditambahkan');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      error(err.message || 'Gagal menyimpan project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItemId) return;
    setIsDeleting(true);
    try {
      await api.deleteProject(deleteItemId);
      onListUpdated(projectsList.filter((p) => p.id !== deleteItemId));
      success('Project berhasil dihapus');
      setDeleteItemId(null);
    } catch (err: any) {
      error(err.message || 'Gagal menghapus project');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Karya & Project Showcase</h2>
          <p className="text-xs text-slate-400 mt-1">
            Kelola dokumentasi portfolio project, link repository, demo online, dan thumbnail.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-sky-500 hover:from-cyan-500 hover:to-sky-400 transition-all shadow-md shadow-cyan-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Project Baru</span>
        </button>
      </div>

      {projectsList.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800">
          <FolderGit2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Belum Ada Project Terdaftar</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
            Tambahkan karya atau tugas teknologi pertama Anda. Konten ini langsung tampil di halaman utama.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 text-white"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Project Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsList.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="aspect-video bg-slate-950 relative overflow-hidden flex items-center justify-center">
                  {project.thumbnailUrl ? (
                    <img
                      src={resolveImageUrl(project.thumbnailUrl)}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = DEFAULT_FALLBACK_THUMBNAIL;
                      }}
                    />
                  ) : (
                    <FolderGit2 className="w-8 h-8 text-slate-700" />
                  )}
                  {project.featured && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-amber-300" />
                      Featured
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    {project.category}
                  </span>
                  <h4 className="text-base font-bold text-white font-display mt-0.5 line-clamp-1">
                    {project.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{project.description}</p>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {project.technologies.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-slate-950/40 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl.startsWith('http') ? project.githubUrl : `https://${project.githubUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl.startsWith('http') ? project.demoUrl : `https://${project.demoUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 hover:text-cyan-300"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(project)}
                    className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteItemId(project.id)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Edit Project' : 'Tambah Project Baru'}
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
                  Judul Project <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Sistem Informasi Akademis / Portfolio Web"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Kategori</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Web Application, Mobile App, Design, etc."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none"
                />
              </div>

              {/* Thumbnail Uploader */}
              <ImageUploader
                label="Foto Thumbnail Project"
                value={formData.thumbnailUrl}
                onChange={(url) => setFormData((prev) => ({ ...prev, thumbnailUrl: url }))}
                aspectRatio="video"
                helperText="Mendukung JPG, PNG, WEBP. Drag & Drop gambar screenshot atau mockup project."
                placeholder="Atau tempel link URL thumbnail..."
              />

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Deskripsi Lengkap <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Jelaskan tujuan project, fitur utama, dan peran Anda..."
                  required
                  className="w-full px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Teknologi yang Digunakan (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={formData.technologiesString}
                  onChange={(e) => setFormData({ ...formData, technologiesString: e.target.value })}
                  placeholder="React, TypeScript, Express, PostgreSQL"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-sm text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Link Live Demo</label>
                  <input
                    type="text"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    placeholder="https://demo.example.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Link GitHub Repo</label>
                  <input
                    type="text"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/user/repo"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-slate-800"
                />
                <label htmlFor="featured" className="text-xs text-slate-300 cursor-pointer">
                  Tandai sebagai Featured Project (Unggulan)
                </label>
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
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Project'}</span>
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
        title="Hapus Project"
        message="Apakah Anda yakin ingin menghapus karya project ini dari portofolio?"
        isLoading={isDeleting}
      />
    </div>
  );
};

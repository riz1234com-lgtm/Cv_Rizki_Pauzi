import React from 'react';
import {
  GraduationCap,
  Code2,
  FolderGit2,
  Image as ImageIcon,
  Award,
  MessageSquare,
  Plus,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';
import type { StatsOverview, ContactMessage, EducationItem } from '../../types/index';
import type { AdminTab } from './AdminLayout';

interface AdminDashboardProps {
  stats: StatsOverview;
  recentMessages: ContactMessage[];
  educationList: EducationItem[];
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  recentMessages,
  educationList,
  onNavigateTab
}) => {
  const statCards = [
    {
      label: 'Jenjang Pendidikan',
      value: stats.totalEducation,
      desc: 'SDN, SMP, SMK, UPI',
      icon: GraduationCap,
      tab: 'education' as AdminTab,
      color: 'from-cyan-500 to-sky-600'
    },
    {
      label: 'Skills / Keahlian',
      value: stats.totalSkills,
      desc: 'Keahlian terdaftar',
      icon: Code2,
      tab: 'skills' as AdminTab,
      color: 'from-sky-500 to-blue-600'
    },
    {
      label: 'Karya / Projects',
      value: stats.totalProjects,
      desc: 'Portofolio project',
      icon: FolderGit2,
      tab: 'projects' as AdminTab,
      color: 'from-blue-600 to-indigo-600'
    },
    {
      label: 'Galeri Foto',
      value: stats.totalGallery,
      desc: 'Dokumentasi visual',
      icon: ImageIcon,
      tab: 'gallery' as AdminTab,
      color: 'from-indigo-600 to-violet-600'
    },
    {
      label: 'Sertifikat',
      value: stats.totalCertificates,
      desc: 'Sertifikasi & lisensi',
      icon: Award,
      tab: 'certificates' as AdminTab,
      color: 'from-violet-600 to-purple-600'
    },
    {
      label: 'Pesan Masuk',
      value: stats.totalMessages,
      desc: `${stats.unreadMessages} pesan belum dibaca`,
      icon: MessageSquare,
      tab: 'messages' as AdminTab,
      color: 'from-rose-500 to-pink-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Admin Control Center • 2026</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Selamat Datang di CMS Rizki Pauzi
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Kelola seluruh konten website Anda secara real-time: biodata, riwayat pendidikan, keahlian, showcase project, galeri foto, hingga pesan masuk dari pengunjung.
          </p>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => onNavigateTab('profile')}
            className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-left transition-all hover:-translate-y-0.5 group"
          >
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit mb-2 group-hover:scale-110 transition-transform">
              <User className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white block">Edit Profil</span>
            <span className="text-[11px] text-slate-500">Bio & Foto</span>
          </button>

          <button
            onClick={() => onNavigateTab('projects')}
            className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-left transition-all hover:-translate-y-0.5 group"
          >
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 w-fit mb-2 group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white block">Tambah Project</span>
            <span className="text-[11px] text-slate-500">Showcase karya</span>
          </button>

          <button
            onClick={() => onNavigateTab('skills')}
            className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-left transition-all hover:-translate-y-0.5 group"
          >
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 w-fit mb-2 group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white block">Tambah Skill</span>
            <span className="text-[11px] text-slate-500">Keahlian baru</span>
          </button>

          <button
            onClick={() => onNavigateTab('education')}
            className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-left transition-all hover:-translate-y-0.5 group"
          >
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit mb-2 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white block">Kelola Edukasi</span>
            <span className="text-[11px] text-slate-500">Timeline sekolah</span>
          </button>

          <button
            onClick={() => onNavigateTab('gallery')}
            className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-left transition-all hover:-translate-y-0.5 group"
          >
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 w-fit mb-2 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white block">Upload Galeri</span>
            <span className="text-[11px] text-slate-500">Foto kegiatan</span>
          </button>

          <button
            onClick={() => onNavigateTab('certificates')}
            className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-left transition-all hover:-translate-y-0.5 group"
          >
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 w-fit mb-2 group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white block">Sertifikat</span>
            <span className="text-[11px] text-slate-500">Lisensi & piagam</span>
          </button>
        </div>
      </div>

      {/* Metrics Overview Grid */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Statistik Konten</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {statCards.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                onClick={() => onNavigateTab(c.tab)}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all hover:-translate-y-0.5 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-tr ${c.color} text-white shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-slate-500 group-hover:text-cyan-400 transition-colors flex items-center gap-1">
                    <span>Kelola</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="text-2xl font-black font-display text-white">{c.value}</div>
                <p className="text-xs font-semibold text-slate-300 mt-1">{c.label}</p>
                <span className="text-[11px] text-slate-500 block mt-0.5">{c.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column Summary: Verified Education Status & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Verified Education List */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-white font-display">Timeline Pendidikan Resmi</h4>
            <button
              onClick={() => onNavigateTab('education')}
              className="text-xs text-cyan-400 hover:underline font-semibold"
            >
              Lihat Detail
            </button>
          </div>

          <div className="space-y-3">
            {educationList.map((edu) => {
              const isProgress = edu.status === 'In Progress';
              return (
                <div
                  key={edu.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {isProgress ? (
                      <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    <div>
                      <p className="text-xs font-bold text-white">{edu.institution}</p>
                      <span className="text-[10px] text-slate-400">{edu.level}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      isProgress
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {edu.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Messages Inbox */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-white font-display">Pesan Masuk Terbaru</h4>
            <button
              onClick={() => onNavigateTab('messages')}
              className="text-xs text-cyan-400 hover:underline font-semibold"
            >
              Lihat Semua ({recentMessages.length})
            </button>
          </div>

          {recentMessages.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800/80">
              <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">Belum ada pesan yang masuk dari pengunjung.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentMessages.slice(0, 3).map((m) => (
                <div
                  key={m.id}
                  className={`p-3 rounded-xl border transition-colors ${
                    m.isRead
                      ? 'bg-slate-950/40 border-slate-800 text-slate-300'
                      : 'bg-slate-950 border-cyan-500/30 text-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-cyan-300">{m.name}</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(m.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { MessageSquare, Trash2, Mail, CheckCircle2, Clock, Reply, Search, Eye } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import type { ContactMessage } from '../../types/index';

interface AdminMessagesProps {
  messagesList: ContactMessage[];
  onListUpdated: (updated: ContactMessage[]) => void;
}

export const AdminMessages: React.FC<AdminMessagesProps> = ({ messagesList, onListUpdated }) => {
  const { success, error } = useToast();

  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredMessages = messagesList.filter((m) => {
    const query = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query) ||
      m.subject?.toLowerCase().includes(query) ||
      m.message.toLowerCase().includes(query)
    );
  });

  const handleToggleRead = async (message: ContactMessage) => {
    try {
      await api.markMessageRead(message.id, !message.isRead);
      const updated = messagesList.map((m) =>
        m.id === message.id ? { ...m, isRead: !message.isRead } : m
      );
      onListUpdated(updated);
      if (selectedMessage?.id === message.id) {
        setSelectedMessage({ ...selectedMessage, isRead: !message.isRead });
      }
      success(message.isRead ? 'Pesan ditandai belum dibaca' : 'Pesan ditandai sudah dibaca');
    } catch (err: any) {
      error(err.message || 'Gagal mengubah status pesan');
    }
  };

  const handleOpenMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      try {
        await api.markMessageRead(message.id, true);
        const updated = messagesList.map((m) =>
          m.id === message.id ? { ...m, isRead: true } : m
        );
        onListUpdated(updated);
      } catch (err) {
        // silent
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteItemId) return;
    setIsDeleting(true);
    try {
      await api.deleteMessage(deleteItemId);
      onListUpdated(messagesList.filter((m) => m.id !== deleteItemId));
      if (selectedMessage?.id === deleteItemId) {
        setSelectedMessage(null);
      }
      success('Pesan berhasil dihapus');
      setDeleteItemId(null);
    } catch (err: any) {
      error(err.message || 'Gagal menghapus pesan');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Kotak Pesan Masuk</h2>
          <p className="text-xs text-slate-400 mt-1">
            Kelola pesan dan formulir kontak yang dikirimkan oleh pengunjung website.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pesan atau email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {messagesList.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800">
          <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Kotak Pesan Kosong</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            Pesan yang dikirimkan oleh pengunjung melalui formulir kontak di website publik akan otomatis masuk ke sini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Messages List Column */}
          <div className="lg:col-span-5 space-y-3">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleOpenMessage(msg)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedMessage?.id === msg.id
                    ? 'bg-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-500/5'
                    : msg.isRead
                    ? 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900'
                    : 'bg-slate-900/95 border-cyan-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {!msg.isRead && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                    )}
                    <span className="text-xs font-bold text-white truncate">{msg.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>

                <p className="text-xs text-cyan-400/90 font-medium truncate">{msg.subject || 'Tanpa Subjek'}</p>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{msg.message}</p>
              </div>
            ))}
          </div>

          {/* Message Detail View Column */}
          <div className="lg:col-span-7">
            {selectedMessage ? (
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5 sticky top-24">
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white font-display">
                      {selectedMessage.subject || 'Tanpa Subjek'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                      <span>
                        Dari: <strong className="text-white">{selectedMessage.name}</strong>
                      </span>
                      <span>•</span>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-cyan-400 hover:underline"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleRead(selectedMessage)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                        selectedMessage.isRead
                          ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                          : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                      }`}
                    >
                      {selectedMessage.isRead ? 'Tandai Belum Dibaca' : 'Sudah Dibaca'}
                    </button>
                    <button
                      onClick={() => setDeleteItemId(selectedMessage.id)}
                      className="p-2 rounded-xl bg-slate-800 text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors"
                      title="Hapus Pesan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">
                    Diterima pada {new Date(selectedMessage.createdAt).toLocaleString('id-ID')}
                  </span>

                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                      selectedMessage.subject || 'Pesan Website Rizki Pauzi'
                    )}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors shadow-md shadow-cyan-600/20"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Balas via Email</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800/60">
                <Mail className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Pilih pesan di sebelah kiri untuk membaca detail isi pesan.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!deleteItemId}
        onClose={() => setDeleteItemId(null)}
        onConfirm={handleDelete}
        title="Hapus Pesan"
        message="Apakah Anda yakin ingin menghapus pesan ini dari riwayat kotak masuk?"
        isLoading={isDeleting}
      />
    </div>
  );
};

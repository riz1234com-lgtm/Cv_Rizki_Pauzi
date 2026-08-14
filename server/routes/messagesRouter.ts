import { Router, Request, Response } from 'express';
import { db } from '../db';
import { authMiddleware } from '../auth';

export const messagesRouter = Router();

// Public: send message from contact form
messagesRouter.post('/', (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ success: false, error: 'Nama, Email, dan Pesan wajib diisi' });
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, error: 'Format email tidak valid' });
      return;
    }

    const newMsg = db.addMessage({
      name: name.trim(),
      email: email.trim(),
      subject: subject ? subject.trim() : 'Pesan dari Portfolio Website',
      message: message.trim()
    });

    res.json({
      success: true,
      message: 'Terima kasih! Pesan Anda telah terkirim kepada Rizki Pauzi.',
      data: { id: newMsg.id }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal mengirim pesan' });
  }
});

// Admin: get all messages
messagesRouter.get('/', authMiddleware, (req: Request, res: Response) => {
  try {
    const list = db.getMessages();
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal mengambil data pesan' });
  }
});

// Admin: mark message read/unread
messagesRouter.patch('/:id/read', authMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;
    const updated = db.markMessageRead(id, isRead !== undefined ? Boolean(isRead) : true);

    if (!updated) {
      res.status(404).json({ success: false, error: 'Pesan tidak ditemukan' });
      return;
    }

    res.json({ success: true, message: 'Status pesan diperbarui' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal memperbarui status pesan' });
  }
});

// Admin: delete message
messagesRouter.delete('/:id', authMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteMessage(id);

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Pesan tidak ditemukan' });
      return;
    }

    res.json({ success: true, message: 'Pesan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal menghapus pesan' });
  }
});

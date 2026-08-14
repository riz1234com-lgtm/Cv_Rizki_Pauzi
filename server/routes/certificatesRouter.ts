import { Router, Request, Response } from 'express';
import { db } from '../db';
import { authMiddleware } from '../auth';

export const certificatesRouter = Router();

// Public: get all certificates
certificatesRouter.get('/', (req: Request, res: Response) => {
  try {
    const list = db.getCertificates();
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal mengambil data sertifikat' });
  }
});

// Admin: add certificate
certificatesRouter.post('/', authMiddleware, (req: Request, res: Response) => {
  try {
    const { title, institution, year, credentialId, imageUrl, verificationUrl, order } = req.body;

    if (!title) {
      res.status(400).json({ success: false, error: 'Nama sertifikat wajib diisi' });
      return;
    }

    const newItem = db.addCertificate({
      title,
      institution: institution || '',
      year: year || 'Belum diatur',
      credentialId: credentialId || '',
      imageUrl: imageUrl || '',
      verificationUrl: verificationUrl || '',
      order: typeof order === 'number' ? order : 0
    });

    res.json({ success: true, message: 'Sertifikat berhasil ditambahkan', data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal menambahkan sertifikat' });
  }
});

// Admin: update certificate
certificatesRouter.put('/:id', authMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = db.updateCertificate(id, updates);

    if (!updated) {
      res.status(404).json({ success: false, error: 'Sertifikat tidak ditemukan' });
      return;
    }

    res.json({ success: true, message: 'Sertifikat berhasil diperbarui', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal memperbarui sertifikat' });
  }
});

// Admin: delete certificate
certificatesRouter.delete('/:id', authMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteCertificate(id);

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Sertifikat tidak ditemukan' });
      return;
    }

    res.json({ success: true, message: 'Sertifikat berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal menghapus sertifikat' });
  }
});

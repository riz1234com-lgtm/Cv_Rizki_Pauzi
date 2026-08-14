import { Router, Request, Response } from 'express';
import { db } from '../db';
import { authMiddleware } from '../auth';

export const educationRouter = Router();

// Public: get all education history
educationRouter.get('/', (req: Request, res: Response) => {
  try {
    const list = db.getEducation();
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal mengambil riwayat pendidikan' });
  }
});

// Admin: add education
educationRouter.post('/', authMiddleware, (req: Request, res: Response) => {
  try {
    const { institution, level, status, startYear, endYear, description, logoUrl, order } = req.body;

    if (!institution) {
      res.status(400).json({ success: false, error: 'Nama institusi wajib diisi' });
      return;
    }

    const newItem = db.addEducation({
      institution,
      level: level || 'Pendidikan',
      status: status === 'In Progress' ? 'In Progress' : 'Completed',
      startYear: startYear || 'Belum diatur',
      endYear: endYear || 'Belum diatur',
      description: description || '',
      logoUrl: logoUrl || '',
      order: typeof order === 'number' ? order : 0
    });

    res.json({ success: true, message: 'Data pendidikan berhasil ditambahkan', data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal menambahkan data pendidikan' });
  }
});

// Admin: update education
educationRouter.put('/:id', authMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = db.updateEducation(id, updates);

    if (!updated) {
      res.status(404).json({ success: false, error: 'Data pendidikan tidak ditemukan' });
      return;
    }

    res.json({ success: true, message: 'Data pendidikan berhasil diperbarui', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal memperbarui data pendidikan' });
  }
});

// Admin: delete education
educationRouter.delete('/:id', authMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteEducation(id);

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Data pendidikan tidak ditemukan' });
      return;
    }

    res.json({ success: true, message: 'Data pendidikan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal menghapus data pendidikan' });
  }
});

// Admin: reorder education
educationRouter.post('/reorder', authMiddleware, (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      res.status(400).json({ success: false, error: 'Array orderedIds wajib disediakan' });
      return;
    }

    const reordered = db.reorderEducation(orderedIds);
    res.json({ success: true, message: 'Urutan pendidikan berhasil diperbarui', data: reordered });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal memperbarui urutan pendidikan' });
  }
});

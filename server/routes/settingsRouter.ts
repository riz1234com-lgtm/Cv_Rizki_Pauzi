import { Router, Request, Response } from 'express';
import { db } from '../db';
import { authMiddleware } from '../auth';

export const settingsRouter = Router();

// Public: get site settings
settingsRouter.get('/', (req: Request, res: Response) => {
  try {
    const settings = db.getSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal mengambil pengaturan website' });
  }
});

// Admin: update site settings
settingsRouter.put('/', authMiddleware, (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const updated = db.updateSettings(updates);
    res.json({ success: true, message: 'Pengaturan website berhasil disimpan', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal menyimpan pengaturan' });
  }
});

// Admin: get dashboard statistics overview
settingsRouter.get('/stats', authMiddleware, (req: Request, res: Response) => {
  try {
    const stats = db.getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal mengambil statistik dashboard' });
  }
});

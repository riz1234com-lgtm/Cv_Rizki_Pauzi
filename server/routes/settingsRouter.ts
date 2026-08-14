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

// Admin: Export complete database backup JSON
settingsRouter.get('/backup', authMiddleware, (req: Request, res: Response) => {
  try {
    const fullDb = db.getFullDatabase();
    // Exclude password hash for safety when exporting
    const { admin, ...safeExport } = fullDb;
    res.json({
      success: true,
      exportedAt: new Date().toISOString(),
      data: {
        admin: {
          email: admin.email,
          name: admin.name
        },
        ...safeExport
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal mengekspor backup database' });
  }
});

// Admin: Restore database from JSON
settingsRouter.post('/restore', authMiddleware, (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    if (!data) {
      res.status(400).json({ success: false, error: 'Data JSON backup tidak valid' });
      return;
    }
    const updatedDb = db.importFullDatabase(data);
    res.json({ success: true, message: 'Database berhasil dipulihkan dari backup!', data: updatedDb });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal memulihkan database dari backup' });
  }
});

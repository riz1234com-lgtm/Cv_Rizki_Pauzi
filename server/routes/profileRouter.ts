import { Router, Request, Response } from 'express';
import { db } from '../db';
import { authMiddleware } from '../auth';

export const profileRouter = Router();

// Public: get profile
profileRouter.get('/', (req: Request, res: Response) => {
  try {
    const profile = db.getProfile();
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal mengambil data profil' });
  }
});

// Admin: update profile
profileRouter.put('/', authMiddleware, (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const updated = db.updateProfile(updates);
    res.json({ success: true, message: 'Profil berhasil diperbarui', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal memperbarui profil' });
  }
});

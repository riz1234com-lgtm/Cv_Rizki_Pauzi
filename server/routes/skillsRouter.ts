import { Router, Request, Response } from 'express';
import { db } from '../db';
import { authMiddleware } from '../auth';

export const skillsRouter = Router();

// Public: get all skills
skillsRouter.get('/', (req: Request, res: Response) => {
  try {
    const list = db.getSkills();
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal mengambil data skills' });
  }
});

// Admin: add skill
skillsRouter.post('/', authMiddleware, (req: Request, res: Response) => {
  try {
    const { name, category, proficiency, levelLabel, icon, description, order } = req.body;

    if (!name) {
      res.status(400).json({ success: false, error: 'Nama skill wajib diisi' });
      return;
    }

    const newItem = db.addSkill({
      name,
      category: category || 'Other Skills',
      proficiency: typeof proficiency === 'number' ? Math.min(100, Math.max(0, proficiency)) : 80,
      levelLabel: levelLabel || 'Intermediate',
      icon: icon || 'Code',
      description: description || '',
      order: typeof order === 'number' ? order : 0
    });

    res.json({ success: true, message: 'Skill berhasil ditambahkan', data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal menambahkan skill' });
  }
});

// Admin: update skill
skillsRouter.put('/:id', authMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = db.updateSkill(id, updates);

    if (!updated) {
      res.status(404).json({ success: false, error: 'Skill tidak ditemukan' });
      return;
    }

    res.json({ success: true, message: 'Skill berhasil diperbarui', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal memperbarui skill' });
  }
});

// Admin: delete skill
skillsRouter.delete('/:id', authMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteSkill(id);

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Skill tidak ditemukan' });
      return;
    }

    res.json({ success: true, message: 'Skill berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal menghapus skill' });
  }
});

// Admin: reorder skills
skillsRouter.post('/reorder', authMiddleware, (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      res.status(400).json({ success: false, error: 'Array orderedIds wajib disediakan' });
      return;
    }

    const reordered = db.reorderSkills(orderedIds);
    res.json({ success: true, message: 'Urutan skill berhasil diperbarui', data: reordered });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal memperbarui urutan skill' });
  }
});

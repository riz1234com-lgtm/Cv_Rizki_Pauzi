import { Router, Request, Response } from 'express';
import { db } from '../db';
import { authMiddleware } from '../auth';

export const projectsRouter = Router();

// Public: get published projects
projectsRouter.get('/', (req: Request, res: Response) => {
  try {
    const list = db.getProjects(true);
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal mengambil data project' });
  }
});

// Admin: get all projects (including unpublished)
projectsRouter.get('/all', authMiddleware, (req: Request, res: Response) => {
  try {
    const list = db.getProjects(false);
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal mengambil data project admin' });
  }
});

// Admin: add project
projectsRouter.post('/', authMiddleware, (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      longDescription,
      thumbnailUrl,
      category,
      technologies,
      demoUrl,
      githubUrl,
      featured,
      isPublished,
      order
    } = req.body;

    if (!title) {
      res.status(400).json({ success: false, error: 'Judul project wajib diisi' });
      return;
    }

    const newItem = db.addProject({
      title,
      description: description || '',
      longDescription: longDescription || '',
      thumbnailUrl: thumbnailUrl || '',
      category: category || 'Web',
      technologies: Array.isArray(technologies) ? technologies : [],
      demoUrl: demoUrl || '',
      githubUrl: githubUrl || '',
      featured: Boolean(featured),
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      order: typeof order === 'number' ? order : 0
    });

    res.json({ success: true, message: 'Project berhasil ditambahkan', data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal menambahkan project' });
  }
});

// Admin: update project
projectsRouter.put('/:id', authMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = db.updateProject(id, updates);

    if (!updated) {
      res.status(404).json({ success: false, error: 'Project tidak ditemukan' });
      return;
    }

    res.json({ success: true, message: 'Project berhasil diperbarui', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal memperbarui project' });
  }
});

// Admin: delete project
projectsRouter.delete('/:id', authMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteProject(id);

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Project tidak ditemukan' });
      return;
    }

    res.json({ success: true, message: 'Project berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal menghapus project' });
  }
});

// Admin: reorder projects
projectsRouter.post('/reorder', authMiddleware, (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      res.status(400).json({ success: false, error: 'Array orderedIds wajib disediakan' });
      return;
    }

    const reordered = db.reorderProjects(orderedIds);
    res.json({ success: true, message: 'Urutan project berhasil diperbarui', data: reordered });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal memperbarui urutan project' });
  }
});

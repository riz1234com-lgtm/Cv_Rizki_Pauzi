import { Router, Request, Response } from 'express';
import { db } from '../db';
import { authMiddleware } from '../auth';

export const galleryRouter = Router();

// Public: get published gallery items
galleryRouter.get('/', (req: Request, res: Response) => {
  try {
    const list = db.getGallery(true);
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal mengambil data galeri' });
  }
});

// Admin: get all gallery items
galleryRouter.get('/all', authMiddleware, (req: Request, res: Response) => {
  try {
    const list = db.getGallery(false);
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal mengambil data galeri admin' });
  }
});

// Admin: add gallery item
galleryRouter.post('/', authMiddleware, (req: Request, res: Response) => {
  try {
    const { title, caption, imageUrl, category, isPublished, order } = req.body;

    if (!imageUrl) {
      res.status(400).json({ success: false, error: 'Foto/Gambar wajib diunggah atau memiliki URL' });
      return;
    }

    const newItem = db.addGalleryItem({
      title: title || 'Dokumentasi',
      caption: caption || '',
      imageUrl,
      category: category || 'Dokumentasi',
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      order: typeof order === 'number' ? order : 0
    });

    res.json({ success: true, message: 'Item galeri berhasil ditambahkan', data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal menambahkan item galeri' });
  }
});

// Admin: update gallery item
galleryRouter.put('/:id', authMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = db.updateGalleryItem(id, updates);

    if (!updated) {
      res.status(404).json({ success: false, error: 'Item galeri tidak ditemukan' });
      return;
    }

    res.json({ success: true, message: 'Item galeri berhasil diperbarui', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal memperbarui item galeri' });
  }
});

// Admin: delete gallery item
galleryRouter.delete('/:id', authMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteGalleryItem(id);

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Item galeri tidak ditemukan' });
      return;
    }

    res.json({ success: true, message: 'Item galeri berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Gagal menghapus item galeri' });
  }
});

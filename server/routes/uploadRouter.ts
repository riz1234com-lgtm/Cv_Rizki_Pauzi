import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authMiddleware } from '../auth';

export const uploadRouter = Router();

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${sanitized}-${uniqueSuffix}${ext}`);
  }
});

const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format file tidak didukung. Harap unggah JPG, PNG, WEBP, atau SVG.'));
    }
  }
});

// Single file upload endpoint
uploadRouter.post('/single', authMiddleware, (req: Request, res: Response): void => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ success: false, error: 'Ukuran file melebihi batas maksimum 5MB' });
        return;
      }
      res.status(400).json({ success: false, error: `Upload error: ${err.message}` });
      return;
    } else if (err) {
      res.status(400).json({ success: false, error: err.message || 'Gagal mengunggah file' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ success: false, error: 'Tidak ada file yang diunggah' });
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      message: 'File berhasil diunggah',
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  });
});

// Multiple file upload endpoint
uploadRouter.post('/multiple', authMiddleware, (req: Request, res: Response): void => {
  upload.array('files', 10)(req, res, (err) => {
    if (err) {
      res.status(400).json({ success: false, error: err.message || 'Gagal mengunggah beberapa file' });
      return;
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ success: false, error: 'Tidak ada file yang diunggah' });
      return;
    }

    const results = files.map((file) => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      size: file.size
    }));

    res.json({
      success: true,
      message: `${files.length} file berhasil diunggah`,
      files: results
    });
  });
});

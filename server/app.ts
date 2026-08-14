import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

import { loginHandler, getMeHandler, changePasswordHandler, updateAccountHandler, authMiddleware } from './auth';
import { profileRouter } from './routes/profileRouter';
import { educationRouter } from './routes/educationRouter';
import { skillsRouter } from './routes/skillsRouter';
import { projectsRouter } from './routes/projectsRouter';
import { galleryRouter } from './routes/galleryRouter';
import { certificatesRouter } from './routes/certificatesRouter';
import { messagesRouter } from './routes/messagesRouter';
import { settingsRouter } from './routes/settingsRouter';
import { uploadRouter } from './routes/uploadRouter';

export function createExpressApp() {
  const app = express();

  // Body parsers
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Ensure uploads directory exists and serve statically
  const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL;
  const uploadsDir = isVercel ? path.join('/tmp', 'uploads') : path.join(process.cwd(), 'uploads');
  const rootUploadsDir = path.join(process.cwd(), 'uploads');

  if (!fs.existsSync(uploadsDir)) {
    try {
      fs.mkdirSync(uploadsDir, { recursive: true });
    } catch (e) {
      console.warn('Could not create uploads directory:', e);
    }
  }
  app.use('/uploads', express.static(uploadsDir));
  if (isVercel && fs.existsSync(rootUploadsDir)) {
    app.use('/uploads', express.static(rootUploadsDir));
  }

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Rizki Pauzi Portfolio & CMS API',
      timestamp: new Date().toISOString(),
      environment: isVercel ? 'Vercel Serverless' : 'Node.js Container'
    });
  });

  // Authentication API endpoints
  app.post('/api/auth/login', loginHandler);
  app.get('/api/auth/me', authMiddleware, getMeHandler);
  app.post('/api/auth/change-password', authMiddleware, changePasswordHandler);
  app.put('/api/auth/account', authMiddleware, updateAccountHandler);

  // Content API Routers
  app.use('/api/profile', profileRouter);
  app.use('/api/education', educationRouter);
  app.use('/api/skills', skillsRouter);
  app.use('/api/projects', projectsRouter);
  app.use('/api/gallery', galleryRouter);
  app.use('/api/certificates', certificatesRouter);
  app.use('/api/messages', messagesRouter);
  app.use('/api/settings', settingsRouter);
  app.use('/api/upload', uploadRouter);

  return app;
}

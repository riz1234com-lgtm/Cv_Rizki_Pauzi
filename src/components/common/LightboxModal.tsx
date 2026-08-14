import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Download } from 'lucide-react';
import { resolveImageUrl, DEFAULT_FALLBACK_THUMBNAIL } from '../../lib/imageHelper';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  caption?: string;
  category?: string;
  externalUrl?: string;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  caption,
  category,
  externalUrl
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative max-w-4xl w-full bg-slate-900/90 border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/95">
            <div className="flex items-center gap-3">
              {category && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {category}
                </span>
              )}
              <h3 className="text-base md:text-lg font-semibold text-white truncate max-w-md">{title}</h3>
            </div>
            <div className="flex items-center gap-2">
              {externalUrl && (
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Buka Tautan"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Image container */}
          <div className="flex-1 overflow-auto bg-slate-950 flex items-center justify-center p-4 min-h-[300px]">
            <img
              src={resolveImageUrl(imageUrl)}
              alt={title}
              className="max-h-[60vh] max-w-full object-contain rounded-lg"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = DEFAULT_FALLBACK_THUMBNAIL;
              }}
            />
          </div>

          {/* Caption */}
          {caption && (
            <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/95 text-sm text-slate-300">
              {caption}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

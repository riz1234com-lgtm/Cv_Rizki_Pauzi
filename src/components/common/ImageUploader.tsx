import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Trash2, CheckCircle2, AlertCircle, Link as LinkIcon, Loader2, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto';
  helperText?: string;
  placeholder?: string;
  accept?: string;
  maxSizeMB?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  aspectRatio = 'square',
  helperText = 'Format: JPG, PNG, WEBP, GIF. Ukuran maks 5MB.',
  placeholder = 'https://... atau unggah dari perangkat',
  accept = 'image/png, image/jpeg, image/jpg, image/webp, image/gif, image/svg+xml',
  maxSizeMB = 5
}) => {
  const { success, error } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleProcessFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      error('Harap pilih berkas gambar yang valid');
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      error(`Ukuran file melebihi batas ${maxSizeMB}MB`);
      return;
    }

    setIsUploading(true);

    try {
      // Direct server upload
      try {
        const res = await api.uploadFile(file);
        if (res && res.url) {
          onChange(res.url);
          success('Foto berhasil diunggah!');
          setIsUploading(false);
          return;
        }
      } catch (uploadErr) {
        console.warn('Direct upload endpoint failed, falling back to Base64 data conversion:', uploadErr);
      }

      // Fallback: Read as High-Quality Base64 Data URL (ensures image saving works even if server storage is offline or on static hosting)
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        if (base64Url) {
          onChange(base64Url);
          success('Foto berhasil diproses dan disimpan!');
        }
        setIsUploading(false);
      };
      reader.onerror = () => {
        error('Gagal membaca file foto');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      error(err.message || 'Gagal memproses foto');
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
    // Reset file input so selecting the same file triggers change again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square max-h-48 max-w-48';
      case 'video':
        return 'aspect-video w-full max-h-52';
      case 'wide':
        return 'aspect-[21/9] w-full max-h-48';
      case 'auto':
      default:
        return 'min-h-36 w-full';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-300">
          {label} <span className="text-cyan-400">*</span>
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Sembunyikan Input Link' : 'Gunakan Link URL'}</span>
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept={accept}
        className="hidden"
      />

      {/* Upload Zone & Drag and Drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed transition-all p-4 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden ${
          isDragging
            ? 'border-cyan-400 bg-cyan-950/30'
            : value
            ? 'border-slate-700 bg-slate-950/60 hover:border-cyan-500/60'
            : 'border-slate-800 bg-slate-950/80 hover:border-cyan-500/40 hover:bg-slate-900/60'
        }`}
      >
        {value ? (
          <div className="relative group w-full flex flex-col items-center">
            <div className={`${getAspectClass()} rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md relative flex items-center justify-center`}>
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                <span className="px-3 py-1.5 rounded-lg bg-cyan-500 text-[#05070A] text-xs font-bold shadow">
                  Klik untuk Ganti Foto
                </span>
                <span className="text-[10px] text-slate-300">atau Drag & Drop foto baru</span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ganti Foto</span>
              </button>

              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-4 px-2 space-y-2 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Upload className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                Klik untuk unggah foto <span className="text-slate-400 font-normal">atau tarik file ke sini</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 font-light">{helperText}</p>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10">
            <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
            <span className="text-xs font-semibold text-cyan-300">Sedang memproses foto...</span>
          </div>
        )}
      </div>

      {/* Direct URL Input toggle if user prefers pasting link */}
      {showUrlInput && (
        <div className="pt-1 flex items-center gap-2 animate-in fade-in duration-150">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-cyan-500 text-xs text-white outline-none"
          />
        </div>
      )}
    </div>
  );
};

import React, { useState, useRef } from 'react';
import {
  Download,
  FileText,
  Image as ImageIcon,
  Check,
  X,
  Sparkles,
  Layers,
  GraduationCap,
  Briefcase,
  Award,
  Mail,
  Phone,
  MapPin,
  Globe,
  Loader2,
  Sliders,
  Maximize2
} from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import type {
  UserProfile,
  EducationItem,
  SkillItem,
  ProjectItem,
  CertificateItem
} from '../../types/index';

interface PortfolioExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  educationList: EducationItem[];
  skillsList: SkillItem[];
  projectsList: ProjectItem[];
  certificatesList: CertificateItem[];
}

export const PortfolioExportModal: React.FC<PortfolioExportModalProps> = ({
  isOpen,
  onClose,
  profile,
  educationList,
  skillsList,
  projectsList,
  certificatesList
}) => {
  const [templateTheme, setTemplateTheme] = useState<'clean' | 'dark'>('dark');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<string>('');
  
  // Section filters
  const [includeBio, setIncludeBio] = useState(true);
  const [includeEducation, setIncludeEducation] = useState(true);
  const [includeSkills, setIncludeSkills] = useState(true);
  const [includeProjects, setIncludeProjects] = useState(true);
  const [includeCertificates, setIncludeCertificates] = useState(true);
  const [includeContact, setIncludeContact] = useState(true);

  const previewCardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Filter published / sorted items
  const sortedEducation = [...educationList].sort((a, b) => a.order - b.order);
  const sortedSkills = [...skillsList].sort((a, b) => a.order - b.order);
  const publishedProjects = projectsList.filter(p => p.isPublished).sort((a, b) => a.order - b.order);
  const sortedCertificates = [...certificatesList].sort((a, b) => a.order - b.order);

  const handleExport = async (format: 'pdf' | 'png' | 'jpg') => {
    if (!previewCardRef.current) return;
    setIsGenerating(true);
    setGenerationProgress(`Menyiapkan data portofolio (${format.toUpperCase()})...`);

    try {
      // Allow DOM to settle
      await new Promise((r) => setTimeout(r, 100));

      const element = previewCardRef.current;
      setGenerationProgress('Merender grafis & tipografi...');

      // Safe clone and canvas capture
      const canvas = await html2canvas(element, {
        scale: 2, // Retina quality
        useCORS: true,
        allowTaint: false, // Critical: must be false so toDataURL() does not throw SecurityError
        backgroundColor: templateTheme === 'dark' ? '#070A10' : '#FFFFFF',
        logging: false,
        imageTimeout: 5000,
        ignoreElements: (element) => {
          // Ignore non-renderable or troublesome elements if any
          return false;
        },
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('portfolio-export-target');
          if (clonedElement) {
            clonedElement.style.transform = 'none';
            clonedElement.style.borderRadius = '0px';
          }
          // Remove any problematic cross-origin images that might taint if they fail
          const clonedImgs = clonedDoc.querySelectorAll('img');
          clonedImgs.forEach((img) => {
            img.crossOrigin = 'anonymous';
          });
        }
      });

      const sanitizedName = (profile.name || 'Rizki_Pauzi').replace(/\s+/g, '_');
      const timestamp = new Date().toISOString().slice(0, 10);

      if (format === 'png' || format === 'jpg') {
        setGenerationProgress('Menyimpan berkas gambar...');
        const imageType = format === 'png' ? 'image/png' : 'image/jpeg';
        const imageQuality = format === 'png' ? 1.0 : 0.95;
        
        let dataUrl: string;
        try {
          dataUrl = canvas.toDataURL(imageType, imageQuality);
        } catch (canvasErr) {
          console.warn('Canvas toDataURL failed, attempting blob fallback:', canvasErr);
          // Fallback via toBlob
          const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, imageType, imageQuality));
          if (!blob) throw new Error('Gagal mengonversi grafis ke format gambar.');
          dataUrl = URL.createObjectURL(blob);
        }

        const downloadLink = document.createElement('a');
        downloadLink.href = dataUrl;
        downloadLink.download = `Portfolio_${sanitizedName}_${timestamp}.${format}`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } else if (format === 'pdf') {
        setGenerationProgress('Menyusun lembar PDF dokumen resmi...');
        
        let imgData: string;
        try {
          imgData = canvas.toDataURL('image/jpeg', 0.95);
        } catch (pdfErr) {
          const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.95));
          if (!blob) throw new Error('Gagal menyiapkan gambar untuk PDF.');
          imgData = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        }

        // Standard A4 dimensions in mm
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
          heightLeft -= pageHeight;
        }

        pdf.save(`Portfolio_${sanitizedName}_${timestamp}.pdf`);
      }

      setGenerationProgress('Selesai! Berkas berhasil diunduh.');
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress('');
      }, 1200);
    } catch (err) {
      console.error('Export error details:', err);
      // Fallback: If canvas export encounters strict browser sandbox restrictions, generate a structured PDF document directly using jsPDF text/table API
      try {
        setGenerationProgress('Menggunakan mode ekspor alternatif...');
        const sanitizedName = (profile.name || 'Rizki_Pauzi').replace(/\s+/g, '_');
        const timestamp = new Date().toISOString().slice(0, 10);
        
        if (format === 'pdf') {
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });

          let yPos = 20;
          pdf.setFontSize(20);
          pdf.setTextColor(14, 116, 144);
          pdf.text(profile.name || 'Rizki Pauzi', 20, yPos);
          
          yPos += 8;
          pdf.setFontSize(12);
          pdf.setTextColor(71, 85, 105);
          pdf.text(profile.headline || 'Digital Portfolio & Academic Journey', 20, yPos);

          yPos += 6;
          pdf.setFontSize(10);
          pdf.setTextColor(100, 116, 139);
          pdf.text(`${profile.educationStatusSummary || 'Universitas Pendidikan Indonesia (UPI)'} • ${profile.location || 'Indonesia'}`, 20, yPos);

          if (profile.email || profile.website) {
            yPos += 5;
            pdf.text(`Email: ${profile.email || '-'} | Website: ${profile.website || '-'}`, 20, yPos);
          }

          yPos += 12;
          pdf.setDrawColor(200, 200, 200);
          pdf.line(20, yPos, 190, yPos);

          if (includeBio && (profile.about || profile.bio)) {
            yPos += 10;
            pdf.setFontSize(13);
            pdf.setTextColor(15, 23, 42);
            pdf.text('Tentang & Ringkasan Profil', 20, yPos);
            yPos += 6;
            pdf.setFontSize(9.5);
            pdf.setTextColor(71, 85, 105);
            const bioLines = pdf.splitTextToSize(profile.about || profile.bio || '', 170);
            pdf.text(bioLines, 20, yPos);
            yPos += bioLines.length * 5 + 4;
          }

          if (includeEducation && sortedEducation.length > 0) {
            yPos += 6;
            pdf.setFontSize(13);
            pdf.setTextColor(15, 23, 42);
            pdf.text('Riwayat Pendidikan', 20, yPos);
            yPos += 6;
            pdf.setFontSize(10);
            sortedEducation.forEach(edu => {
              pdf.setTextColor(15, 23, 42);
              pdf.text(`• ${edu.institution} (${edu.startYear} - ${edu.endYear})`, 22, yPos);
              yPos += 5;
              pdf.setTextColor(100, 116, 139);
              pdf.setFontSize(9);
              pdf.text(`   ${edu.level} ${edu.description ? `- ${edu.description}` : ''}`, 22, yPos);
              yPos += 6;
              pdf.setFontSize(10);
            });
          }

          if (includeSkills && sortedSkills.length > 0) {
            yPos += 4;
            pdf.setFontSize(13);
            pdf.setTextColor(15, 23, 42);
            pdf.text('Keahlian & Kemampuan', 20, yPos);
            yPos += 6;
            pdf.setFontSize(9.5);
            pdf.setTextColor(71, 85, 105);
            const skillsText = sortedSkills.map(s => `${s.name} (${s.levelLabel || s.proficiency + '%'})`).join('  •  ');
            const skillLines = pdf.splitTextToSize(skillsText, 170);
            pdf.text(skillLines, 20, yPos);
            yPos += skillLines.length * 5 + 4;
          }

          pdf.save(`Portfolio_${sanitizedName}_${timestamp}.pdf`);
          setGenerationProgress('Selesai via mode dokumen terstruktur!');
        } else {
          // If image failed, print window or alert gracefully
          window.print();
        }
      } catch (fallbackErr) {
        console.error('Fallback export error:', fallbackErr);
        alert('Tidak dapat mengunduh berkas secara otomatis. Anda dapat menggunakan fitur Cetak / Print dokumen browser.');
      }
      setIsGenerating(false);
      setGenerationProgress('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#0B101B] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-[#0F172A]/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Unduh Portofolio & CV</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                  Data Real-Time
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-light">
                Ekspor berkas terstruktur dalam format PDF Dokumen atau Gambar High-Res (PNG/JPG).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left controls & Right Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 overflow-y-auto flex-1">
          {/* Controls Column (Left) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {/* Theme Selector */}
            <div className="p-4 rounded-xl bg-[#070A10] border border-white/5 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Pilih Gaya Tampilan</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTemplateTheme('dark')}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    templateTheme === 'dark'
                      ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-500/20'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-[#070A10] border border-cyan-400" />
                  <span>Cyber Dark</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTemplateTheme('clean')}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    templateTheme === 'clean'
                      ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-500/20'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-white border border-slate-300" />
                  <span>Clean Print</span>
                </button>
              </div>
            </div>

            {/* Content Filters */}
            <div className="p-4 rounded-xl bg-[#070A10] border border-white/5 space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-1">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Bagian Data yang Disertakan</span>
              </label>

              {[
                { label: 'Ringkasan Profil & Bio', state: includeBio, setter: setIncludeBio },
                { label: 'Riwayat Pendidikan (UPI dsb.)', state: includeEducation, setter: setIncludeEducation },
                { label: 'Keahlian & Kemampuan', state: includeSkills, setter: setIncludeSkills },
                { label: 'Proyek Unggulan', state: includeProjects, setter: setIncludeProjects },
                { label: 'Sertifikat & Penghargaan', state: includeCertificates, setter: setIncludeCertificates },
                { label: 'Kontak & Tautan Sosial', state: includeContact, setter: setIncludeContact },
              ].map((item, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={item.state}
                    onChange={(e) => item.setter(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-cyan-500"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>

            {/* Download Buttons */}
            <div className="p-4 rounded-xl bg-gradient-to-b from-[#0F172A] to-[#070A10] border border-cyan-500/20 space-y-2.5">
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Format Unduhan</span>
              </p>

              <button
                type="button"
                disabled={isGenerating}
                onClick={() => handleExport('pdf')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-[#05070A] font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4" />
                  <span>Unduh Dokumen PDF (.pdf)</span>
                </div>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/20">A4 Doc</span>
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={() => handleExport('png')}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Gambar PNG</span>
                </button>

                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={() => handleExport('jpg')}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Gambar JPG</span>
                </button>
              </div>

              {isGenerating && (
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-2.5 text-xs text-cyan-300 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400 shrink-0" />
                  <span>{generationProgress || 'Sedang memproses...'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Live Preview Area */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                Pratinjau Hasil Dokumen / Grafis
              </span>
              <span className="text-[11px] text-slate-500">Resolusi Retina (2x)</span>
            </div>

            {/* Target element to capture */}
            <div className="rounded-2xl border border-white/10 p-2 sm:p-4 bg-black/40 overflow-x-auto shadow-inner flex justify-center">
              <div
                id="portfolio-export-target"
                ref={previewCardRef}
                className={`w-full max-w-[680px] p-6 sm:p-8 rounded-xl transition-colors duration-200 ${
                  templateTheme === 'dark'
                    ? 'bg-[#070A10] text-slate-200 border border-white/10'
                    : 'bg-white text-slate-900 border border-slate-200 shadow-xl'
                }`}
              >
                {/* Header Profile */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pb-6 border-b border-cyan-500/20">
                  <div className="flex items-center gap-4">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={profile.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-cyan-400 shadow-md"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-2xl shadow-md">
                        {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'RP'}
                      </div>
                    )}

                    <div>
                      <h1 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${templateTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {profile.name || 'Rizki Pauzi'}
                      </h1>
                      <p className="text-xs sm:text-sm font-semibold text-cyan-500 mt-0.5">
                        {profile.headline || 'Digital Portfolio & Academic Journey'}
                      </p>
                      <p className={`text-[11px] mt-1 font-light ${templateTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                        {profile.educationStatusSummary || 'Universitas Pendidikan Indonesia (UPI)'}
                      </p>
                    </div>
                  </div>

                  <div className={`text-right text-[11px] space-y-1 font-light ${templateTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    {profile.location && (
                      <div className="flex items-center gap-1.5 justify-end">
                        <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    {profile.email && (
                      <div className="flex items-center gap-1.5 justify-end">
                        <Mail className="w-3.5 h-3.5 text-cyan-500" />
                        <span>{profile.email}</span>
                      </div>
                    )}
                    {profile.website && (
                      <div className="flex items-center gap-1.5 justify-end">
                        <Globe className="w-3.5 h-3.5 text-cyan-500" />
                        <span>{profile.website}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* About / Bio */}
                {includeBio && (profile.about || profile.bio) && (
                  <div className="py-4 border-b border-cyan-500/10">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-500 mb-1.5 flex items-center gap-1.5">
                      <span>Tentang & Ringkasan Profil</span>
                    </h3>
                    <p className={`text-xs leading-relaxed font-light ${templateTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      {profile.about || profile.bio}
                    </p>
                  </div>
                )}

                {/* Education Section */}
                {includeEducation && sortedEducation.length > 0 && (
                  <div className="py-4 border-b border-cyan-500/10">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-500 mb-3 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4" />
                      <span>Riwayat Pendidikan</span>
                    </h3>
                    <div className="space-y-2.5">
                      {sortedEducation.map((edu) => (
                        <div key={edu.id} className="flex items-start justify-between text-xs">
                          <div>
                            <p className={`font-bold ${templateTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {edu.institution}
                            </p>
                            <p className={`text-[11px] font-light ${templateTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                              {edu.level} {edu.description ? `— ${edu.description}` : ''}
                            </p>
                          </div>
                          <span className="text-[11px] font-mono font-medium text-cyan-500 shrink-0 ml-3">
                            {edu.startYear} - {edu.endYear}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {includeSkills && sortedSkills.length > 0 && (
                  <div className="py-4 border-b border-cyan-500/10">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-500 mb-2.5 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Keahlian & Kompetensi</span>
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {sortedSkills.map((sk) => (
                        <span
                          key={sk.id}
                          className={`text-[11px] px-2.5 py-1 rounded-md font-medium ${
                            templateTheme === 'dark'
                              ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                              : 'bg-slate-100 text-slate-800 border border-slate-200'
                          }`}
                        >
                          {sk.name} <span className="opacity-60 text-[10px]">({sk.levelLabel || `${sk.proficiency}%`})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Featured Projects */}
                {includeProjects && publishedProjects.length > 0 && (
                  <div className="py-4 border-b border-cyan-500/10">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-500 mb-2.5 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" />
                      <span>Proyek & Karya Pilihan</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {publishedProjects.slice(0, 4).map((proj) => (
                        <div
                          key={proj.id}
                          className={`p-2.5 rounded-lg border text-xs ${
                            templateTheme === 'dark'
                              ? 'bg-[#0F172A]/50 border-white/5 text-slate-300'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <p className={`font-bold ${templateTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {proj.title}
                          </p>
                          <p className="text-[11px] line-clamp-2 mt-0.5 font-light opacity-80">
                            {proj.description}
                          </p>
                          {proj.technologies && proj.technologies.length > 0 && (
                            <p className="text-[10px] text-cyan-500 mt-1 font-mono">
                              {proj.technologies.slice(0, 3).join(' • ')}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certificates */}
                {includeCertificates && sortedCertificates.length > 0 && (
                  <div className="py-4 border-b border-cyan-500/10">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-500 mb-2 flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      <span>Sertifikasi & Penghargaan</span>
                    </h3>
                    <div className="space-y-1.5 text-xs">
                      {sortedCertificates.slice(0, 4).map((cert) => (
                        <div key={cert.id} className="flex items-center justify-between text-[11px]">
                          <span className={`font-medium ${templateTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {cert.title} <span className="opacity-60">({cert.institution})</span>
                          </span>
                          <span className="font-mono text-cyan-500">{cert.year}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Footer in Document */}
                {includeContact && (
                  <div className="pt-4 flex flex-wrap items-center justify-between gap-2 text-[10px] opacity-70">
                    <span>Dokumen Portofolio Resmi • {profile.name || 'Rizki Pauzi'}</span>
                    <span>Tervalidasi Digital • {new Date().getFullYear()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer info modal */}
        <div className="px-5 py-3 border-t border-white/10 bg-[#0F172A]/50 flex items-center justify-between text-xs text-slate-400">
          <span>Format didukung: PDF A4 Standar, PNG Transparan/High-Res, JPG Siap Cetak.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-medium transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

# 🌐 Portfolio & CMS — Rizki Pauzi

[![CI Build Check](https://github.com/USERNAME/portfolio-rizki-pauzi/actions/workflows/ci.yml/badge.svg)](https://github.com)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Website Portofolio Resmi dan Sistem Manajemen Konten (CMS) terintegrasi untuk **Rizki Pauzi** — Mahasiswa Aktif Universitas Pendidikan Indonesia (UPI).

---

## ✨ Fitur Utama

- 🎓 **Riwayat Pendidikan Lengkap**: SDN Sukahati 2, SMP Mekar Arum, SMK Medikacom, dan Universitas Pendidikan Indonesia (UPI).
- 🛠️ **Skill & Kemampuan**: Visualisasi keahlian interaktif dengan persentase dan kategori.
- 🚀 **Showcase Proyek & Karya**: Menampilkan proyek aplikasi web, deskripsi, teknologi, serta tautan demo.
- 📸 **Galeri Dokumentasi & Kegiatan**: Galeri foto kegiatan, magang/PKL di Dinas Pemuda & Olahraga, dan aktivitas olahraga.
- 🏆 **Sertifikat & Lisensi**: Sertifikasi terverifikasi dari Dinas Pendidikan & Disnaker.
- 💬 **Form Pesan & Kontak Cepat**: Integrasi langsung ke WhatsApp (`+6289525052023`) dan Email (`rizkipauzi28@upi.edu`).
- 🔐 **Admin Portal & CMS Lengkap**: Kelola seluruh konten portofolio secara dinamis tanpa perlu edit kodingan.
- 💾 **Manajemen Database & Backup JSON**: Fitur ekspor dan impor database cadangan langsung dari panel admin.
- 📱 **Fully Responsive & Dark Luxe UI**: Desain modern dengan animasi halus (`motion`) dan performa tinggi.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion (Framer Motion), Lucide React.
- **Backend**: Node.js, Express, Multer (File Upload), JSON Web Token (JWT), BcryptJS.
- **Database & Storage**: Flat-file JSON Database (`data/database.json`) & Local/Serverless File Storage.
- **Build Tool**: Vite 6, esbuild.

---

## 🚀 Panduan Menjalankan di Lokal (Local Development)

### 1. Clone Repository
```bash
git clone https://github.com/USERNAME/portfolio-rizki-pauzi.git
cd portfolio-rizki-pauzi
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Salin file `.env.example` ke `.env`:
```bash
cp .env.example .env
```

### 4. Jalankan Dev Server
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

### 5. Build untuk Produksi
```bash
npm run build
npm run start
```

---

## 📦 Panduan Push ke GitHub & Deploy ke Vercel

### Push ke GitHub
```bash
git init
git add .
git commit -m "feat: inisialisasi portfolio rizki pauzi"
git branch -M main
git remote add origin https://github.com/USERNAME_ANDA/portfolio-rizki-pauzi.git
git push -u origin main
```

### Deploy ke Vercel (1-Click)
1. Buka [vercel.com](https://vercel.com) dan hubungkan akun GitHub Anda.
2. Impor repository `portfolio-rizki-pauzi`.
3. Konfigurasi build:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Tambahkan Environment Variable di Vercel:
   - `JWT_SECRET` = `kunci_rahasia_anda_yang_aman_123`
   - `NODE_ENV` = `production`
5. Klik **Deploy**!

---

## 👨‍💻 Kredensial Akses CMS Admin

- **URL Admin**: Buka website lalu klik tombol **Admin CMS** di footer atau navigasi ke `#admin`.
- **Default Email**: `admin@rizkipauzi.com` *(atau username: `admin`)*
- **Default Password**: `AdminPassword2026!` *(atau `admin123`)*

> *Tips: Anda dapat mengubah password dan data akun kapan saja melalui menu **Admin > Pengaturan**.*

---

## 📄 Lisensi
Hak Cipta © 2026 [Rizki Pauzi](https://github.com). Dilisensikan di bawah [MIT License](LICENSE).

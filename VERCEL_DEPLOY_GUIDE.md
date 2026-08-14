# 🚀 Panduan Lengkap Deploy Website Portofolio ke Vercel

Panduan ini berisi panduan langkah-demi-langkah yang mudah dan praktis untuk men-deploy website portofolio Rizki Pauzi ke **Vercel**.

Konfigurasi Vercel sudah disiapkan secara otomatis di dalam proyek ini:
- `vercel.json`: Mengatur rewrite SPA React dan routing API Serverless.
- `api/index.ts`: Menjalankan API backend Express & database secara Serverless di edge Vercel.
- `.env.example`: Berisi variabel lingkungan yang diperlukan.

---

## 🌟 Opsi 1: Deploy Otomatis via GitHub (Paling Direkomendasikan & Gratis)

### Langkah 1: Push Proyek ke GitHub
Jika belum di-push ke GitHub:
1. Buat repository baru di [GitHub](https://github.com/new) (misal: `portfolio-rizki-pauzi`).
2. Di terminal komputer Anda, jalankan perintah:
```bash
git init
git add .
git commit -m "feat: portfolio siap deploy ke vercel"
git branch -M main
git remote add origin https://github.com/USERNAME_ANDA/portfolio-rizki-pauzi.git
git push -u origin main
```

### Langkah 2: Hubungkan ke Vercel
1. Buka [vercel.com](https://vercel.com) dan login menggunakan akun GitHub Anda.
2. Klik tombol **"Add New..."** lalu pilih **"Project"**.
3. Cari repository GitHub `portfolio-rizki-pauzi` yang baru saja Anda buat, lalu klik **"Import"**.
4. Di bagian **Configure Project**:
   - **Framework Preset**: Pilih `Vite` (atau biarkan otomatis terdeteksi).
   - **Root Directory**: `./` (biarkan default).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. *(Penting)* Buka bagian **Environment Variables** dan tambahkan:
   - `JWT_SECRET` = `kunci_rahasia_anda_yang_aman_123` (atau string acak untuk keamanan token login admin)
   - `NODE_ENV` = `production`
6. Klik tombol **"Deploy"**.
7. Tunggu sekitar 1 menit hingga proses build selesai. Website portofolio Anda langsung aktif dengan domain gratis `https://portfolio-anda.vercel.app` (dan otomatis mendapatkan sertifikat HTTPS/SSL).

---

## 💻 Opsi 2: Deploy Cepat Menggunakan Vercel CLI

Jika Anda lebih suka deploy langsung lewat command line:

1. Install Vercel CLI secara global di komputer Anda:
```bash
npm install -g vercel
```

2. Jalankan perintah deploy di folder proyek:
```bash
vercel
```
Ikuti instruksi singkat di terminal:
- Set up and deploy? **Y**
- Which scope do you want to deploy to? *(Pilih akun Anda)*
- Link to existing project? **N**
- What's your project's name? **portfolio-rizki-pauzi**
- In which directory is your code located? **./**

3. Untuk deploy versi produksi final:
```bash
vercel --prod
```

---

## ⚙️ Menghubungkan Domain Kustom (Opsional)
Jika Anda memiliki nama domain sendiri (contoh: `rizkipauzi.com` atau `rizkipauzi.my.id`):
1. Buka dashboard proyek di **Vercel** -> pilih tab **Settings** -> **Domains**.
2. Masukkan nama domain Anda dan klik **Add**.
3. Vercel akan menampilkan petunjuk DNS (CNAME atau A Record) yang cukup dimasukkan ke registrar domain Anda (seperti Cloudflare, Niagahoster, Hostinger, DomaiNesia, dll.).
4. DNS akan tersambung dalam beberapa menit secara otomatis.

---

## 🛠️ Keuntungan Konfigurasi Vercel Ini:
- ⚡ **Global Edge CDN**: Website dimuat dalam hitungan milidetik dari server terdekat di seluruh dunia.
- 🔄 **Continuous Deployment**: Setiap kali Anda melakukan `git push` ke GitHub, Vercel akan otomatis melakukan update website.
- 🔒 **Full HTTPS & Security Headers**: Aman dari ancaman clickjacking dan sniffing secara otomatis.
- 📱 **PWA & Responsive Ready**: Tampilan prima di perangkat mobile, tablet, maupun desktop.

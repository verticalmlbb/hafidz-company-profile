# Progres Proyek - Hafidz's Company

Terakhir diperbarui: 9 November 2026  
Posisi saat ini: **STEP 4 - Deploy & Maintenance**

## Checklist
- [x] Inisiasi (data usaha & desain terkumpul)
- [x] STEP 1 - Landing page
  - [x] Hero (Headline, CTAs, Telemetry Pill, Interactive SVG Spline Chart & live metric simulation)
  - [x] About (Visi misi ketahanan data Indonesia, 3 keunggulan teknis, visual NOC Lab & SLA badge)
  - [x] Service (6 Kartu Bento Grid layanan arsitektur & tuning database dengan micro-interactions)
  - [x] Berita/Post (3 Kartu artikel riset latensi, eBPF & machine learning)
  - [x] Contact + Google Maps (Info kontak, jam kerja 24/7, form konsultasi, & peta embed Menara Cyber 2)
  - [x] Responsif & aksesibilitas dicek
  - [x] Dikonfirmasi pengguna
- [x] STEP 2 - User management & dashboard
  - [x] Apps Script (code.gs, setup.gs) + inisiasi tabel idempoten
  - [x] Login & register (validasi, bcrypt password hash, signed JWT session cookie)
  - [x] Role admin & user (RBAC, middleware protection, self-deletion guard)
  - [x] Dashboard: manajemen user, manajemen role, CRUD berita (draft/publish), ganti password
  - [x] Upload media lokal (validasi mime, limit 5MB, folder public/uploads/)
  - [x] Dikonfirmasi pengguna
- [x] STEP 3 - Pemesanan *(dilewati sesuai permintaan: model bisnis B2B konsultasi/audit kustom)*
  - [x] Dikonfirmasi pengguna
- [ ] STEP 4 - Deploy & maintenance
  - [ ] Kebutuhan lanjutan (Notifikasi Email/WA, Cloud Storage Media) dikonfirmasi
  - [ ] Panduan Deploy ke Vercel
  - [ ] Checklist QA Pra-Rilis
  - [ ] Pembuatan `documentation/MAINTENANCE.md`
  - [ ] Dikonfirmasi pengguna

## Catatan & Keputusan
- **Alur Bisnis**: Pemesanan layanan ditangani melalui form konsultasi resmi dan saluran kontak WhatsApp/Email langsung.
- **Kesiapan Rilis**: Build lolos 100% tanpa error, seluruh file konfigurasi rahasia dan database terlindungi oleh `.gitignore`.
- **Target Deploy**: Vercel Serverless Hosting + Google Spreadsheet Database.

## Cara Menjalankan
1. Jalankan development server:
   ```bash
   npm run dev
   ```
2. Buka di browser:
   - Landing Page: `http://localhost:3000`
   - Halaman Login: `http://localhost:3000/login`
   - Dashboard Admin: `http://localhost:3000/dashboard`

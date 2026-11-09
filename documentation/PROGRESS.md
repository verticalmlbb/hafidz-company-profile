# Progres Proyek - Hafidz's Company

Terakhir diperbarui: 9 November 2026  
Posisi saat ini: **Menunggu Konfirmasi Pengguna untuk Step 2 (User Management, Dashboard, & Google Spreadsheet DB)**

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
  - [ ] Dikonfirmasi pengguna
- [ ] STEP 3 - Pemesanan (opsional / dilewati)
  - [ ] Dikonfirmasi pengguna
- [ ] STEP 4 - Deploy & maintenance
  - [ ] Deploy ke Vercel
  - [ ] Dikonfirmasi pengguna

## Catatan & Keputusan
- **Arsitektur Database**: Integrasi aman `Next.js -> Apps Script Web App -> Google Spreadsheet` dengan token rahasia bersama `APPS_SCRIPT_SECRET`.
- **Dual-Mode Backend**: Mendukung koneksi live Google Sheets dan mode lokal cerdas (`data/local-db.json`) saat offline development.
- **Akun Admin Awal**: `admin@gmail.com` / `123456` (Password di-hash bcrypt, wajib diubah sebelum produksi).
- **Proteksi Rute**: Middleware memblokir non-admin membuka `/dashboard` dan API admin.
- **Media Upload**: File tersimpan di `public/uploads/` dan diabstraksikan via `src/lib/storage.ts` agar siap migrasi cloud di Step 4.

## Cara Menjalankan
1. Jalankan development server:
   ```bash
   npm run dev
   ```
2. Buka di browser:
   - Landing Page: `http://localhost:3000`
   - Halaman Login: `http://localhost:3000/login`
   - Dashboard Admin: `http://localhost:3000/dashboard`

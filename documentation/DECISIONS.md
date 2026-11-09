# Keputusan Desain & Teknis (Architecture Decisions)

Proyek: **Hafidz's Company - Website Company Profile**  
Tanggal: 9 November 2026

## 1. Desain Sistem & Tema Visual
- **Tema**: *Obsidian Crimson Precision* (Mode gelap teknis enterprise dengan latar obsidian `#121315`, permukaan `#1b1c1e` & `#1f2022`, aksen crimson `#ff5545` dan `#bb0102`).
- **Inspirasi & Rujukan**: Mengadopsi 100% rancangan UI dari desainer di folder `design-reference/stitch_hafidz_database_analyzer_landing_page/` untuk desktop dan mobile.
- **Tipografi**: Menggunakan pasangan font modern Google Fonts:
  - *Plus Jakarta Sans* untuk Heading & Display (kesan kokoh, futuristik, korporat).
  - *Inter* untuk Body copy dan Micro-telemetry labels (keterbacaan optimal pada kontras gelap).
  - *Monospace* untuk data teknis, live latency, IOPS, dan query visualizer.

## 2. Pemilihan Framework & Stack
- **Framework**: Next.js 14 App Router + TypeScript.
- **Styling**: Tailwind CSS dengan custom design tokens (warna, radius, spacing, shadow glow crimson).
- **Target Deployment**: Vercel Friendly (SSG/SSR hybrid, zero persistent daemon required).
- **Aset Media**: Placeholder lokal berbasis format SVG vektor resolusi independen di `public/images/` untuk menjamin render tajam tanpa ketergantungan CDN eksternal saat offline/build.

## 3. Komponen Step 1 - Landing Page
- **Navbar**: Sticky glassmorphism header, responsive burger drawer untuk mobile, brand logo asli Hafidz Company, tombol aksi Login dan Konsultasi Gratis.
- **Hero**: Dilengkapi pill telemetri berdenyut, headline bergradasi crimson, CTA ganda, dan simulator grafik SVG interaktif live latency & NVMe buffer IOPS yang berfluktuasi secara dinamis di sisi klien.
- **About**: Penjelasan visi misi, 3 keunggulan strategis (AI deep-query, monitoring 24/7, keamanan enterprise), dan mockup visual NOC Lab Jakarta dengan SLA 100%.
- **Services**: 6 kartu Bento Grid layanan spesialis database tuning, automated index optimization, cluster HA, dll., dengan efek mikro-interaksi kursor.
- **News**: 3 kartu wawasan teknis terhubung secara dinamis ke database di Step 2.
- **Contact & Map**: Informasi kontak lengkap, jam operasional 24/7, nomor WhatsApp bisnis aktif, form konsultasi interaktif, dan embed Google Maps resmi Menara Cyber 2 Rasuna Said.

## 4. Arsitektur Step 2 - User Management, Dashboard & Google Spreadsheet
- **Arsitektur Database**:
  ```
  Browser -> Server Next.js (API Route) -> Google Apps Script Web App -> Google Spreadsheet
  ```
  Browser tidak pernah berinteraksi langsung dengan Apps Script demi mengamankan kredensial dan URL spreadsheet.
- **Autentikasi & Sesi**:
  - Hash password di server menggunakan `bcryptjs` (salt 10 rounds). Apps Script / Spreadsheet hanya menerima dan menyimpan hash.
  - Sesi login aman menggunakan signed JWT dengan `jose` yang disimpan di **HTTP-only Cookie** (`hafidz_auth_token`), terlindungi dari serangan XSS.
- **Role-Based Access Control (RBAC)**:
  - Role bawaan: `admin` dan `user`.
  - Halaman `/dashboard` dan seluruh API admin (`/api/admin/*`, `/api/upload`) diproteksi di server melalui `middleware.ts` dan fungsi otorisasi server-side.
- **Dual-Mode Backend Storage (`src/lib/db.ts`)**:
  - Aplikasi otomatis mendeteksi apakah `APPS_SCRIPT_URL` telah dikonfigurasi.
  - Jika belum disetel, aplikasi secara cerdas menggunakan local database JSON aman di `data/local-db.json` sehingga pengujian fitur lokal berjalan instan tanpa kendala.
  - Begitu URL & Secret Apps Script diisi, aplikasi langsung beralih ke Google Spreadsheet tanpa mengubah sebaris kode pun.
- **Manajemen Media Lokal (`src/lib/storage.ts`)**:
  - File thumbnail artikel disimpan di `public/uploads/` dengan penamaan unik berbasis timestamp dan validasi tipe/ukuran file (< 5MB).
  - Modul penyimpanan diisolasi agar siap dimigrasikan ke cloud storage (Vercel Blob / Cloudinary) di Step 4.

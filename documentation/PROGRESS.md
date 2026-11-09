# Progres Proyek - Hafidz's Company

Terakhir diperbarui: 9 November 2026  
Posisi saat ini: **Menunggu Konfirmasi Pengguna untuk Step 1 (Landing Page)**

## Checklist
- [x] Inisiasi (data usaha & desain terkumpul)
- [x] STEP 1 - Landing page
  - [x] Hero (Headline, CTAs, Telemetry Pill, Interactive SVG Spline Chart & live metric simulation)
  - [x] About (Visi misi ketahanan data Indonesia, 3 keunggulan teknis, visual NOC Lab & SLA badge)
  - [x] Service (6 Kartu Bento Grid layanan arsitektur & tuning database dengan micro-interactions)
  - [x] Berita/Post (3 Kartu artikel riset latensi, eBPF & machine learning)
  - [x] Contact + Google Maps (Info kontak, jam kerja 24/7, form konsultasi, & peta embed Menara Cyber 2)
  - [x] Responsif (Mobile hamburger drawer & desktop layout) & aksesibilitas (ARIA labels, kontras, semantic tags) dicek
  - [ ] Dikonfirmasi pengguna
- [ ] STEP 2 - User management & dashboard
  - [ ] Apps Script (code.gs, setup.gs) + inisiasi tabel
  - [ ] Login & register
  - [ ] Role admin & user
  - [ ] Dashboard: manajemen user, manajemen role, CRUD berita
  - [ ] Upload media lokal
  - [ ] Dikonfirmasi pengguna
- [ ] STEP 3 - Pemesanan (opsional / dilewati)
  - [ ] Dikonfirmasi pengguna
- [ ] STEP 4 - Deploy & maintenance
  - [ ] Deploy ke Vercel
  - [ ] Dikonfirmasi pengguna

## Catatan & Keputusan
- **Identitas Usaha**: Hafidz's Company — Enterprise Database Performance & Intelligence Architecture.
- **Arah Desain**: Mengadopsi desain resmi bertema *Obsidian Crimson Precision* dari `design-reference` (Dark mode obsidian `#121315`, aksen crimson `#ff5545` & `#bb0102`, typography Plus Jakarta Sans + Inter + Monospace telemetry).
- **Aset Gambar**: Logo resmi pengguna disematkan di header & footer (`/images/logo.jpg`), serta seluruh visual ilustrasi teknis lokal berformat SVG vektor di `public/images/`.
- **Konfigurasi Terpusat**: Seluruh konten teks & info kontak terpusat di `src/config/site.ts`.
- **Build Status**: Lolos kompilasi produksi `next build` (0 error, static prerendered 5/5 routes).

## Cara Menjalankan
1. Jalankan development server:
   ```bash
   npm run dev
   ```
2. Buka di browser:
   ```
   http://localhost:3000
   ```

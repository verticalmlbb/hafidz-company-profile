# Maintenance Log - Hafidz's Company

*Enterprise Database Performance & Intelligence Architecture*

---

## 1. Backlog Fitur & Rencana Peningkatan
- [ ] **Penyimpanan Media Cloud (Cloud Storage):** Mengganti penyimpanan disk lokal di `public/uploads/` dengan Vercel Blob atau Cloudinary sebelum banyak artikel diunggah di production.
- [ ] **Notifikasi Email Otomatis:** Mengirimkan notifikasi email otomatis ke tim Lead Architect saat formulir konsultasi dikirim oleh pengunjung web.
- [ ] **Custom Domain:** Menghubungkan domain utama korporat (misal: `hafidzcompany.id`) di Vercel Dashboard.

---

## 2. Bug Diketahui (Known Issues)
*Belum ada laporan kendala aktif. Semua fungsionalitas inti telah melalui proses pengujian dan validasi.*

---

## 3. Riwayat Perubahan (Changelog)

### [9 November 2026] - Rilis Versi 1.0 (Step 1 - Step 4)
- **Step 1 - Landing Page:**
  - Implementasi desain UI responsif bertema *Obsidian Crimson Precision* (Dark Mode).
  - Simulator grafik SVG interaktif live telemetry latency P99 & throughput IOPS.
  - Section About dengan 3 pilar teknis dan visual Pusat Observabilitas Data (NOC).
  - 6 kartu layanan Bento Grid (Tuning Query, Indexing, Observabilitas, HA Cluster, Migrasi Cloud, Keamanan).
  - Section kontak lengkap dengan info operasional 24/7 dan embed peta Google Maps Menara Cyber 2 Jakarta.
- **Step 2 - User Management, Dashboard & Google Spreadsheet:**
  - Kode backend Google Apps Script (`code.gs`, `setup.gs`) dengan inisiasi tabel idempoten (`Roles`, `Users`, `News`).
  - Autentikasi aman berbasis bcrypt password hash dan signed JWT session di HTTP-only cookie.
  - Dashboard Admin lengkap: Manajemen Pengguna, Manajemen Role, CRUD Berita, dan fitur Ganti Password Admin.
  - Sinkronisasi dinamis berita dari database ke halaman depan web.
- **Step 3 - Pemesanan:**
  - Dilewati sesuai model bisnis B2B konsultasi enterprise langsung.
- **Step 4 - Deploy & Maintenance:**
  - Pembuatan panduan deployment ke Vercel langkah demi langkah.
  - Verifikasi build bersih (`next build`) tanpa error.

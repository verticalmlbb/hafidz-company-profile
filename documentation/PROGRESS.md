# Progres Proyek - Hafidz's Company

Terakhir diperbarui: 11 November 2026  
Posisi saat ini: **STEP 3 (Selesai & Terverifikasi) - Sistem Pemesanan / Booking Konsultasi & Pembayaran QRIS**

## Checklist
- [x] Inisiasi (data usaha & desain terkumpul)
- [x] STEP 1 - Landing page
  - [x] Hero (Headline, CTAs, Telemetry Pill, Interactive SVG Spline Chart & live metric simulation)
  - [x] About (Visi misi ketahanan data Indonesia, 3 keunggulan teknis, visual NOC Lab & SLA badge)
  - [x] Service (6 Kartu Bento Grid layanan arsitektur & tuning database dengan micro-interactions)
  - [x] Berita/Post (3 Kartu artikel riset latensi, eBPF & machine learning)
  - [x] Contact + Google Maps (Info kontak, jam kerja 24/7, form konsultasi, & peta embed Menara Cyber 2)
  - [x] Loading Screen (Animasi boot telemetry tema Obsidian Crimson: dual spinning rings, live SVG waveform, progress bar, terminal sequence & particle grid)
  - [x] Responsif & aksesibilitas dicek
  - [x] Dikonfirmasi pengguna
- [x] STEP 2 - User management & dashboard
  - [x] Apps Script (code.gs, setup.gs) + inisiasi tabel idempoten
  - [x] Login & register (Redesain visual enterprise, validasi, bcrypt password hash, signed JWT session cookie)
  - [x] Role admin & user (RBAC, middleware protection, self-deletion guard)
  - [x] Dashboard: manajemen user, manajemen role, CRUD berita (draft/publish), ganti password
  - [x] Upload media lokal (validasi mime, limit 5MB, folder public/uploads/)
  - [x] Google Spreadsheet Database Terhubung & Terverifikasi (Token sinkron & Akun user berhasil masuk ke sheet)
  - [x] Dikonfirmasi pengguna
- [x] STEP 3 - Pemesanan & Pembayaran QRIS
  - [x] Form Booking Konsultasi Database (`/booking`) dengan proteksi login & redirect
  - [x] Generator Tiket Resmi (`#ORD-YYYYMMDD-XXXXXX`) dengan estimasi biaya paket
  - [x] Halaman Detail Tiket & Pembayaran QRIS Nasional (`/pesanan/[id]`)
  - [x] Card Standar QRIS Nasional dinamis (`public/images/qris.svg`)
  - [x] Menu & Halaman "Pesanan Anda" (`/pesanan`) khusus untuk pengguna login
  - [x] Dashboard Admin: Tab "Kelola Pesanan" (filter status, konfirmasi QRIS, tolak tiket, tombol chat WhatsApp)
  - [x] Integrasi Schema Tabel `Orders` ke Google Apps Script (`setup.gs`) dan local fallback
  - [ ] Dikonfirmasi pengguna
- [ ] STEP 4 - Deploy & maintenance
  - [x] Kode berhasil di-push ke GitHub (`https://github.com/verticalmlbb/hafidz-company-profile.git`)
  - [ ] Deploy ke Vercel
  - [ ] Verifikasi URL produksi & ganti password admin bawaan

## Catatan & Keputusan
- **Alur Pemesanan & QRIS**: Klien mengisi formulir di `/booking`, tiket dibuat dengan status awal `menunggu_konfirmasi`. Klien melakukan transfer via scan QRIS. Admin memeriksa bukti dan menekan tombol *Konfirmasi* di Dashboard, mengubah status tiket menjadi *Dikonfirmasi*.
- **Tombol Pintas WhatsApp**: Admin dapat langsung mengklik tautan WhatsApp (`wa.me`) di baris tabel untuk menghubungi nomor klien tanpa perlu mengetik ulang pesan.
- **Status Google Spreadsheet**: Tabel `Orders` disiapkan secara idempoten di `setup.gs` dan otomatis bersinkronisasi.
- **Akun Pengujian**:
  1. Admin: `admin@gmail.com`
  2. Klien / User: `verticalmlbb@gmail.com`

## Cara Menjalankan
1. Development server berjalan di:
   - Landing Page: `http://localhost:3001`
   - Form Booking: `http://localhost:3001/booking`
   - Pesanan Saya: `http://localhost:3001/pesanan`
   - Dashboard Admin: `http://localhost:3001/dashboard`

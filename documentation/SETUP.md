# Panduan Menjalankan Proyek (Setup Guide)

Website Resmi Company Profile **Hafidz's Company**

## Prasyarat
- Node.js versi 18 ke atas (disarankan LTS atau v20+)
- npm atau pnpm

## 1. Menjalankan di Komputer Lokal (Development)

1. Buka terminal di folder project ini:
   ```bash
   cd "C:\Users\DELL\Documents\Project Company Profile"
   ```

2. Jalankan development server:
   ```bash
   npm run dev
   ```

3. Buka browser dan akses alamat:
   ```
   http://localhost:3000
   ```

## 2. Struktur Gambar & Media Dummy (Step 1)
Semua aset gambar dummy tersimpan rapi di dalam folder `public/images/`:
- `logo.jpg`: Logo resmi Hafidz Company.
- `about-noc.svg`: Visual Pusat Kendali Jaringan & Database (NOC) (Ukuran ideal: 800 x 520 px).
- `news-1.svg`: Ilustrasi optimasi PostgreSQL & lock contention (Ukuran ideal: 600 x 380 px).
- `news-2.svg`: Ilustrasi telemetri observabilitas eBPF & IOPS (Ukuran ideal: 600 x 380 px).
- `news-3.svg`: Ilustrasi modul prediksi lonjakan lalu lintas AI (Ukuran ideal: 600 x 380 px).
- `map-fallback.svg`: Visual peta Headquarter Menara Cyber 2 Jakarta (Ukuran ideal: 800 x 600 px).

> Pengguna dapat mengganti gambar di atas dengan meletakkan gambar baru berformat JPG/PNG/SVG pada folder `public/images/` dengan nama yang sama.

## 3. Konfigurasi Terpusat
Untuk mengubah data teks usaha (nama, nomor telepon, alamat, link maps, email, dan daftar layanan):
Cukup edit file di:
```
src/config/site.ts
```
Semua komponen landing page secara otomatis akan mengikuti konfigurasi terpusat tersebut.

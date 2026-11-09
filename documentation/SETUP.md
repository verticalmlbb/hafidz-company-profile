# Panduan Menjalankan & Konfigurasi Proyek (Setup Guide)

Website Resmi Company Profile **Hafidz's Company**  
*Enterprise Database Performance & Intelligence Architecture*

---

## Prasyarat
- Node.js versi 18 ke atas (disarankan LTS atau v20+)
- npm atau pnpm

---

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

---

## 2. Akun Administrator Default

Sistem telah dilengkapi akun administrator awal:
- **Email:** `admin@gmail.com`
- **Password:** `123456`
- **URL Dashboard:** `http://localhost:3000/dashboard` (atau via tombol Login di pojok kanan atas)

> ⚠️ **PERINGATAN KEAMANAN WAJIB:**  
> Password default `123456` ini hanya digunakan untuk tahap uji coba awal. Harap segera buka menu **Ganti Password** di dashboard admin untuk menggantinya dengan password yang kuat sebelum website dipublikasikan ke production/Vercel.

---

## 3. Menghubungkan Google Spreadsheet sebagai Database (Step 2)

Proyek ini menggunakan arsitektur aman:
```
Browser -> Server Next.js (API Route) -> Google Apps Script Web App -> Google Spreadsheet
```
*Browser tidak pernah mengakses spreadsheet secara langsung untuk menjaga keamanan data.*

File kode Apps Script telah disiapkan di root project:
- **`code.gs`**: Router API backend yang menangani CRUD tabel secara aman dengan token otentikasi rahasia.
- **`setup.gs`**: Skrip inisiasi struktur tabel otomatis dan idempoten.

*(Kedua file ini otomatis diabaikan oleh `.gitignore` sehingga aman tidak ikut terunggah ke repository publik).*

### Langkah-langkah Setup Google Apps Script:

1. **Buat Google Spreadsheet Baru:**
   - Buka [Google Sheets](https://sheets.new) di browser Anda.
   - Beri nama spreadsheet, misalnya: `Database - Hafidz Company`.

2. **Buka Editor Apps Script:**
   - Di menu atas Google Spreadsheet, klik **Ekstensi (Extensions)** > **Apps Script**.

3. **Salin Kode Backend:**
   - Hapus kode bawaan di file `Code.gs`, lalu salin seluruh isi file **`code.gs`** dari root project ini ke dalamnya.
   - Klik tombol **+** di sebelah kiri (Files), pilih **Script**, beri nama `setup`, lalu salin seluruh isi file **`setup.gs`** dari root project ke dalamnya.

4. **Atur Token Rahasia (Script Properties):**
   - Di panel kiri editor Apps Script, klik ikon gerigi **Project Settings (Setelan Proyek)**.
   - Gulir ke bawah ke bagian **Script Properties (Properti Skrip)**, klik **Edit script properties** > **Add script property**:
     - **Property:** `APPS_SCRIPT_SECRET`
     - **Value:** Masukkan token acak panjang rahasia Anda (misalnya: `hafidz_secret_token_super_aman_991823`).
   - Klik **Save script properties**.

5. **Jalankan Inisiasi Tabel Otomatis:**
   - Kembali ke tab editor kode (`< >` Editor), pilih file `setup.gs`.
   - Pada dropdown fungsi di toolbar atas, pilih fungsi **`initTables`**.
   - Klik tombol **Run (Jalankan)**.
   - Saat pertama kali dijalankan, Google akan meminta izin akses (*Review Permissions* > pilih akun Anda > klik *Advanced* > klik *Go to (unsafe)* > klik *Allow*).
   - Tunggu hingga eksekusi selesai (*Execution completed*).
   - Kembali ke tab Google Spreadsheet Anda: Anda akan melihat sheet **`Roles`**, **`Users`**, dan **`News`** telah otomatis terbuat rapi beserta akun admin awal!

6. **Deploy sebagai Web App:**
   - Di editor Apps Script, klik tombol biru **Deploy** di pojok kanan atas > **New deployment**.
   - Klik ikon gerigi di sebelah *Select type*, pilih **Web app**.
   - Isi form konfigurasi:
     - **Description:** `Hafidz Company Production Database API`
     - **Execute as:** `Me (email Anda)`
     - **Who has access:** `Anyone` *(Penting: pilih Anyone agar Next.js di server dapat menghubungi Web App; akses tetap terlindungi oleh APPS_SCRIPT_SECRET)*.
   - Klik **Deploy**.
   - Salin **Web app URL** yang muncul (berformat: `https://script.google.com/macros/s/AKfycb.../exec`).

7. **Konfigurasi Environment Variable di Next.js:**
   - Buat file `.env.local` di root project Anda (salin dari `.env.example`):
     ```bash
     APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec
     APPS_SCRIPT_SECRET=hafidz_secret_token_super_aman_991823
     AUTH_SECRET=rahasia_jwt_anda_minimal_32_karakter
     ```
   - Restart development server `npm run dev`.
   - Selamat! Website Anda kini terhubung langsung ke Google Spreadsheet secara realtime!

> **Mode Offline / Local Fallback:**  
> Jika `APPS_SCRIPT_URL` belum diisi, aplikasi secara otomatis menggunakan database lokal aman di `data/local-db.json` sehingga Anda tetap dapat menguji login, registrasi, pergantian role, dan CRUD berita tanpa hambatan.

---

## 4. Catatan Penting Media Uploads di Vercel

Semua file gambar yang diunggah melalui dashboard admin disimpan di folder:
```
public/uploads/
```
dan path-nya dicatat ke database (`/uploads/nama-file.jpg`).

> **Catatan Produksi:**  
> Sistem disk serverless Vercel bersifat *read-only* saat production, sehingga upload ke folder lokal berfungsi sempurna di development komputer sendiri, namun tidak bertahan permanen di Vercel. Pada **Step 4 (Deploy & Maintenance)**, kami akan membantu memandu opsi migrasi penyimpanan file ke Cloud Storage (seperti Vercel Blob, Cloudinary, atau Google Drive) melalui modul terpusat [`src/lib/storage.ts`](file:///c:/Users/DELL/Documents/Project%20Company%20Profile/src/lib/storage.ts) tanpa perlu merombak kode aplikasi Anda.

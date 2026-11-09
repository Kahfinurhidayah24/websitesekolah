# Website Resmi & PPDB Online — SDN Lubang Buaya 04 Pagi

Front-end React (Vite + Tailwind) + backend PHP native + MySQL (phpMyAdmin).

## Pasang di XAMPP (tanpa Node.js)
1. Salin **isi folder `dist/`** ke `C:\xampp\htdocs\sdn04\` (boleh nama folder lain).
2. Nyalakan **Apache** dan **MySQL** di XAMPP Control Panel.
3. Buka `http://localhost/phpmyadmin` → tab **Import** → pilih `database.sql` → **Kirim**.
   (Opsional: import `contoh_data.sql` untuk data contoh.)
4. Buka `http://localhost/sdn04/`.

Login admin awal: **admin** / **Sdn04@2026** — segera ganti (lihat bawah).
Koneksi database ada di `api/config.php` (default XAMPP: user `root`, password kosong).

## Halaman & Navigasi
| Alamat | Isi |
|---|---|
| `/` | Landing page (profil, info PPDB, program, galeri, berita, prestasi, kontak) |
| `/pendaftaran/` | Halaman khusus Formulir Pendaftaran PPDB Online (4 langkah + upload KK/Akta/Foto). Setelah submit tampil Nomor Registrasi + notifikasi. |
| `/admin/` | Panel Admin (login, lalu dashboard dengan sidebar) |

Tombol **Daftar PPDB** (navbar) dan **Daftar Sekarang** (hero) adalah tautan biasa ke `/pendaftaran/` (pindah halaman penuh, bukan scroll/anchor).
Folder `pendaftaran/` dan `admin/` ikut dibuat di `dist/`, jadi langsung jalan di XAMPP tanpa pengaturan rewrite.
(Nginx: tidak perlu rewrite juga, cukup pastikan `index.html` jadi index folder.)

## Struktur Panel Admin
- **Menu**: Dashboard, Berita, Pesan Kontak (badge pesan baru), Pendaftaran (statistik & distribusi jalur)
- **PPDB Management**: Pengaturan PPDB (saklar Buka/Tutup, tahun ajaran, tanggal buka/tutup, kuota, pesan saat tutup), Jadwal PPDB, Pengumuman PPDB, Daftar Pendaftar (lihat, verifikasi, tambah, hapus, ekspor Excel/PDF)
- **Content Management**: Hero Section (banner, teks CTA bawaan "Daftar Sekarang", URL CTA bawaan `/pendaftaran`, tinggi minimum bawaan 600px), Program Akademik, Fasilitas, Ekstrakurikuler, Galeri, Prestasi
- **Account**: Logout (ganti kata sandi ada di bar atas)

Saat pendaftaran **Ditutup** (saklar mati, atau di luar rentang tanggal), halaman `/pendaftaran/` menampilkan pemberitahuan + jadwal, dan `api/register.php` menolak kiriman (dicek di server, bukan hanya tampilan).

## Pesan Kontak
Formulir "Kirim Pesan" di bagian Kontak menyimpan ke tabel `contact_messages` (dibuat otomatis) lewat `api/messages.php`; admin membacanya di menu **Pesan Kontak**.

## Alur data
- Form PPDB → `api/register.php` → tabel `ppdb_registrations` (berkas KK/Akta/Foto tersimpan di `api/uploads/`).
- Cek status → `api/status.php`.
- Dashboard admin (`/admin/`, login) → `api/auth.php` (login, ganti password) + `api/registrations.php` (verifikasi, tambah, hapus).

## Ganti password admin
Login admin → tombol **Ganti Kata Sandi** (menu kiri bawah, atau tombol "Kata Sandi" di bar atas).
Isi kata sandi lama + kata sandi baru (minimal 8 karakter). Tidak perlu lagi lewat phpMyAdmin.
Jika lupa password: di phpMyAdmin, tabel `admins` → edit kolom `password_hash` dengan hasil
`echo password_hash('PasswordBaru', PASSWORD_DEFAULT);`

## Unduh data pendaftar (Excel & PDF)
Login admin → **Kelola Calon Siswa** → tombol hijau **Excel** / merah **PDF** di samping filter.
Yang diunduh = data yang sedang tampil (ikut pencarian & filter status/jalur). NIK dan nomor HP di Excel
disimpan sebagai teks agar tidak berubah jadi angka ilmiah. PDF berformat A4 landscape + nomor halaman.

## Kelola foto & konten (admin)
Login admin → menu **Konten & Foto Website**. Di sini admin bisa upload/ganti foto dan mengubah teks untuk:
Fasilitas Penunjang, Galeri Foto Kegiatan, Berita & Prestasi, Sambutan Kepala Sekolah, Dewan Guru & Staf, serta Identitas & Sejarah.
Selain itu ada **Kontak, Alamat & Peta** (alamat, telepon, WhatsApp, email, jam layanan, tautan Google Maps, dan lokasi peta) serta **Menu Footer** (ubah tulisan / sembunyikan menu).
Foto dikecilkan otomatis di browser lalu disimpan di `api/uploads/site/`; teks disimpan di tabel `site_content`
(tabel dibuat otomatis, tidak perlu import ulang database).

### Peta lokasi sekolah
Di website, bagian **Kontak & Alamat Sekolah** menampilkan peta Google Maps. Cara mengubah titiknya: admin → Konten & Foto Website → **Kontak, Alamat & Peta**.
Isi kolom lokasi dengan nama tempat (mis. `SDN Lubang Buaya 04 Pagi, Cipayung, Jakarta Timur`), atau tempel kode sematan dari Google Maps (Bagikan → Sematkan peta → Salin HTML) untuk titik yang lebih tepat. Peta memerlukan koneksi internet.

## Login admin tidak bisa?
- Username **admin**, password **Sdn04@2026** (bukan admin123).
- Pesan "Server tidak mengembalikan JSON" = PHP tidak terjangkau. Cara paling mudah: `npm run build`,
  salin isi `dist/` ke `C:\xampp\htdocs\sdn04\`, lalu buka `http://localhost/sdn04/`.
- Kalau tetap mau `npm run dev` (port 3000), jalankan dengan nama folder htdocs Anda, contoh PowerShell:
  `$env:PHP_SERVER="http://localhost/sdn04"; npm run dev`
  (folder htdocs harus berisi folder `api` + database sudah di-import).

## Jika muncul error
| Pesan | Penyebab & solusi |
|---|---|
| "Tidak bisa terhubung ke MySQL" | MySQL di XAMPP belum **Start**. |
| "Database ... belum ada" | Import `database.sql` di phpMyAdmin (tab Import). |
| "Username/password MySQL salah" | Sesuaikan `DB_USER` / `DB_PASS` di `api/config.php`. |
| "Server tidak mengembalikan JSON" | Apache belum aktif, atau web dibuka lewat `file://`. Buka lewat `http://localhost/sdn04/`. |
| "Tidak bisa menyimpan berkas" | Folder `api/uploads` tidak bisa ditulis (di hosting Linux: chmod 775). |
Detail teknis error server dicatat di log PHP (XAMPP: `xampp/apache/logs/error.log`).

## Mode pengembangan (opsional)
```
npm install
npm run dev     # proxy /api ke http://localhost/sdn04 (ubah dengan env PHP_SERVER)
npm run build   # hasil di dist/
```

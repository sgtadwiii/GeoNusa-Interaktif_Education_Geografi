# GeoNusa - Media Belajar Geografi Interaktif

GeoNusa adalah platform edukasi geografi berbasis web yang dirancang untuk membuat proses belajar menjadi lebih menyenangkan, visual, dan mendalam. Mengadopsi pendekatan gamifikasi layaknya aplikasi belajar modern, GeoNusa menggabungkan peta interaktif, mini-games, dan multimedia untuk menjelajahi kekayaan Nusantara dari Sabang sampai Merauke.

## Fitur Utama

### Peta Interaktif (2D & 3D)
- **Peta 2D (Leaflet):** Menampilkan batas provinsi di Indonesia dengan desain garis tebal dan efek visual yang tegas.
- **Peta 3D Globe (Three.js):** Tampilan bumi tiga dimensi yang dapat diputar dan di-zoom, dilengkapi pin lokasi interaktif di setiap provinsi.
- **Panel Materi:** Setiap provinsi memiliki informasi lengkap meliputi deskripsi, kondisi geografi, flora, fauna, ibukota, dan sumber referensi.

### Peta Suara
- Integrasi pemutar video YouTube di dalam panel materi. Pengguna dapat mendengarkan lagu daerah asli sambil membaca materi geografi tanpa harus keluar dari aplikasi.

### Arcade Nusantara (Mini-Games)
Kumpulan permainan edukatif untuk menguji pemahaman geografi dengan cara yang interaktif:
- **Peta Buta:** Menemukan provinsi yang disebutkan pada peta sebelum waktu habis.
- **Detektif Alam:** Menyeret dan meletakkan kartu flora dan fauna ke provinsi asalnya.
- **Petualangan Si Bot:** Permainan refleks bergaya *endless runner* (berlari, melompat, dan mengumpulkan koin).
- **Tebak Budaya:** Kuis pilihan ganda seputar rumah adat, tarian, dan suku di Indonesia.

### Antarmuka Premium & Responsif
- **Mode Siang & Malam:** Tema visual yang berubah secara dinamis mengikuti preferensi pengguna.
- **Desain Modern:** Menggunakan pendekatan *glassmorphism* dengan animasi transisi yang halus (Framer Motion).
- **Mobile Friendly:** Tata letak dioptimalkan untuk kenyamanan penggunaan di perangkat HP, tablet, maupun desktop.
- **Maskot Interaktif:** Bot pemandu yang menyapa dan menemani pengguna selama eksplorasi.

### Sistem Autentikasi
- Fitur Login dan Register lokal (menggunakan LocalStorage) sebagai fondasi awal, yang dirancang agar mudah diintegrasikan dengan backend seperti Firebase atau Supabase di masa mendatang.

## Teknologi yang Digunakan

Proyek ini dibangun menggunakan *tech stack* modern:
- **Core:** React.js (Vite)
- **Styling:** Tailwind CSS
- **Animasi:** Framer Motion
- **Peta & Geospasial:** Leaflet, React Three Fiber (Three.js)
- **Ikon:** Lucide React
- **Efek Interaktif:** Canvas Confetti
- **Data:** JSON statis (GeoJSON Provinsi & Materi Pembelajaran)

## Cara Menjalankan Proyek

Ikuti langkah-langkah berikut untuk menjalankan GeoNusa di lingkungan lokal:

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/sgtadwiii/GeoNusa-Interaktif_Education_Geografi.git
   cd GeoNusa-Interaktif_Education_Geografi

2. **Install semua dependensi:**
   Pastikan Node.js sudah terpasang di perangkat Anda.

   ```npm install

3. **Jalankan Development Server:**

   ```npm run dev

4. **Buka di Browser:**

   ```Akses http://localhost:5173 (atau port yang tertera pada terminal).
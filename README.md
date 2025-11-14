# HealthMon - Health Monitoring Dashboard

Website monitoring kesehatan pasien untuk bayi, dewasa, dan lansia.

## Fitur

- **Dashboard**: Tampilan ringkasan statistik pasien dan peringatan kesehatan terbaru
- **Monitoring Bayi**: Daftar pasien bayi dengan status kesehatan
- **Monitoring Dewasa**: Daftar pasien dewasa dengan status kesehatan
- **Monitoring Lansia**: Daftar pasien lansia dengan status kesehatan
- **Detail Pasien**: Informasi lengkap pasien dengan grafik pertumbuhan/tren kesehatan
- **Semua Pasien**: Daftar lengkap semua pasien dengan filter kategori

## Teknologi

- React 18
- React Router DOM untuk navigasi
- Recharts untuk visualisasi data
- CSS modules untuk styling

## Instalasi

1. Install dependencies:
```bash
npm install
```

2. Jalankan aplikasi:
```bash
npm start
```

3. Buka browser di `http://localhost:3000`

## Struktur Folder

```
src/
├── components/      # Komponen reusable (Layout)
├── pages/          # Halaman aplikasi
├── data/           # Mock data pasien
├── App.js          # Main app component
└── index.js        # Entry point
```

## Screenshot

Aplikasi ini memiliki beberapa halaman utama:
- Dashboard dengan statistik dan tabel pasien
- Halaman monitoring untuk setiap kategori pasien
- Detail pasien dengan grafik dan informasi lengkap
- Halaman daftar semua pasien dengan tab filter

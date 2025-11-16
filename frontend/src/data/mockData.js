export const patientsData = [
  {
    id: 1,
    nama: 'Ahmad Budi',
    usia: '8 bulan',
    kategori: 'Bayi',
    statusKesehatan: 'Stabil',
    jenisKelamin: 'Laki-laki',
    wali: 'Siti Aminah',
    beratBadan: '8.5 kg',
    tinggiBadan: '68 cm',
    lingkarKepala: '43 cm',
    tanggalPemeriksaan: '15/10/2023',
    imunisasi: ['Selesai', 'Selesai', 'Selesai', 'Terjadwal'],
    pertumbuhan: [
      { tanggal: '15 Apr', berat: 6, tinggi: 60 },
      { tanggal: '15 Jul', berat: 7.5, tinggi: 65 },
      { tanggal: '15 Okt', berat: 8.5, tinggi: 68 }
    ]
  },
  {
    id: 2,
    nama: 'Citra Lestari',
    usia: '35 tahun',
    kategori: 'Dewasa',
    statusKesehatan: 'Stabil',
    jenisKelamin: 'Perempuan',
    NIK: '3201_1234',
    beratBadan: '58 kg',
    tinggiBadan: '160 cm',
    tekananDarah: '120/80',
    gulaDarah: '95 mg/dL',
    tanggalPemeriksaan: '18/10/2023'
  },
  {
    id: 3,
    nama: 'Bambang Hartono',
    usia: '72 tahun',
    kategori: 'Lansia',
    statusKesehatan: 'Kritis',
    jenisKelamin: 'Laki-laki',
    NIK: '3202_7002',
    beratBadan: '67 kg',
    tinggiBadan: '165 cm',
    tekananDarah: '165/100',
    gulaDarah: '210 mg/dL',
    tanggalPemeriksaan: '18/10/2023',
    peringatanKesehatan: [
      { jenis: 'Kritis', pesan: 'Tekanan darah sangat tinggi (165/100 mmHg).' },
      { jenis: 'Kritis', pesan: 'Gula darah sangat tinggi (210 mg/dL).' }
    ],
    trendKesehatan: [
      { tanggal: '18 Jul', diastolik: 110, sistolik: 165, gulaDarah: 220 },
      { tanggal: '18 Agu', diastolik: 105, sistolik: 165, gulaDarah: 215 },
      { tanggal: '18 Okt', diastolik: 100, sistolik: 165, gulaDarah: 210 }
    ]
  },
  {
    id: 4,
    nama: 'Putri Ayu',
    usia: '12 bulan',
    kategori: 'Bayi',
    statusKesehatan: 'Perlu Perhatian',
    jenisKelamin: 'Perempuan',
    wali: 'Dian Permata',
    beratBadan: '9.2 kg',
    tinggiBadan: '72 cm',
    lingkarKepala: '45 cm',
    tanggalPemeriksaan: '16/10/2023',
    peringatanKesehatan: [
      { jenis: 'Perhatian', pesan: 'Kenaikan berat badan sedikit melambat.' }
    ]
  },
  {
    id: 5,
    nama: 'Rizky Pratama',
    usia: '28 tahun',
    kategori: 'Dewasa',
    statusKesehatan: 'Stabil',
    jenisKelamin: 'Laki-laki',
    NIK: '3203_5678',
    beratBadan: '70 kg',
    tinggiBadan: '170 cm',
    tekananDarah: '118/78',
    gulaDarah: '88 mg/dL',
    tanggalPemeriksaan: '17/10/2023'
  },
  {
    id: 6,
    nama: 'Sri Mulyani',
    usia: '68 tahun',
    kategori: 'Lansia',
    statusKesehatan: 'Perlu Perhatian',
    jenisKelamin: 'Perempuan',
    NIK: '3204_9012',
    beratBadan: '62 kg',
    tinggiBadan: '158 cm',
    tekananDarah: '150/92',
    gulaDarah: '128 mg/dL',
    tanggalPemeriksaan: '19/10/2023',
    peringatanKesehatan: [
      { jenis: 'Perhatian', pesan: 'Tekanan darah cenderung tinggi (150/92 mmHg).' }
    ]
  },
  {
    id: 7,
    nama: 'Dian Permata',
    usia: '4 bulan',
    kategori: 'Bayi',
    statusKesehatan: 'Stabil',
    jenisKelamin: 'Perempuan',
    wali: 'Rina Sari',
    beratBadan: '6.8 kg',
    tinggiBadan: '62 cm',
    lingkarKepala: '41 cm',
    tanggalPemeriksaan: '20/10/2023'
  }
];

export const getDashboardStats = () => {
  const totalBayi = patientsData.filter(p => p.kategori === 'Bayi').length;
  const totalDewasa = patientsData.filter(p => p.kategori === 'Dewasa').length;
  const totalLansia = patientsData.filter(p => p.kategori === 'Lansia').length;
  const totalPasien = patientsData.length;
  const peringatanAktif = patientsData.filter(p => 
    p.statusKesehatan === 'Kritis' || p.statusKesehatan === 'Perlu Perhatian'
  ).length;

  return {
    totalPasien,
    totalBayi,
    totalDewasa,
    totalLansia,
    peringatanAktif
  };
};

export const getRecentAlerts = () => {
  return patientsData
    .filter(p => p.peringatanKesehatan && p.peringatanKesehatan.length > 0)
    .flatMap(p => 
      p.peringatanKesehatan.map(alert => ({
        nama: p.nama,
        kategori: p.kategori,
        pesan: alert.pesan,
        jenis: alert.jenis
      }))
    )
    .slice(0, 4);
};

export const getPatientsByCategory = (category) => {
  return patientsData.filter(p => p.kategori === category);
};

export const getPatientById = (id) => {
  return patientsData.find(p => p.id === parseInt(id));
};

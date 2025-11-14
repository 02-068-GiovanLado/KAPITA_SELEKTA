# Google Sheets Sync - Setup Guide

Panduan lengkap untuk mengatur fitur sinkronisasi data dari Google Sheets ke database PostgreSQL.

## 📋 Prasyarat

- Google Account
- Google Cloud Platform Account
- Google Sheets dengan data yang akan disinkronkan

## 🔧 Setup Google Cloud Service Account

### 1. Buat Project di Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Klik "Select a project" di bagian atas
3. Klik "NEW PROJECT"
4. Beri nama project (misalnya: "HealthMon API")
5. Klik "CREATE"

### 2. Enable Google Sheets API

1. Di sidebar, pilih "APIs & Services" > "Library"
2. Cari "Google Sheets API"
3. Klik "Google Sheets API"
4. Klik "ENABLE"

### 3. Buat Service Account

1. Di sidebar, pilih "APIs & Services" > "Credentials"
2. Klik "CREATE CREDENTIALS" > "Service account"
3. Isi form:
   - **Service account name**: healthmon-sync
   - **Service account ID**: healthmon-sync (auto-generated)
   - **Description**: Service account for HealthMon data sync
4. Klik "CREATE AND CONTINUE"
5. Skip "Grant this service account access to project" (klik CONTINUE)
6. Skip "Grant users access to this service account" (klik DONE)

### 4. Generate Service Account Key

1. Di halaman Credentials, cari service account yang baru dibuat
2. Klik pada service account email
3. Pilih tab "KEYS"
4. Klik "ADD KEY" > "Create new key"
5. Pilih "JSON"
6. Klik "CREATE"
7. File JSON akan otomatis terdownload - **SIMPAN FILE INI DENGAN AMAN!**

### 5. Extract Credentials dari JSON

Buka file JSON yang didownload. Isinya seperti ini:

```json
{
  "type": "service_account",
  "project_id": "healthmon-api-12345",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "healthmon-sync@healthmon-api-12345.iam.gserviceaccount.com",
  "client_id": "123456789...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

Copy nilai-nilai berikut ke file `.env`:

```env
GOOGLE_PROJECT_ID=healthmon-api-12345
GOOGLE_PRIVATE_KEY_ID=abc123...
GOOGLE_SERVICE_ACCOUNT_EMAIL=healthmon-sync@healthmon-api-12345.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=123456789...
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**PENTING**: Untuk `GOOGLE_PRIVATE_KEY`, pastikan nilai tersebut dalam tanda kutip ganda dan pertahankan `\n` untuk newline.

## 📊 Setup Google Sheets

### 1. Buat Google Sheets

1. Buka [Google Sheets](https://sheets.google.com)
2. Buat spreadsheet baru
3. Beri nama "HealthMon Data"

### 2. Copy Spreadsheet ID

Dari URL spreadsheet:
```
https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0/edit
                                      ^^^^^^^^^^^^^^^^^^^^
                                      ini adalah Sheet ID
```

Copy Sheet ID ke `.env`:
```env
GOOGLE_SHEET_ID=1a2b3c4d5e6f7g8h9i0
```

### 3. Share Spreadsheet dengan Service Account

1. Di Google Sheets, klik tombol "Share"
2. Paste email service account (dari JSON file, field `client_email`)
3. Pilih role "Editor"
4. **UNCHECK** "Notify people"
5. Klik "Share"

### 4. Buat Tabs dan Format Data

Buat 5 tabs dengan format berikut:

#### Tab: **patients**
| id | name | age | gender | category | nik | guardian_name | last_checkup_date | status |
|----|------|-----|--------|----------|-----|---------------|-------------------|--------|
| 1 | Ahmad Budi | 8 bulan | Laki-laki | Bayi | | Siti Aminah | 2023-10-15 | Stabil |
| 2 | Citra Lestari | 35 tahun | Perempuan | Dewasa | 3201_1234 | | 2023-10-18 | Stabil |

#### Tab: **checkups**
| id | patient_id | date | weight | height | head_circumference | blood_pressure | blood_sugar |
|----|------------|------|--------|--------|--------------------|----------------|-------------|
| 1 | 1 | 2023-10-15 | 8.5 | 68 | 43 | | |
| 2 | 2 | 2023-10-18 | 58 | 160 | | 120/80 | 95 |

#### Tab: **alerts**
| id | patient_id | alert_type | description |
|----|------------|------------|-------------|
| 1 | 3 | Kritis | Tekanan darah sangat tinggi (165/100 mmHg). |
| 2 | 3 | Kritis | Gula darah sangat tinggi (210 mg/dL). |

#### Tab: **immunizations**
| id | patient_id | vaccine_name | status | date |
|----|------------|--------------|--------|------|
| 1 | 1 | BCG | Selesai | 2023-03-01 |
| 2 | 1 | Hepatitis B | Selesai | 2023-03-15 |

#### Tab: **milestones**
| id | patient_id | milestone_name | achieved | date |
|----|------------|----------------|----------|------|
| 1 | 1 | Mengangkat kepala | true | 2023-04-01 |
| 2 | 1 | Duduk dengan bantuan | true | 2023-06-01 |

**PENTING**: 
- Baris pertama HARUS berisi header dengan nama kolom persis seperti di atas
- Header menggunakan underscore `_` untuk pemisah kata
- Kolom `achieved` untuk boolean gunakan: `true` atau `false`
- Format tanggal: `YYYY-MM-DD`

## 🚀 Menjalankan Sync

### 1. Pastikan semua konfigurasi sudah benar

Cek file `.env`:
```bash
cat .env
```

### 2. Test koneksi database

```bash
npm run db:migrate
```

### 3. Jalankan sync script

```bash
npm run sync:sheets
```

### Output yang diharapkan:

```
=== Starting Google Sheets Sync ===
Spreadsheet ID: 1a2b3c4d5e6f7g8h9i0

✓ Database connection established

Syncing patients...
✓ Synced 7 patients
Syncing checkups...
✓ Synced 11 checkups
Syncing alerts...
✓ Synced 4 alerts
Syncing immunizations...
✓ Synced 13 immunizations
Syncing milestones...
✓ Synced 12 milestones

=== Sync completed successfully! ===
Database connection closed
```

## 🔄 Cara Kerja Upsert

Script menggunakan `bulkCreate` dengan opsi `updateOnDuplicate`:

- **Jika ID sudah ada**: Data akan di-UPDATE
- **Jika ID belum ada**: Data akan di-INSERT
- Tidak ada duplikasi data

Contoh:
```javascript
await Patient.bulkCreate(patients, {
  updateOnDuplicate: ['name', 'age', 'gender', 'category', 'nik', 'guardian_name', 'last_checkup_date', 'status', 'updated_at']
});
```

## ⚠️ Troubleshooting

### Error: "Permission denied"
**Solusi**: Pastikan spreadsheet sudah di-share dengan service account email

### Error: "Invalid credentials"
**Solusi**: 
- Cek apakah private key di `.env` menggunakan tanda kutip ganda
- Pastikan `\n` tidak di-escape menjadi `\\n`

### Error: "Spreadsheet not found"
**Solusi**: Cek apakah `GOOGLE_SHEET_ID` benar

### Error: "Unable to parse range"
**Solusi**: 
- Pastikan nama tab persis: `patients`, `checkups`, `alerts`, `immunizations`, `milestones`
- Pastikan header ada di baris pertama

### Data tidak ter-sync
**Solusi**:
- Cek apakah header kolom persis sama dengan yang diharapkan
- Cek apakah ada data di tab (minimal 2 baris: header + data)
- Lihat log error di console

## 🔐 Keamanan

1. **JANGAN** commit file `.env` ke git
2. **JANGAN** share file JSON service account key
3. Gunakan environment variables untuk production
4. Batasi akses service account hanya ke spreadsheet yang diperlukan
5. Rotasi service account key secara berkala

## 📝 Tips

1. **Backup data**: Selalu backup database sebelum sync pertama kali
2. **Testing**: Test di development environment dulu
3. **Validation**: Validasi data di Google Sheets sebelum sync
4. **Monitoring**: Cek log output untuk memastikan semua data ter-sync
5. **Automation**: Bisa di-schedule dengan cron job untuk sync otomatis

## 🔄 Workflow Recommended

1. Input data baru di Google Sheets
2. Review dan validasi data
3. Jalankan sync script
4. Verifikasi data di database
5. Test di frontend

## 📚 Referensi

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Google Service Account Documentation](https://cloud.google.com/iam/docs/service-accounts)
- [Sequelize bulkCreate Documentation](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#creating-in-bulk)

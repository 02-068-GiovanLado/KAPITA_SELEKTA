# API Documentation - HealthMon Backend

## Base URL
```
http://localhost:5000/api
```

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats` | Dashboard statistics |
| GET | `/alerts/recent` | Recent 5 alerts with patient details |
| GET | `/patients` | List all patients (with optional filter) |
| GET | `/patients/:id` | Get patient details with all associations |
| POST | `/patients` | Create new patient with initial checkup |

---

## 1. GET /stats

Mengambil statistik untuk dashboard utama.

### Request
```bash
curl http://localhost:5000/api/stats
```

### Response
```json
{
  "totalPatients": 7,
  "totalBabies": 3,
  "totalAdults": 2,
  "totalElders": 2,
  "activeAlerts": 3
}
```

### Status Codes
- `200 OK` - Success
- `500 Internal Server Error` - Server error

---

## 2. GET /alerts/recent

Mengambil 5 peringatan kesehatan terbaru beserta detail pasien.

### Request
```bash
curl http://localhost:5000/api/alerts/recent
```

### Response
```json
[
  {
    "id": 1,
    "alertType": "Kritis",
    "description": "Tekanan darah sangat tinggi (165/100 mmHg).",
    "createdAt": "2023-11-14T10:00:00.000Z",
    "patient": {
      "id": 3,
      "name": "Bambang Hartono",
      "category": "Lansia"
    }
  },
  {
    "id": 2,
    "alertType": "Kritis",
    "description": "Gula darah sangat tinggi (210 mg/dL).",
    "createdAt": "2023-11-14T10:00:00.000Z",
    "patient": {
      "id": 3,
      "name": "Bambang Hartono",
      "category": "Lansia"
    }
  }
]
```

### Status Codes
- `200 OK` - Success
- `500 Internal Server Error` - Server error

---

## 3. GET /patients

Mengambil daftar semua pasien dengan opsi filter berdasarkan kategori.

### Request
```bash
# Semua pasien
curl http://localhost:5000/api/patients

# Filter berdasarkan kategori
curl "http://localhost:5000/api/patients?category=Bayi"
curl "http://localhost:5000/api/patients?category=Dewasa"
curl "http://localhost:5000/api/patients?category=Lansia"
```

### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category | string | No | Filter by category: Bayi, Dewasa, atau Lansia |

### Response
```json
[
  {
    "id": 1,
    "name": "Ahmad Budi",
    "age": "8 bulan",
    "gender": "Laki-laki",
    "category": "Bayi",
    "nik": null,
    "guardian_name": "Siti Aminah",
    "last_checkup_date": "2023-10-15T00:00:00.000Z",
    "status": "Stabil",
    "created_at": "2023-11-14T10:00:00.000Z",
    "updated_at": "2023-11-14T10:00:00.000Z"
  }
]
```

### Status Codes
- `200 OK` - Success
- `500 Internal Server Error` - Server error

---

## 4. GET /patients/:id

Mengambil detail lengkap satu pasien beserta semua data terkait (checkups, alerts, immunizations, milestones).

### Request
```bash
curl http://localhost:5000/api/patients/1
```

### URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | Patient ID |

### Response
```json
{
  "id": 1,
  "name": "Ahmad Budi",
  "age": "8 bulan",
  "gender": "Laki-laki",
  "category": "Bayi",
  "nik": null,
  "guardian_name": "Siti Aminah",
  "last_checkup_date": "2023-10-15T00:00:00.000Z",
  "status": "Stabil",
  "created_at": "2023-11-14T10:00:00.000Z",
  "updated_at": "2023-11-14T10:00:00.000Z",
  "checkups": [
    {
      "id": 3,
      "patient_id": 1,
      "date": "2023-10-15T00:00:00.000Z",
      "weight": "8.50",
      "height": "68.00",
      "head_circumference": "43.00",
      "blood_pressure": null,
      "blood_sugar": null,
      "created_at": "2023-11-14T10:00:00.000Z",
      "updated_at": "2023-11-14T10:00:00.000Z"
    },
    {
      "id": 2,
      "patient_id": 1,
      "date": "2023-07-15T00:00:00.000Z",
      "weight": "7.50",
      "height": "65.00",
      "head_circumference": "42.00",
      "blood_pressure": null,
      "blood_sugar": null,
      "created_at": "2023-11-14T10:00:00.000Z",
      "updated_at": "2023-11-14T10:00:00.000Z"
    }
  ],
  "alerts": [],
  "immunizations": [
    {
      "id": 1,
      "patient_id": 1,
      "vaccine_name": "BCG",
      "status": "Selesai",
      "date": "2023-03-01T00:00:00.000Z",
      "created_at": "2023-11-14T10:00:00.000Z",
      "updated_at": "2023-11-14T10:00:00.000Z"
    }
  ],
  "milestones": [
    {
      "id": 1,
      "patient_id": 1,
      "milestone_name": "Mengangkat kepala",
      "achieved": true,
      "date": "2023-04-01T00:00:00.000Z",
      "created_at": "2023-11-14T10:00:00.000Z",
      "updated_at": "2023-11-14T10:00:00.000Z"
    }
  ]
}
```

### Status Codes
- `200 OK` - Success
- `404 Not Found` - Patient not found
- `500 Internal Server Error` - Server error

---

## 5. POST /patients

Membuat pasien baru dengan data pemeriksaan awal. Menggunakan transaksi database untuk memastikan konsistensi data.

### Request
```bash
curl -X POST http://localhost:5000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "age": "6 bulan",
    "gender": "Laki-laki",
    "category": "Bayi",
    "guardian_name": "Jane Doe",
    "status": "Stabil",
    "checkup": {
      "date": "2023-11-14",
      "weight": 7.5,
      "height": 65.0,
      "head_circumference": 42.0
    }
  }'
```

### Request Body

#### Required Fields
| Field | Type | Description |
|-------|------|-------------|
| name | string | Patient name |
| age | string | Patient age (e.g., "8 bulan", "35 tahun") |
| gender | string | "Laki-laki" or "Perempuan" |
| category | string | "Bayi", "Dewasa", or "Lansia" |

#### Optional Fields
| Field | Type | Description |
|-------|------|-------------|
| nik | string | National ID number (for adults and elderly) |
| guardian_name | string | Guardian name (for babies) |
| status | string | "Stabil", "Perlu Perhatian", or "Kritis" (default: "Stabil") |
| checkup | object | Initial checkup data |

#### Checkup Object (optional)
| Field | Type | Description |
|-------|------|-------------|
| date | string | Checkup date (ISO format) |
| weight | decimal | Weight in kg |
| height | decimal | Height in cm |
| head_circumference | decimal | Head circumference in cm (for babies) |
| blood_pressure | string | Blood pressure (e.g., "120/80") (for adults/elderly) |
| blood_sugar | integer | Blood sugar in mg/dL (for adults/elderly) |

### Response
```json
{
  "id": 8,
  "name": "John Doe",
  "age": "6 bulan",
  "gender": "Laki-laki",
  "category": "Bayi",
  "nik": null,
  "guardian_name": "Jane Doe",
  "last_checkup_date": "2023-11-14T10:00:00.000Z",
  "status": "Stabil",
  "created_at": "2023-11-14T10:00:00.000Z",
  "updated_at": "2023-11-14T10:00:00.000Z",
  "checkups": [
    {
      "id": 12,
      "patient_id": 8,
      "date": "2023-11-14T00:00:00.000Z",
      "weight": "7.50",
      "height": "65.00",
      "head_circumference": "42.00",
      "blood_pressure": null,
      "blood_sugar": null,
      "created_at": "2023-11-14T10:00:00.000Z",
      "updated_at": "2023-11-14T10:00:00.000Z"
    }
  ],
  "alerts": [],
  "immunizations": [],
  "milestones": []
}
```

### Status Codes
- `201 Created` - Patient created successfully
- `400 Bad Request` - Missing required fields or validation error
- `500 Internal Server Error` - Server error

### Error Response
```json
{
  "error": "Missing required fields: name, age, gender, category"
}
```

---

## Example Usage with JavaScript Fetch

### Get Stats
```javascript
fetch('http://localhost:5000/api/stats')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Get Patients by Category
```javascript
fetch('http://localhost:5000/api/patients?category=Bayi')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Get Patient Details
```javascript
fetch('http://localhost:5000/api/patients/1')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Create New Patient
```javascript
fetch('http://localhost:5000/api/patients', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    age: '6 bulan',
    gender: 'Laki-laki',
    category: 'Bayi',
    guardian_name: 'Jane Doe',
    checkup: {
      weight: 7.5,
      height: 65.0,
      head_circumference: 42.0
    }
  })
})
  .then(response => response.json())
  .then(data => console.log(data));
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message here",
  "details": "Additional error details (in development mode)"
}
```

### Common HTTP Status Codes
- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Rate Limiting

Currently, there is no rate limiting implemented. Consider adding rate limiting middleware for production use.

## CORS

CORS is enabled for all origins. Configure appropriately for production.

## Authentication

Currently, no authentication is required. Implement authentication middleware for production use.

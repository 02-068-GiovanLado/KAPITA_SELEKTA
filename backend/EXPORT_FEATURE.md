# Export Feature Documentation

## Overview
The export feature allows administrators to download patient data, checkup history, and vitamin records as Excel (.xlsx) files for backup, reporting, and offline analysis purposes.

## Features

### 1. Export Patients Data
**Endpoint:** `GET /api/export/patients?category={category}`

**Description:** Export all patient information with their latest checkup data and vitamin count (for babies).

**Query Parameters:**
- `category` (optional): Filter by patient category
  - `Bayi` - Only baby patients
  - `Dewasa` - Only adult patients  
  - `Lansia` - Only elderly patients
  - `Semua` or omitted - All patients

**Exported Data:**
- Patient ID, Name, Category, Gender, Age, Health Status
- For Babies: Birth date, Parent name, Mother NIK, Child NIK, Family card number
- For Adults: NIK
- Latest checkup: Date, Weight, Height, Head circumference (babies) or Blood pressure/sugar/cholesterol (adults), Notes
- For Babies: Vitamin count and completed vitamins count
- Registration date

**File Format:** `Data_Pasien_{Category}_{Date}.xlsx`

**Example:**
```
GET /api/export/patients?category=Bayi
```

### 2. Export Checkups History
**Endpoint:** `GET /api/export/checkups`

**Description:** Export complete checkup history for all patients with detailed measurements.

**Exported Data:**
- Checkup ID, Patient name, Category
- Checkup date, Weight, Height
- For Babies: Head circumference
- For Adults: Blood pressure (systolic/diastolic), Blood sugar, Cholesterol
- Notes, Input date

**File Format:** `Riwayat_Pemeriksaan_{Date}.xlsx`

**Example:**
```
GET /api/export/checkups
```

### 3. Export Vitamins Data
**Endpoint:** `GET /api/export/vitamins`

**Description:** Export vitamin records for baby patients including vitamin schedules and status.

**Exported Data:**
- Vitamin ID
- Child name, Parent name, Age
- Vitamin name, Date, Status (Selesai/Terjadwal/Tertunda)
- Input date

**File Format:** `Data_Vitamin_{Date}.xlsx`

**Example:**
```
GET /api/export/vitamins
```

## Frontend Implementation

### Location
- **Page:** `frontend/src/pages/SemuaPasien.js`
- **Component:** Export buttons in table header

### UI Features
1. **Export Data Pasien** button - Always visible
   - Exports patients based on active tab (Semua/Bayi/Dewasa)
   - Shows loading spinner during export
   
2. **Export Vitamin** button - Only visible on Bayi tab
   - Exports all vitamin records for babies
   
3. **Export Pemeriksaan** button - Always visible
   - Exports complete checkup history

### Button States
- **Normal:** Green button with download icon
- **Loading:** Shows spinner with "Exporting..." text
- **Disabled:** Grayed out during export process

## Technical Details

### Backend Implementation
**File:** `backend/controllers/exportController.js`

**Dependencies:**
- `xlsx` - Excel file generation library
- Sequelize models (Patient, Checkup, Vitamin)

**Key Functions:**
- `exportPatients(req, res)` - Generate patients Excel file
- `exportCheckups(req, res)` - Generate checkups Excel file
- `exportVitamins(req, res)` - Generate vitamins Excel file

**Features:**
- Auto-sized columns based on content
- Indonesian date formatting (DD/MM/YYYY)
- Category-specific fields
- Proper MIME types and download headers

### Frontend Implementation
**File:** `frontend/src/pages/SemuaPasien.js`

**New State:**
- `exporting` - Boolean flag for loading state

**New Function:**
- `handleExport(exportType)` - Triggers download via temporary link

**Styling:**
- Added in `SemuaPasien.css`
- Includes button hover effects and spinner animation

## Usage Examples

### Export All Patients
```javascript
// Frontend
handleExport('patients');

// Backend URL
GET http://localhost:5000/api/export/patients
```

### Export Only Babies
```javascript
// Frontend (when Bayi tab is active)
handleExport('patients');

// Backend URL
GET http://localhost:5000/api/export/patients?category=Bayi
```

### Export Checkup History
```javascript
// Frontend
handleExport('checkups');

// Backend URL
GET http://localhost:5000/api/export/checkups
```

### Export Vitamin Records
```javascript
// Frontend
handleExport('vitamins');

// Backend URL
GET http://localhost:5000/api/export/vitamins
```

## Excel File Structure

### Patients Export
| ID | Nama | Kategori | Jenis Kelamin | Usia | Status Kesehatan | ... |
|----|------|----------|---------------|------|------------------|-----|
| 1  | Budi | Bayi     | L             | 6 bulan | Baik          | ... |

### Checkups Export
| ID Pemeriksaan | Nama Pasien | Kategori | Tanggal Pemeriksaan | Berat (kg) | ... |
|----------------|-------------|----------|---------------------|------------|-----|
| 1              | Budi        | Bayi     | 15/01/2024         | 7.5        | ... |

### Vitamins Export
| ID Vitamin | Nama Anak | Nama Orang Tua | Usia | Nama Vitamin | Tanggal | Status |
|------------|-----------|----------------|------|--------------|---------|--------|
| 1          | Budi      | Siti           | 6 bulan | Vitamin A | 15/01/2024 | Selesai |

## Error Handling

### Backend Errors
- 500 - Internal server error with error details
- Returns JSON error response if export fails

### Frontend Errors
- Shows alert with "Gagal mengekspor data" message
- Resets loading state automatically

## Security

### Rate Limiting
- Export endpoints protected by API rate limiter (100 requests/15 min)

### Validation
- Query parameters validated with express-validator
- Only allowed category values accepted

### Access Control
- Export features only available in admin pages
- Requires authenticated session

## Future Enhancements

### Planned Features
1. **Date Range Filter**
   - Allow exporting data within specific date ranges
   - Add date pickers to UI

2. **Custom Fields Selection**
   - Let admin choose which fields to export
   - Checkbox selection for columns

3. **Export Scheduling**
   - Automated daily/weekly/monthly exports
   - Email delivery of exported files

4. **Multiple Sheet Support**
   - Combine patients + checkups + vitamins in one workbook
   - Separate sheets for each data type

5. **Export Single Patient**
   - Download complete history for one patient
   - Include all checkups, vitamins, and alerts

6. **Chart/Graph Embedding**
   - Include growth charts in Excel files
   - Visual representation of trends

7. **PDF Export**
   - Alternative format for official reports
   - Formatted with headers and footers

## Testing

### Manual Testing Checklist
- [ ] Export all patients (Semua tab)
- [ ] Export only babies (Bayi tab)
- [ ] Export only adults (Dewasa tab)
- [ ] Export checkups history
- [ ] Export vitamins (from Bayi tab)
- [ ] Verify Excel file opens correctly
- [ ] Check data accuracy in exported files
- [ ] Test with empty database
- [ ] Test with large dataset (100+ records)
- [ ] Verify loading states work
- [ ] Test error handling (server down)
- [ ] Test on different browsers (Chrome, Firefox, Edge)

### Automated Testing
Create test file: `backend/test-export.js`
```javascript
const axios = require('axios');

async function testExports() {
  const baseUrl = 'http://localhost:5000';
  
  // Test patients export
  console.log('Testing patients export...');
  const patientsRes = await axios.get(`${baseUrl}/api/export/patients`, {
    responseType: 'arraybuffer'
  });
  console.log('✓ Patients export OK -', patientsRes.data.length, 'bytes');
  
  // Test checkups export
  console.log('Testing checkups export...');
  const checkupsRes = await axios.get(`${baseUrl}/api/export/checkups`, {
    responseType: 'arraybuffer'
  });
  console.log('✓ Checkups export OK -', checkupsRes.data.length, 'bytes');
  
  // Test vitamins export
  console.log('Testing vitamins export...');
  const vitaminsRes = await axios.get(`${baseUrl}/api/export/vitamins`, {
    responseType: 'arraybuffer'
  });
  console.log('✓ Vitamins export OK -', vitaminsRes.data.length, 'bytes');
}

testExports().catch(console.error);
```

## Troubleshooting

### Common Issues

**Issue:** Export button not appearing
- **Solution:** Check if user is on admin page (SemuaPasien.js)
- **Solution:** Verify frontend component imported correctly

**Issue:** Download not starting
- **Solution:** Check browser pop-up blocker settings
- **Solution:** Verify API_BASE_URL is correct

**Issue:** Empty Excel file
- **Solution:** Check database has data
- **Solution:** Verify backend endpoint is working (test with curl/Postman)

**Issue:** Excel file corrupted
- **Solution:** Check MIME type headers are correct
- **Solution:** Ensure binary data is not modified during transfer

**Issue:** Export timeout
- **Solution:** Database query too slow, add indexes
- **Solution:** Limit number of records or add pagination

## API Response Examples

### Successful Export
```http
HTTP/1.1 200 OK
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="Data_Pasien_Bayi_2024-01-15.xlsx"
Content-Length: 12345

[Binary Excel file data]
```

### Error Response
```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": "Internal server error",
  "details": "Database connection failed"
}
```

## Performance Considerations

### Current Implementation
- Fetches all records at once
- Processes in memory
- No pagination

### Recommendations for Large Datasets (10,000+ records)
1. Implement streaming for large exports
2. Add pagination with chunked processing
3. Use background jobs for heavy exports
4. Cache frequently requested exports
5. Compress Excel files before sending

### Memory Usage
- Small dataset (<1000 records): ~5-10 MB RAM
- Medium dataset (1000-10000 records): ~10-50 MB RAM
- Large dataset (>10000 records): Consider streaming approach

## Deployment Notes

### Production Configuration
- Ensure CORS allows admin domain
- Rate limiting appropriate for production load
- Monitor export endpoint performance
- Set up error logging for failed exports

### Environment Variables
No additional environment variables needed. Uses existing:
- `REACT_APP_API_URL` - Frontend API base URL
- Backend uses standard database and server config

## Version History

### v1.0.0 (Current)
- Initial implementation
- Three export types: patients, checkups, vitamins
- Category filtering for patients
- Auto-sized columns
- Indonesian date formatting
- Loading states and error handling

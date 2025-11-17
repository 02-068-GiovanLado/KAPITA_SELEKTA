const { Patient, Checkup, Vitamin } = require('../models');
const XLSX = require('xlsx');

// GET /api/export/patients - Export all patients data to Excel
exports.exportPatients = async (req, res) => {
  try {
    const { category } = req.query;
    const whereClause = {};
    
    if (category && category !== 'Semua') {
      whereClause.category = category;
    }

    // Fetch patients with their related data
    const patients = await Patient.findAll({
      where: whereClause,
      include: [
        {
          model: Checkup,
          as: 'checkups',
          order: [['date', 'DESC']],
          limit: 1
        },
        {
          model: Vitamin,
          as: 'vitamins',
          order: [['date', 'DESC']]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Prepare data for Excel
    const excelData = patients.map(patient => {
      const latestCheckup = patient.checkups && patient.checkups[0];
      const isBayi = patient.category === 'Bayi';
      
      const baseData = {
        'ID': patient.id,
        'Nama': patient.name,
        'Kategori': patient.category,
        'Jenis Kelamin': patient.gender,
        'Usia': patient.age,
        'Status Kesehatan': patient.status || 'N/A'
      };

      // Add category-specific fields
      if (isBayi) {
        baseData['Tanggal Lahir'] = patient.birth_date ? new Date(patient.birth_date).toLocaleDateString('id-ID') : '';
        baseData['Nama Orang Tua'] = patient.guardian_name || '';
        baseData['NIK Ibu'] = patient.mother_nik || '';
        baseData['NIK Anak'] = patient.child_nik || '';
        baseData['No KK'] = patient.family_card_number || '';
      } else {
        baseData['NIK'] = patient.nik || '';
      }

      // Add latest checkup data
      if (latestCheckup) {
        baseData['Tanggal Pemeriksaan Terakhir'] = new Date(latestCheckup.date).toLocaleDateString('id-ID');
        baseData['Berat Badan (kg)'] = latestCheckup.weight || '';
        baseData['Tinggi Badan (cm)'] = latestCheckup.height || '';
        
        if (isBayi) {
          baseData['Lingkar Kepala (cm)'] = latestCheckup.head_circumference || '';
        } else {
          baseData['Tekanan Darah'] = latestCheckup.blood_pressure_systolic && latestCheckup.blood_pressure_diastolic
            ? `${latestCheckup.blood_pressure_systolic}/${latestCheckup.blood_pressure_diastolic}`
            : '';
          baseData['Gula Darah (mg/dL)'] = latestCheckup.blood_sugar || '';
          baseData['Kolesterol (mg/dL)'] = latestCheckup.cholesterol || '';
        }
        baseData['Catatan Pemeriksaan'] = latestCheckup.notes || '';
      }

      // Add vitamin count for babies
      if (isBayi && patient.vitamins) {
        baseData['Jumlah Vitamin'] = patient.vitamins.length;
        const completedVitamins = patient.vitamins.filter(v => v.status === 'Selesai').length;
        baseData['Vitamin Selesai'] = completedVitamins;
      }

      baseData['Tanggal Terdaftar'] = new Date(patient.created_at).toLocaleDateString('id-ID');

      return baseData;
    });

    // Create workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Auto-size columns
    const maxWidth = 50;
    const columnWidths = {};
    
    excelData.forEach(row => {
      Object.keys(row).forEach(key => {
        const value = String(row[key] || '');
        const currentWidth = columnWidths[key] || 10;
        columnWidths[key] = Math.min(Math.max(currentWidth, value.length + 2), maxWidth);
      });
    });

    worksheet['!cols'] = Object.keys(excelData[0] || {}).map(key => ({
      wch: columnWidths[key] || 10
    }));

    // Add worksheet to workbook
    const sheetName = category && category !== 'Semua' ? `Pasien ${category}` : 'Semua Pasien';
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set headers for file download
    const filename = `Data_Pasien_${category || 'Semua'}_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Send file
    res.send(buffer);
  } catch (error) {
    console.error('Error exporting patients:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
};

// GET /api/export/checkups - Export all checkups data
exports.exportCheckups = async (req, res) => {
  try {
    const checkups = await Checkup.findAll({
      include: [
        {
          model: Patient,
          as: 'patient',
          attributes: ['id', 'name', 'category', 'gender', 'age']
        }
      ],
      order: [['date', 'DESC']]
    });

    const excelData = checkups.map(checkup => {
      const isBayi = checkup.patient.category === 'Bayi';
      
      const data = {
        'ID Pemeriksaan': checkup.id,
        'Nama Pasien': checkup.patient.name,
        'Kategori': checkup.patient.category,
        'Tanggal Pemeriksaan': new Date(checkup.date).toLocaleDateString('id-ID'),
        'Berat Badan (kg)': checkup.weight || '',
        'Tinggi Badan (cm)': checkup.height || ''
      };

      if (isBayi) {
        data['Lingkar Kepala (cm)'] = checkup.head_circumference || '';
      } else {
        data['Tekanan Darah Sistolik'] = checkup.blood_pressure_systolic || '';
        data['Tekanan Darah Diastolik'] = checkup.blood_pressure_diastolic || '';
        data['Gula Darah (mg/dL)'] = checkup.blood_sugar || '';
        data['Kolesterol (mg/dL)'] = checkup.cholesterol || '';
      }

      data['Catatan'] = checkup.notes || '';
      data['Tanggal Input'] = new Date(checkup.created_at).toLocaleDateString('id-ID');

      return data;
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Auto-size columns
    const maxWidth = 50;
    const columnWidths = {};
    
    excelData.forEach(row => {
      Object.keys(row).forEach(key => {
        const value = String(row[key] || '');
        const currentWidth = columnWidths[key] || 10;
        columnWidths[key] = Math.min(Math.max(currentWidth, value.length + 2), maxWidth);
      });
    });

    worksheet['!cols'] = Object.keys(excelData[0] || {}).map(key => ({
      wch: columnWidths[key] || 10
    }));

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Riwayat Pemeriksaan');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const filename = `Riwayat_Pemeriksaan_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    res.send(buffer);
  } catch (error) {
    console.error('Error exporting checkups:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
};

// GET /api/export/vitamins - Export vitamins data (for babies)
exports.exportVitamins = async (req, res) => {
  try {
    const vitamins = await Vitamin.findAll({
      include: [
        {
          model: Patient,
          as: 'patient',
          attributes: ['id', 'name', 'age', 'guardian_name'],
          where: { category: 'Bayi' }
        }
      ],
      order: [['date', 'DESC']]
    });

    const excelData = vitamins.map(vitamin => ({
      'ID Vitamin': vitamin.id,
      'Nama Anak': vitamin.patient.name,
      'Nama Orang Tua': vitamin.patient.guardian_name || '',
      'Usia': vitamin.patient.age,
      'Nama Vitamin': vitamin.vitamin_name,
      'Tanggal': new Date(vitamin.date).toLocaleDateString('id-ID'),
      'Status': vitamin.status,
      'Tanggal Input': new Date(vitamin.created_at).toLocaleDateString('id-ID')
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Auto-size columns
    const maxWidth = 50;
    const columnWidths = {};
    
    excelData.forEach(row => {
      Object.keys(row).forEach(key => {
        const value = String(row[key] || '');
        const currentWidth = columnWidths[key] || 10;
        columnWidths[key] = Math.min(Math.max(currentWidth, value.length + 2), maxWidth);
      });
    });

    worksheet['!cols'] = Object.keys(excelData[0] || {}).map(key => ({
      wch: columnWidths[key] || 10
    }));

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Vitamin');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const filename = `Data_Vitamin_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    res.send(buffer);
  } catch (error) {
    console.error('Error exporting vitamins:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
};

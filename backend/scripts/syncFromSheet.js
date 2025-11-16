const { google } = require('googleapis');
const { Patient, Checkup, Alert, Immunization, Milestone, sequelize } = require('../models');
require('dotenv').config();

/**
 * Google Sheets Sync Script
 * Menggunakan Service Account untuk autentikasi
 * Melakukan upsert data dari Google Sheets ke PostgreSQL
 */

// Konfigurasi Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

/**
 * Membaca data dari sheet tertentu
 */
async function readSheet(sheetName) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Z`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log(`No data found in sheet: ${sheetName}`);
      return [];
    }

    // Header adalah baris pertama
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header.toLowerCase().replace(/\s+/g, '_')] = row[index] || null;
      });
      return obj;
    });

    return data;
  } catch (error) {
    console.error(`Error reading sheet ${sheetName}:`, error.message);
    return [];
  }
}

/**
 * Sync patients dari Google Sheets
 */
async function syncPatients() {
  console.log('Syncing patients...');
  const data = await readSheet('patients');
  
  if (data.length === 0) {
    console.log('No patient data found in sheet');
    return;
  }

  console.log(`Read ${data.length} rows from patients sheet`);

  // Get IDs from Google Sheets
  const sheetIds = data.map(row => parseInt(row.id)).filter(id => !isNaN(id));
  
  // Delete patients that are not in Google Sheets anymore
  if (sheetIds.length > 0) {
    const deletedCount = await Patient.destroy({
      where: {
        id: {
          [require('sequelize').Op.notIn]: sheetIds
        }
      }
    });
    if (deletedCount > 0) {
      console.log(`🗑️  Deleted ${deletedCount} patients not in Google Sheets`);
    }
  }

  // Sync one by one to handle conflicts better
  let successCount = 0;
  let skipCount = 0;

  for (const row of data) {
    if (!row.name || !row.name.trim()) {
      skipCount++;
      continue;
    }

    const patient = {
      name: row.name?.trim(),
      age: row.age?.trim(),
      gender: row.gender?.trim(),
      category: row.category?.trim(),
      nik: row.nik?.trim() || null,
      guardian_name: row.guardian_name?.trim() || null,
      last_checkup_date: row.last_checkup_date ? new Date(row.last_checkup_date) : null,
      status: row.status?.trim() || 'Stabil'
    };

    // Validate required fields
    if (!patient.name || !patient.age || !patient.gender || !patient.category) {
      console.log(`Skipping invalid row: ${row.name}`);
      skipCount++;
      continue;
    }

    try {
      const id = row.id ? parseInt(row.id) : null;
      
      if (id) {
        // Try to update existing record
        const [updated] = await Patient.update(patient, { where: { id } });
        if (updated) {
          successCount++;
        } else {
          // Record doesn't exist, create with specific ID
          await Patient.create({ ...patient, id });
          successCount++;
        }
      } else {
        // Create without ID (auto-increment)
        await Patient.create(patient);
        successCount++;
      }
    } catch (error) {
      console.error(`Error syncing patient ${row.name}:`, error.message);
      skipCount++;
    }
  }

  console.log(`✓ Synced ${successCount} patients, skipped ${skipCount}`);
}

/**
 * Sync checkups dari Google Sheets
 */
async function syncCheckups() {
  console.log('Syncing checkups...');
  const data = await readSheet('checkups');
  
  if (data.length === 0) {
    console.log('No checkup data found');
    return;
  }

  // Get IDs from Google Sheets
  const sheetIds = data.map(row => parseInt(row.id)).filter(id => !isNaN(id));
  
  // Delete checkups that are not in Google Sheets anymore
  if (sheetIds.length > 0) {
    const deletedCount = await Checkup.destroy({
      where: {
        id: {
          [require('sequelize').Op.notIn]: sheetIds
        }
      }
    });
    if (deletedCount > 0) {
      console.log(`🗑️  Deleted ${deletedCount} checkups not in Google Sheets`);
    }
  }

  // Get all valid patient IDs from database
  const validPatients = await Patient.findAll({ attributes: ['id'] });
  const validPatientIds = new Set(validPatients.map(p => p.id));

  let successCount = 0;
  let skipCount = 0;

  for (const row of data) {
    if (!row.patient_id) {
      skipCount++;
      continue;
    }

    const patientId = parseInt(row.patient_id);

    // Check if patient exists
    if (!validPatientIds.has(patientId)) {
      console.log(`Skipping checkup for non-existent patient_id: ${patientId}`);
      skipCount++;
      continue;
    }

    const checkup = {
      patient_id: patientId,
      date: row.date ? new Date(row.date) : new Date(),
      weight: row.weight ? parseFloat(row.weight) : null,
      height: row.height ? parseFloat(row.height) : null,
      head_circumference: row.head_circumference ? parseFloat(row.head_circumference) : null,
      blood_pressure: row.blood_pressure || null,
      blood_sugar: row.blood_sugar ? parseInt(row.blood_sugar) : null
    };

    try {
      const id = row.id ? parseInt(row.id) : null;
      
      if (id) {
        // Try to update existing record
        const [updated] = await Checkup.update(checkup, { where: { id } });
        if (updated) {
          successCount++;
        } else {
          // Record doesn't exist, create with specific ID
          await Checkup.create({ ...checkup, id });
          successCount++;
        }
      } else {
        // Create without ID (auto-increment)
        await Checkup.create(checkup);
        successCount++;
      }
    } catch (error) {
      console.error(`Error syncing checkup for patient ${patientId}:`, error.message);
      skipCount++;
    }
  }

  console.log(`✓ Synced ${successCount} checkups, skipped ${skipCount}`);
}

/**
 * Sync alerts dari Google Sheets
 */
async function syncAlerts() {
  console.log('Syncing alerts...');
  const data = await readSheet('alerts');
  
  if (data.length === 0) {
    console.log('No alert data found');
    return;
  }

  // Get IDs from Google Sheets
  const sheetIds = data.map(row => parseInt(row.id)).filter(id => !isNaN(id));
  
  // Delete alerts that are not in Google Sheets anymore
  if (sheetIds.length > 0) {
    const deletedCount = await Alert.destroy({
      where: {
        id: {
          [require('sequelize').Op.notIn]: sheetIds
        }
      }
    });
    if (deletedCount > 0) {
      console.log(`🗑️  Deleted ${deletedCount} alerts not in Google Sheets`);
    }
  }

  const validPatients = await Patient.findAll({ attributes: ['id'] });
  const validPatientIds = new Set(validPatients.map(p => p.id));

  let successCount = 0;
  let skipCount = 0;

  for (const row of data) {
    const patientId = parseInt(row.patient_id);
    if (!patientId || !validPatientIds.has(patientId)) {
      console.log(`Skipping alert for invalid patient_id: ${row.patient_id}`);
      skipCount++;
      continue;
    }

    try {
      const id = row.id ? parseInt(row.id) : null;
      const alert = {
        patient_id: patientId,
        alert_type: row.alert_type,
        description: row.description
      };

      if (id) {
        const [updated] = await Alert.update(alert, { where: { id } });
        if (!updated) {
          await Alert.create({ ...alert, id });
        }
      } else {
        await Alert.create(alert);
      }
      successCount++;
    } catch (error) {
      console.error(`Error syncing alert:`, error.message);
      skipCount++;
    }
  }

  console.log(`✓ Synced ${successCount} alerts, skipped ${skipCount}`);
}

/**
 * Sync immunizations dari Google Sheets
 */
async function syncImmunizations() {
  console.log('Syncing immunizations...');
  const data = await readSheet('immunizations');
  
  if (data.length === 0) {
    console.log('No immunization data found');
    return;
  }

  // Get IDs from Google Sheets
  const sheetIds = data.map(row => parseInt(row.id)).filter(id => !isNaN(id));
  
  // Delete immunizations that are not in Google Sheets anymore
  if (sheetIds.length > 0) {
    const deletedCount = await Immunization.destroy({
      where: {
        id: {
          [require('sequelize').Op.notIn]: sheetIds
        }
      }
    });
    if (deletedCount > 0) {
      console.log(`🗑️  Deleted ${deletedCount} immunizations not in Google Sheets`);
    }
  }

  const validPatients = await Patient.findAll({ attributes: ['id'] });
  const validPatientIds = new Set(validPatients.map(p => p.id));

  let successCount = 0;
  let skipCount = 0;

  for (const row of data) {
    const patientId = parseInt(row.patient_id);
    if (!patientId || !validPatientIds.has(patientId)) {
      console.log(`Skipping immunization for invalid patient_id: ${row.patient_id}`);
      skipCount++;
      continue;
    }

    try {
      const id = row.id ? parseInt(row.id) : null;
      const immunization = {
        patient_id: patientId,
        vaccine_name: row.vaccine_name,
        status: row.status || 'Terjadwal',
        date: row.date ? new Date(row.date) : null
      };

      if (id) {
        const [updated] = await Immunization.update(immunization, { where: { id } });
        if (!updated) {
          await Immunization.create({ ...immunization, id });
        }
      } else {
        await Immunization.create(immunization);
      }
      successCount++;
    } catch (error) {
      console.error(`Error syncing immunization:`, error.message);
      skipCount++;
    }
  }

  console.log(`✓ Synced ${successCount} immunizations, skipped ${skipCount}`);
}

/**
 * Sync milestones dari Google Sheets
 */
async function syncMilestones() {
  console.log('Syncing milestones...');
  const data = await readSheet('milestones');
  
  if (data.length === 0) {
    console.log('No milestone data found');
    return;
  }

  // Get IDs from Google Sheets
  const sheetIds = data.map(row => parseInt(row.id)).filter(id => !isNaN(id));
  
  // Delete milestones that are not in Google Sheets anymore
  if (sheetIds.length > 0) {
    const deletedCount = await Milestone.destroy({
      where: {
        id: {
          [require('sequelize').Op.notIn]: sheetIds
        }
      }
    });
    if (deletedCount > 0) {
      console.log(`🗑️  Deleted ${deletedCount} milestones not in Google Sheets`);
    }
  }

  const validPatients = await Patient.findAll({ attributes: ['id'] });
  const validPatientIds = new Set(validPatients.map(p => p.id));

  let successCount = 0;
  let skipCount = 0;

  for (const row of data) {
    const patientId = parseInt(row.patient_id);
    if (!patientId || !validPatientIds.has(patientId)) {
      console.log(`Skipping milestone for invalid patient_id: ${row.patient_id}`);
      skipCount++;
      continue;
    }

    try {
      const id = row.id ? parseInt(row.id) : null;
      const milestone = {
        patient_id: patientId,
        milestone_name: row.milestone_name,
        achieved: row.achieved === 'true' || row.achieved === '1' || row.achieved === 'TRUE',
        date: row.date ? new Date(row.date) : null
      };

      if (id) {
        const [updated] = await Milestone.update(milestone, { where: { id } });
        if (!updated) {
          await Milestone.create({ ...milestone, id });
        }
      } else {
        await Milestone.create(milestone);
      }
      successCount++;
    } catch (error) {
      console.error(`Error syncing milestone:`, error.message);
      skipCount++;
    }
  }

  console.log(`✓ Synced ${successCount} milestones, skipped ${skipCount}`);
}

/**
 * Main sync function
 */
async function syncAll() {
  console.log('=== Starting Google Sheets Sync ===');
  console.log(`Spreadsheet ID: ${SPREADSHEET_ID}`);
  console.log('');

  try {
    // Test koneksi database
    await sequelize.authenticate();
    console.log('✓ Database connection established');
    console.log('');

    // Sync semua data
    await syncPatients();
    await syncCheckups();
    await syncAlerts();
    await syncImmunizations();
    await syncMilestones();

    console.log('');
    console.log('=== Sync completed successfully! ===');
  } catch (error) {
    console.error('=== Sync failed ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('Database connection closed');
  }
}

// Jalankan sync
syncAll();

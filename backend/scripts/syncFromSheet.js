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
  
  if (data.length === 0) return;

  const patients = data.map(row => ({
    id: parseInt(row.id) || null,
    name: row.name,
    age: row.age,
    gender: row.gender,
    category: row.category,
    nik: row.nik,
    guardian_name: row.guardian_name,
    last_checkup_date: row.last_checkup_date ? new Date(row.last_checkup_date) : null,
    status: row.status || 'Stabil',
    created_at: new Date(),
    updated_at: new Date()
  }));

  await Patient.bulkCreate(patients, {
    updateOnDuplicate: ['name', 'age', 'gender', 'category', 'nik', 'guardian_name', 'last_checkup_date', 'status', 'updated_at']
  });

  console.log(`✓ Synced ${patients.length} patients`);
}

/**
 * Sync checkups dari Google Sheets
 */
async function syncCheckups() {
  console.log('Syncing checkups...');
  const data = await readSheet('checkups');
  
  if (data.length === 0) return;

  const checkups = data.map(row => ({
    id: parseInt(row.id) || null,
    patient_id: parseInt(row.patient_id),
    date: row.date ? new Date(row.date) : new Date(),
    weight: row.weight ? parseFloat(row.weight) : null,
    height: row.height ? parseFloat(row.height) : null,
    head_circumference: row.head_circumference ? parseFloat(row.head_circumference) : null,
    blood_pressure: row.blood_pressure,
    blood_sugar: row.blood_sugar ? parseInt(row.blood_sugar) : null,
    created_at: new Date(),
    updated_at: new Date()
  }));

  await Checkup.bulkCreate(checkups, {
    updateOnDuplicate: ['patient_id', 'date', 'weight', 'height', 'head_circumference', 'blood_pressure', 'blood_sugar', 'updated_at']
  });

  console.log(`✓ Synced ${checkups.length} checkups`);
}

/**
 * Sync alerts dari Google Sheets
 */
async function syncAlerts() {
  console.log('Syncing alerts...');
  const data = await readSheet('alerts');
  
  if (data.length === 0) return;

  const alerts = data.map(row => ({
    id: parseInt(row.id) || null,
    patient_id: parseInt(row.patient_id),
    alert_type: row.alert_type,
    description: row.description,
    created_at: new Date(),
    updated_at: new Date()
  }));

  await Alert.bulkCreate(alerts, {
    updateOnDuplicate: ['patient_id', 'alert_type', 'description', 'updated_at']
  });

  console.log(`✓ Synced ${alerts.length} alerts`);
}

/**
 * Sync immunizations dari Google Sheets
 */
async function syncImmunizations() {
  console.log('Syncing immunizations...');
  const data = await readSheet('immunizations');
  
  if (data.length === 0) return;

  const immunizations = data.map(row => ({
    id: parseInt(row.id) || null,
    patient_id: parseInt(row.patient_id),
    vaccine_name: row.vaccine_name,
    status: row.status || 'Terjadwal',
    date: row.date ? new Date(row.date) : null,
    created_at: new Date(),
    updated_at: new Date()
  }));

  await Immunization.bulkCreate(immunizations, {
    updateOnDuplicate: ['patient_id', 'vaccine_name', 'status', 'date', 'updated_at']
  });

  console.log(`✓ Synced ${immunizations.length} immunizations`);
}

/**
 * Sync milestones dari Google Sheets
 */
async function syncMilestones() {
  console.log('Syncing milestones...');
  const data = await readSheet('milestones');
  
  if (data.length === 0) return;

  const milestones = data.map(row => ({
    id: parseInt(row.id) || null,
    patient_id: parseInt(row.patient_id),
    milestone_name: row.milestone_name,
    achieved: row.achieved === 'true' || row.achieved === '1' || row.achieved === 'TRUE',
    date: row.date ? new Date(row.date) : null,
    created_at: new Date(),
    updated_at: new Date()
  }));

  await Milestone.bulkCreate(milestones, {
    updateOnDuplicate: ['patient_id', 'milestone_name', 'achieved', 'date', 'updated_at']
  });

  console.log(`✓ Synced ${milestones.length} milestones`);
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

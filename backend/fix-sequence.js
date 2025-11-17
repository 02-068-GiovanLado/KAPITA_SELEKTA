const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function fixSequence() {
  try {
    console.log('🔧 Fixing patients ID sequence...');
    
    // Get max ID from patients table
    const maxIdResult = await pool.query('SELECT MAX(id) as max_id FROM patients');
    const maxId = maxIdResult.rows[0].max_id || 0;
    
    console.log(`📊 Current max ID: ${maxId}`);
    
    // Reset sequence to max_id + 1
    await pool.query(`SELECT setval('patients_id_seq', ${maxId + 1}, false)`);
    
    console.log(`✅ Sequence reset to: ${maxId + 1}`);
    console.log('✅ Fix completed! You can now insert new patients.');
    
  } catch (error) {
    console.error('❌ Error fixing sequence:', error);
  } finally {
    await pool.end();
  }
}

fixSequence();

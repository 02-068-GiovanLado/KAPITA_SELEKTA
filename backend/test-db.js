const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    console.log(`📍 Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log(`📁 Database: ${process.env.DB_NAME}`);
    console.log(`👤 User: ${process.env.DB_USER}`);
    
    const result = await pool.query(`
      SELECT id, name, age, gender, category, guardian_name, nik, status, 
             created_at 
      FROM patients 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    
    console.log('\n✅ Database connected successfully!');
    console.log(`\n📊 Total patients found: ${result.rows.length}`);
    console.log('\n📋 Latest patients:');
    console.log('─'.repeat(80));
    
    result.rows.forEach((patient, index) => {
      console.log(`\n${index + 1}. ID: ${patient.id}`);
      console.log(`   Nama: ${patient.name}`);
      console.log(`   Usia: ${patient.age}`);
      console.log(`   Gender: ${patient.gender}`);
      console.log(`   Kategori: ${patient.category}`);
      console.log(`   Wali: ${patient.guardian_name || '-'}`);
      console.log(`   NIK: ${patient.nik || '-'}`);
      console.log(`   Status: ${patient.status}`);
      console.log(`   Created: ${new Date(patient.created_at).toLocaleString('id-ID')}`);
    });
    
    console.log('\n' + '─'.repeat(80));
    
    // Check if Siti Aminah exists
    const sitiCheck = await pool.query(`
      SELECT * FROM patients 
      WHERE name ILIKE '%Siti%Aminah%' 
      ORDER BY created_at DESC 
      LIMIT 1
    `);
    
    if (sitiCheck.rows.length > 0) {
      console.log('\n✅ Found Siti Aminah in database!');
      console.log(JSON.stringify(sitiCheck.rows[0], null, 2));
    } else {
      console.log('\n❌ Siti Aminah NOT found in database!');
      console.log('⚠️  This means data from Telegram bot did not reach this database.');
    }
    
  } catch (error) {
    console.error('\n❌ Database error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

testDatabase();

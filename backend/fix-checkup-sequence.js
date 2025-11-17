require('dotenv').config();
const { sequelize } = require('./models');

async function fixCheckupSequence() {
  try {
    console.log('🔍 Checking checkups sequence...');
    
    // Get max ID from checkups table
    const [results] = await sequelize.query(
      'SELECT MAX(id) as max_id FROM checkups'
    );
    const maxId = results[0].max_id || 0;
    console.log(`📊 Current max checkup ID: ${maxId}`);
    
    // Get current sequence value
    const [seqResults] = await sequelize.query(
      "SELECT last_value FROM checkups_id_seq"
    );
    const currentSeq = seqResults[0].last_value;
    console.log(`📊 Current sequence value: ${currentSeq}`);
    
    // Fix sequence if needed
    if (currentSeq <= maxId) {
      const newSeq = maxId + 1;
      await sequelize.query(
        `ALTER SEQUENCE checkups_id_seq RESTART WITH ${newSeq}`
      );
      console.log(`✅ Sequence updated to: ${newSeq}`);
    } else {
      console.log('✅ Sequence is correct, no fix needed');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixCheckupSequence();

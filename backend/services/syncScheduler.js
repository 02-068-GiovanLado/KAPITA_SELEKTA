const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');
require('dotenv').config();

/**
 * Auto-sync scheduler untuk Google Sheets
 * Interval bisa diatur via .env (AUTO_SYNC_INTERVAL dalam menit)
 */
function startAutoSync() {
  const interval = parseInt(process.env.AUTO_SYNC_INTERVAL || 5);
  
  if (interval === 0) {
    console.log('ℹ️  Auto-sync disabled (AUTO_SYNC_INTERVAL=0)');
    return;
  }

  // Convert minutes to cron format
  const cronPattern = `*/${interval} * * * *`;
  
  cron.schedule(cronPattern, () => {
    console.log(`⏰ Running scheduled Google Sheets sync (every ${interval} minutes)...`);
    
    const scriptPath = path.join(__dirname, '../scripts/syncFromSheet.js');
    
    exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Auto-sync error:', error.message);
        return;
      }
      if (stderr && !stderr.includes('Debugger')) {
        console.error('Auto-sync stderr:', stderr);
      }
      // Log success message only
      const successMatch = stdout.match(/=== Sync completed successfully! ===/);
      if (successMatch) {
        console.log('✅ Auto-sync completed successfully');
      }
    });
  });

  console.log(`✅ Auto-sync scheduler started (runs every ${interval} minutes)`);
}

module.exports = { startAutoSync };

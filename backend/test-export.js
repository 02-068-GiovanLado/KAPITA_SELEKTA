const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = process.env.API_URL || 'http://localhost:5000';

console.log('========================================');
console.log('🧪 Testing Export Endpoints');
console.log('========================================\n');

async function testExport(endpoint, filename) {
  try {
    console.log(`Testing: GET ${endpoint}`);
    
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      responseType: 'arraybuffer'
    });
    
    const fileSize = (response.data.length / 1024).toFixed(2);
    console.log(`✅ Success - ${fileSize} KB`);
    console.log(`   Content-Type: ${response.headers['content-type']}`);
    console.log(`   Content-Disposition: ${response.headers['content-disposition']}`);
    
    // Optionally save file for manual inspection
    if (process.env.SAVE_FILES === 'true') {
      const testDir = path.join(__dirname, 'test-exports');
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir);
      }
      const filePath = path.join(testDir, filename);
      fs.writeFileSync(filePath, response.data);
      console.log(`   Saved to: ${filePath}`);
    }
    
    console.log('');
    return true;
  } catch (error) {
    console.log(`❌ Failed`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data.error || error.message}`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
    console.log('');
    return false;
  }
}

async function runTests() {
  let passed = 0;
  let failed = 0;
  
  // Test 1: Export all patients
  if (await testExport('/api/export/patients', 'test_all_patients.xlsx')) {
    passed++;
  } else {
    failed++;
  }
  
  // Test 2: Export babies only
  if (await testExport('/api/export/patients?category=Bayi', 'test_babies.xlsx')) {
    passed++;
  } else {
    failed++;
  }
  
  // Test 3: Export adults only
  if (await testExport('/api/export/patients?category=Dewasa', 'test_adults.xlsx')) {
    passed++;
  } else {
    failed++;
  }
  
  // Test 4: Export checkups
  if (await testExport('/api/export/checkups', 'test_checkups.xlsx')) {
    passed++;
  } else {
    failed++;
  }
  
  // Test 5: Export vitamins
  if (await testExport('/api/export/vitamins', 'test_vitamins.xlsx')) {
    passed++;
  } else {
    failed++;
  }
  
  console.log('========================================');
  console.log('📊 Test Results');
  console.log('========================================');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  console.log('========================================\n');
  
  if (failed === 0) {
    console.log('🎉 All export endpoints working correctly!\n');
    console.log('💡 Tip: Set SAVE_FILES=true to save test files for inspection');
    console.log('   Example: SAVE_FILES=true node test-export.js\n');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.\n');
  }
  
  process.exit(failed > 0 ? 1 : 0);
}

// Check if server is running
axios.get(`${API_BASE_URL}/health`)
  .then(() => {
    console.log(`✓ Server is running at ${API_BASE_URL}\n`);
    runTests();
  })
  .catch(() => {
    console.log(`❌ Server is not running at ${API_BASE_URL}`);
    console.log('   Please start the backend server first: npm start\n');
    process.exit(1);
  });

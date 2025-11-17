// Simple test untuk security features
const axios = require('axios');

const API_URL = 'http://localhost:5000';

async function testSecurity() {
  console.log('🧪 Testing HealthMon Security Features\n');
  
  // Test 1: Health Check
  console.log('1️⃣ Test Health Check...');
  try {
    const response = await axios.get(`${API_URL}/health`);
    console.log('✅ Health check OK:', response.data.status);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }
  
  // Test 2: Login dengan credentials benar
  console.log('\n2️⃣ Test Login dengan credentials benar...');
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      username: 'admin_tarahan',
      password: 'admin_tarahan123'
    });
    console.log('✅ Login successful:', response.data.message);
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data || error.message);
  }
  
  // Test 3: Login dengan credentials salah
  console.log('\n3️⃣ Test Login dengan credentials salah...');
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      username: 'wrong',
      password: 'wrong'
    });
    console.log('❌ Should not reach here');
  } catch (error) {
    console.log('✅ Login rejected:', error.response?.data?.error);
  }
  
  // Test 4: Rate Limiting (6x login attempts)
  console.log('\n4️⃣ Test Rate Limiting (trying 6 failed logins)...');
  for (let i = 1; i <= 6; i++) {
    try {
      await axios.post(`${API_URL}/api/auth/login`, {
        username: 'test',
        password: 'test'
      });
    } catch (error) {
      if (error.response?.status === 429) {
        console.log(`✅ Attempt ${i}: Rate limit triggered! Message: "${error.response.data}"`);
      } else {
        console.log(`   Attempt ${i}: Failed (${error.response?.data?.error || error.message})`);
      }
    }
    await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms between attempts
  }
  
  // Test 5: Input Validation
  console.log('\n5️⃣ Test Input Validation...');
  try {
    const response = await axios.post(`${API_URL}/api/patients`, {
      name: '',  // Empty name should fail
      gender: 'Invalid',  // Invalid gender
      category: 'Invalid'  // Invalid category
    });
    console.log('❌ Should not accept invalid data');
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✅ Input validation working! Errors:', error.response.data.errors?.length || 0);
    } else {
      console.log('⚠️ Unexpected error:', error.response?.status);
    }
  }
  
  // Test 6: Security Headers
  console.log('\n6️⃣ Test Security Headers...');
  try {
    const response = await axios.get(`${API_URL}/health`);
    const headers = response.headers;
    const securityHeaders = [
      'x-frame-options',
      'x-content-type-options',
      'x-xss-protection',
      'strict-transport-security'
    ];
    
    let found = 0;
    securityHeaders.forEach(header => {
      if (headers[header]) {
        console.log(`✅ ${header}: ${headers[header]}`);
        found++;
      }
    });
    
    if (found > 0) {
      console.log(`✅ Security headers present (${found}/${securityHeaders.length})`);
    } else {
      console.log('⚠️ No security headers found');
    }
  } catch (error) {
    console.log('❌ Error checking headers:', error.message);
  }
  
  console.log('\n🎉 Security tests completed!\n');
}

// Run tests
testSecurity().catch(console.error);

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let token = '';
let userId = '';

async function testUserAuth() {
  try {
    console.log('Starting Supabase Auth tests...');
    
    // Register user
    console.log('\n1. Register User Test:');
    const username = `testuser_${Date.now()}`;
    const email = `test_${Date.now()}@example.com`;
    
    const registerRes = await axios.post(`${API_URL}/users/register`, {
      username,
      email,
      password: 'password123'
    });
    
    console.log('✅ Register Success:', registerRes.data.user.email);
    token = registerRes.data.session?.access_token;
    userId = registerRes.data.user.id;
    
    if (!token) {
      console.log('⚠️ Note: No session returned. This is normal for the first registration as email confirmation may be required.');
      console.log('You may need to disable email confirmation in Supabase for testing or confirm the email first.');
      return;
    }
    
    // Login user
    console.log('\n2. Login User Test:');
    const loginRes = await axios.post(`${API_URL}/users/login`, {
      email,
      password: 'password123'
    });
    
    console.log('✅ Login Success:', loginRes.data.user.email);
    token = loginRes.data.session.access_token;
    
    // Get user profile
    console.log('\n3. Get User Profile Test:');
    const profileRes = await axios.get(
      `${API_URL}/users/me`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    console.log('✅ Profile Retrieved:', profileRes.data.email);
    
    console.log('\nAll user auth tests completed successfully!');
    
  } catch (error) {
    console.error('❌ TEST FAILED:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received from server');
    } else {
      console.error('Error message:', error.message);
    }
  }
}

// Run the tests
testUserAuth();
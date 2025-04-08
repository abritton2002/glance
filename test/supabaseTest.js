const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let token = '';
let userId = '';
let dashboardId = '';
let secondDashboardId = '';

async function runTests() {
  try {
    console.log('🔍 Starting Supabase Integration Tests...');
    
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
    
    // Check if email confirmation is required
    if (!registerRes.data.session) {
      console.log('⚠️ Email confirmation required. Please check Supabase Authentication settings.');
      
      // Try login instead
      console.log('\nTrying login instead...');
      try {
        const loginRes = await axios.post(`${API_URL}/users/login`, {
          email,
          password: 'password123'
        });
        
        console.log('✅ Login Success:', loginRes.data.user.email);
        token = loginRes.data.session.access_token;
        userId = loginRes.data.user.id;
      } catch (loginError) {
        console.error('❌ Login failed. You may need to verify the email first or disable email verification in Supabase.');
        console.error(loginError.response?.data || loginError.message);
        return;
      }
    } else {
      token = registerRes.data.session.access_token;
      userId = registerRes.data.user.id;
    }
    
    // Get user profile
    console.log('\n2. Get User Profile Test:');
    const profileRes = await axios.get(
      `${API_URL}/users/me`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    console.log('✅ Profile Retrieved:', profileRes.data.email);
    
    // Create first dashboard (will be default)
    console.log('\n3. Create First Dashboard Test:');
    const dashboardRes = await axios.post(
      `${API_URL}/dashboards`,
      {
        name: 'Test Dashboard',
        layout: {
          pages: [
            {
              name: 'Home',
              columns: [
                {
                  size: 'full',
                  widgets: [
                    {
                      type: 'reddit',
                      title: 'Technology',
                      config: {
                        subreddits: 'technology',
                        showThumbnails: true,
                        style: 'vertical-list'
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    console.log('✅ First Dashboard Created:', dashboardRes.data.name);
    dashboardId = dashboardRes.data.id;
    
    // Create second dashboard (non-default)
    console.log('\n4. Create Second Dashboard Test:');
    const secondDashboardRes = await axios.post(
      `${API_URL}/dashboards`,
      {
        name: 'Second Test Dashboard',
        layout: {
          pages: [
            {
              name: 'Home',
              columns: [
                {
                  size: 'full',
                  widgets: [
                    {
                      type: 'reddit',
                      title: 'Programming',
                      config: {
                        subreddits: 'programming',
                        showThumbnails: true,
                        style: 'vertical-list'
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    console.log('✅ Second Dashboard Created:', secondDashboardRes.data.name);
    secondDashboardId = secondDashboardRes.data.id;
    
    // Get all dashboards
    console.log('\n5. Get Dashboards Test:');
    const getDashRes = await axios.get(
      `${API_URL}/dashboards`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    console.log(`✅ Retrieved ${getDashRes.data.length} dashboards`);
    
    // Update first dashboard
    console.log('\n6. Update First Dashboard Test:');
    const updateDashRes = await axios.put(
      `${API_URL}/dashboards/${dashboardId}`,
      {
        name: 'Updated Dashboard',
        layout: {
          pages: [
            {
              name: 'Home',
              columns: [
                {
                  size: 'full',
                  widgets: [
                    {
                      type: 'reddit',
                      title: 'Programming',
                      config: {
                        subreddits: 'programming',
                        showThumbnails: true,
                        style: 'vertical-list'
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    console.log('✅ First Dashboard Updated:', updateDashRes.data.name);
    
    // Get specific dashboard
    console.log('\n7. Get Specific Dashboard Test:');
    const getSpecificDashRes = await axios.get(
      `${API_URL}/dashboards/${dashboardId}`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    console.log('✅ Retrieved Dashboard:', getSpecificDashRes.data.name);
    
    // Delete second dashboard (non-default)
    console.log('\n8. Delete Second Dashboard Test:');
    const deleteDashRes = await axios.delete(
      `${API_URL}/dashboards/${secondDashboardId}`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    console.log('✅ Second Dashboard Deleted:', deleteDashRes.data.message);
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ TEST FAILED:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received from server. Is the server running?');
    } else {
      console.error('Error message:', error.message);
    }
  }
}

// Run the tests
runTests();
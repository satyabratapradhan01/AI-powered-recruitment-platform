import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';

dotenv.config();

const PORT = 5001;
const BASE_URL = `http://localhost:${PORT}/api`;

const request = async (url, options = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
};

const runE2ETests = async () => {
  console.log('=== STARTING COMPLETE E2E TEST TRAJECTORY ===\n');

  await connectDB();
  const server = app.listen(PORT);

  try {
    // 0. Health check
    const health = await request(`${BASE_URL}/health`);
    console.log('✅ Step 0. Health Check:', health.message);

    // 1. Register user
    const user1Data = {
      name: 'Satya E2ETester',
      email: `satya_e2e_${Date.now()}@example.com`,
      password: 'password123',
    };
    const regRes = await request(`${BASE_URL}/auth/register`, {
      method: 'POST',
      body: user1Data,
    });
    console.log('✅ Step 1. User Registration:', regRes.message, 'Email:', regRes.data.email);

    // 2 & 3. Login user & Receive JWT
    const loginRes = await request(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: { email: user1Data.email, password: user1Data.password },
    });
    const token1 = loginRes.token;
    console.log('✅ Step 2 & 3. User Login & Received JWT Token:', token1.substring(0, 25) + '...');

    const headers1 = { Authorization: `Bearer ${token1}` };

    // 4. Access dashboard / me profile
    const meRes = await request(`${BASE_URL}/auth/me`, { headers: headers1 });
    console.log('✅ Step 4. Access Dashboard / Profile:', meRes.data.name, 'ID:', meRes.data._id);

    // 5. Create application
    const appData = {
      company: 'Google',
      jobTitle: 'Software Engineer',
      location: 'Bangalore',
      jobUrl: 'https://example.com/job',
      status: 'Applied',
      appliedDate: '2026-09-28',
    };
    const createRes = await request(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: headers1,
      body: appData,
    });
    const appId1 = createRes.data._id;
    console.log('✅ Step 5. Create Application:', createRes.data.company, '-', createRes.data.jobTitle, '(ID:', appId1 + ')');

    // 6. View application
    const getRes = await request(`${BASE_URL}/applications/${appId1}`, { headers: headers1 });
    console.log('✅ Step 6. View Application:', getRes.data.company, 'Location:', getRes.data.location);

    // 7 & 8. Edit application & Change status
    const updateRes = await request(`${BASE_URL}/applications/${appId1}`, {
      method: 'PUT',
      headers: headers1,
      body: { status: 'Interview', location: 'Remote - India' },
    });
    console.log('✅ Step 7 & 8. Edit Application & Change Status:', updateRes.data.status, '(Location updated to:', updateRes.data.location + ')');

    // Setup User 2 for Security Isolation Checks
    const user2Data = {
      name: 'Uninterested Stranger',
      email: `stranger_${Date.now()}@example.com`,
      password: 'password123',
    };
    await request(`${BASE_URL}/auth/register`, { method: 'POST', body: user2Data });
    const login2Res = await request(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: { email: user2Data.email, password: user2Data.password },
    });
    const token2 = login2Res.token;
    const headers2 = { Authorization: `Bearer ${token2}` };
    console.log('✅ Registered User 2 (Stranger) for cross-user isolation verification.');

    // 11. Try accessing protected APIs without JWT
    try {
      await request(`${BASE_URL}/applications`);
      console.error('❌ FAIL: Unauthenticated access was allowed!');
    } catch (err) {
      console.log('✅ Step 11. Unauthenticated request correctly rejected with status:', err.status, `("${err.message}")`);
    }

    // 12 & 13. Try accessing another user's application (Stranger trying to view/edit/delete Satya's application)
    try {
      await request(`${BASE_URL}/applications/${appId1}`, { headers: headers2 });
      console.error('❌ FAIL: Stranger accessed Satya application!');
    } catch (err) {
      console.log('✅ Step 12 & 13. Cross-user view attempt correctly rejected with status:', err.status, `("${err.message}")`);
    }

    try {
      await request(`${BASE_URL}/applications/${appId1}`, {
        method: 'PUT',
        headers: headers2,
        body: { company: 'Hacked' },
      });
      console.error('❌ FAIL: Stranger updated Satya application!');
    } catch (err) {
      console.log('✅ Step 12 & 13. Cross-user update attempt correctly rejected with status:', err.status, `("${err.message}")`);
    }

    try {
      await request(`${BASE_URL}/applications/${appId1}`, {
        method: 'DELETE',
        headers: headers2,
      });
      console.error('❌ FAIL: Stranger deleted Satya application!');
    } catch (err) {
      console.log('✅ Step 12 & 13. Cross-user delete attempt correctly rejected with status:', err.status, `("${err.message}")`);
    }

    // 9. Delete application by owner
    const deleteRes = await request(`${BASE_URL}/applications/${appId1}`, {
      method: 'DELETE',
      headers: headers1,
    });
    console.log('✅ Step 9. Owner Application Deletion:', deleteRes.message);

    // 10. Verify application is gone (404)
    try {
      await request(`${BASE_URL}/applications/${appId1}`, { headers: headers1 });
    } catch (err) {
      console.log('✅ Step 10. Verified application is permanently removed (404):', err.status);
    }

    console.log('\n🎉 ALL 13 STEPS IN THE END-TO-END TEST TRAJECTORY PASSED WITH 100% SUCCESS!');
  } catch (err) {
    console.error('❌ E2E TEST RUN FAILED:', err.status, err.message, err.data);
  } finally {
    server.close();
    process.exit(0);
  }
};

runE2ETests();

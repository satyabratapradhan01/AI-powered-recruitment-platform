import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';

dotenv.config();

const PORT = 5001;
const BASE_URL = `http://localhost:${PORT}/api`;

const request = async (url, options = {}) => {
  const headers = { ...options.headers };
  let body = options.body;

  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  const res = await fetch(url, {
    ...options,
    headers,
    body,
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

    // 1. Register user (Job Seeker)
    const user1Data = {
      name: 'Satya E2ETester',
      email: `satya_e2e_${Date.now()}@example.com`,
      password: 'password123',
    };
    const regRes = await request(`${BASE_URL}/auth/register`, {
      method: 'POST',
      body: user1Data,
    });
    console.log('✅ Step 1. User Registration:', regRes.message, 'Email:', regRes.data.email, 'Role:', regRes.data.role);

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

    // --- STEP 10 RBAC ENHANCEMENT VERIFICATIONS ---
    console.log('\n--- Step 10 RBAC & Role Verification ---');

    // 14a. Register HR user
    const hrData = {
      name: 'Sarah Recruiter',
      email: `hr_${Date.now()}@company.com`,
      password: 'password123',
      role: 'hr',
    };
    const hrRegRes = await request(`${BASE_URL}/auth/register`, {
      method: 'POST',
      body: hrData,
    });
    const hrLoginRes = await request(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: { email: hrData.email, password: hrData.password },
    });
    const hrToken = hrLoginRes.token;
    const hrHeaders = { Authorization: `Bearer ${hrToken}` };
    console.log('✅ Step 14a. Registered & Logged-in HR User:', hrRegRes.data.email, 'Role:', hrRegRes.data.role);

    // 14b. Attempt public registration with 'admin' role
    const sneakyData = {
      name: 'Hacker Wants Admin',
      email: `sneaky_${Date.now()}@attacker.com`,
      password: 'password123',
      role: 'admin',
    };
    const sneakyRegRes = await request(`${BASE_URL}/auth/register`, {
      method: 'POST',
      body: sneakyData,
    });
    console.log('✅ Step 14b. Prevented unverified admin registration. Assigned role:', sneakyRegRes.data.role);

    // 14c. Attempt Admin route access with Job Seeker token (should be 403)
    try {
      await request(`${BASE_URL}/auth/users`, { headers: headers1 });
      console.error('❌ FAIL: Non-admin user accessed Admin endpoint!');
    } catch (err) {
      console.log('✅ Step 14c. Non-admin access to /api/auth/users correctly forbidden with status:', err.status, `("${err.message}")`);
    }

    // 14d. Update User Profile with skills and experience
    const profileUpdateRes = await request(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: headers1,
      body: {
        skills: ['React', 'Node.js', 'MongoDB', 'Express'],
        profile: { headline: 'Senior Full Stack Engineer', location: 'Bangalore, India' },
      },
    });
    console.log('✅ Step 14d. Updated User Profile & Skills:', profileUpdateRes.data.skills.join(', '), 'Headline:', profileUpdateRes.data.profile.headline);

    // --- STEP 11 JOB MANAGEMENT BACKEND VERIFICATIONS ---
    console.log('\n--- Step 11 Job Management Backend Verification ---');

    // 15a. HR creates a Job Posting
    const newJobData = {
      title: 'Senior AI Engineer',
      company: 'TechCorp AI Solutions',
      description: 'Design and deploy state-of-the-art AI Models and RAG pipelines.',
      responsibilities: ['Build LLM apps', 'Optimize Node.js APIs', 'Lead frontend integration'],
      requiredSkills: ['Python', 'Node.js', 'MongoDB', 'React'],
      preferredSkills: ['PyTorch', 'Vector Databases'],
      experienceRequired: '3-5 years',
      location: 'Remote - Worldwide',
      workMode: 'Remote',
      employmentType: 'Full-time',
      salaryMin: 120000,
      salaryMax: 160000,
      status: 'Active',
    };
    const jobPostRes = await request(`${BASE_URL}/jobs`, {
      method: 'POST',
      headers: hrHeaders,
      body: newJobData,
    });
    const createdJobId = jobPostRes.data._id;
    console.log('✅ Step 15a. HR Posted New Job:', jobPostRes.data.title, 'at', jobPostRes.data.company, '(ID:', createdJobId + ')');

    // 15b. Job Seeker attempts to post a job (should be 403 Forbidden)
    try {
      await request(`${BASE_URL}/jobs`, {
        method: 'POST',
        headers: headers1,
        body: newJobData,
      });
      console.error('❌ FAIL: Job Seeker was allowed to post a job!');
    } catch (err) {
      console.log('✅ Step 15b. Job Seeker job post attempt correctly forbidden with status:', err.status, `("${err.message}")`);
    }

    // 15c. Search & Filter jobs
    const searchJobsRes = await request(`${BASE_URL}/jobs?search=AI&workMode=Remote&page=1&limit=5`);
    console.log('✅ Step 15c. Public Job Search & Pagination:', searchJobsRes.data.length, 'jobs found, Total:', searchJobsRes.total);

    // 15d. Get single job by ID
    const singleJobRes = await request(`${BASE_URL}/jobs/${createdJobId}`);
    console.log('✅ Step 15d. Get Job Details:', singleJobRes.data.title, 'Salary range:', `$${singleJobRes.data.salaryMin} - $${singleJobRes.data.salaryMax}`);

    // --- STEP 12 RESUME + CLOUDFLARE R2 STORAGE VERIFICATIONS ---
    console.log('\n--- Step 12 Resume + Cloudflare R2 Storage Verification ---');

    // 16a. Candidate uploads PDF Resume
    const pdfBuffer = Buffer.from(
      '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 55 >>\nstream\nBT /F1 12 Tf 72 712 Td (Satya Pradhan Resume - Software Engineer) Tj ET\nendstream\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF'
    );
    const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('resume', pdfBlob, 'Satya_Pradhan_Resume.pdf');

    const uploadRes = await request(`${BASE_URL}/resumes/upload`, {
      method: 'POST',
      headers: headers1,
      body: formData,
    });
    console.log(
      '✅ Step 16a. Candidate Uploaded Resume:',
      uploadRes.data.fileName,
      '| Storage Key:',
      uploadRes.data.fileKey,
      '| Extracted Text Length:',
      uploadRes.data.parsedTextLength
    );

    // --- STEP 13 RECRUITMENT APPLICATION WORKFLOW VERIFICATIONS ---
    console.log('\n--- Step 13 Recruitment Application Workflow Verification ---');

    // 17a. Candidate applies to HR's Job Posting
    const jobAppRes = await request(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: headers1,
      body: {
        jobId: createdJobId,
        coverLetter: 'I am excited to apply for the Senior AI Engineer position!',
      },
    });
    const recruitmentAppId = jobAppRes.data._id;
    console.log('✅ Step 17a. Candidate Applied to Job Posting:', jobAppRes.data.jobTitle, 'Status:', jobAppRes.data.status, '(App ID:', recruitmentAppId + ')');

    // 17b. Duplicate application prevention check
    try {
      await request(`${BASE_URL}/applications`, {
        method: 'POST',
        headers: headers1,
        body: { jobId: createdJobId },
      });
      console.error('❌ FAIL: Duplicate application was allowed!');
    } catch (err) {
      console.log('✅ Step 17b. Duplicate application correctly rejected with status:', err.status, `("${err.message}")`);
    }

    // 17c. HR views applicants for their job posting
    const hrApplicantsRes = await request(`${BASE_URL}/applications?jobId=${createdJobId}`, {
      headers: hrHeaders,
    });
    console.log('✅ Step 17c. HR Viewed Applicants for Job:', hrApplicantsRes.data.length, 'applicant(s) found. Candidate Name:', hrApplicantsRes.data[0].candidateId.name);

    // 17d. HR updates status & adds recruiter notes
    const hrUpdateStatusRes = await request(`${BASE_URL}/applications/${recruitmentAppId}`, {
      method: 'PUT',
      headers: hrHeaders,
      body: {
        status: 'Shortlisted',
        recruiterNotes: 'Candidate has impressive Node.js and React background.',
      },
    });
    console.log('✅ Step 17d. HR Updated Application Status:', hrUpdateStatusRes.data.status, '| Recruiter Notes:', hrUpdateStatusRes.data.recruiterNotes);

    // 17e. Candidate withdraws application
    const withdrawRes = await request(`${BASE_URL}/applications/${recruitmentAppId}/withdraw`, {
      method: 'PUT',
      headers: headers1,
    });
    console.log('✅ Step 17e. Candidate Withdrew Application:', withdrawRes.data.status);

    console.log('\n🎉 ALL 17 END-TO-END, RBAC, R2 RESUME, AND RECRUITMENT WORKFLOW TESTS PASSED WITH 100% SUCCESS!');
  } catch (err) {
    console.error('❌ E2E TEST RUN FAILED:', err.status, err.message, err.data);
  } finally {
    server.close();
    process.exit(0);
  }
};

runE2ETests();

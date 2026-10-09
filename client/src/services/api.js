import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token to Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated 401 token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if unauthorized / token expired
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

/* ==========================================================================
   1. AUTH & PROFILE API SERVICES
   ========================================================================== */
export const registerApi = (data) => api.post('/auth/register', data);
export const loginApi = (data) => api.post('/auth/login', data);
export const getMeApi = () => api.get('/auth/me');
export const updateProfileApi = (data) => api.put('/auth/profile', data);
export const getUsersApi = (params) => api.get('/auth/users', { params });
export const updateUserStatusApi = (id, status) => api.put(`/auth/users/${id}/status`, { status });

/* ==========================================================================
   2. RESUME API SERVICES
   ========================================================================== */
export const uploadResumeApi = (formData) =>
  api.post('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const getMyResumeApi = () => api.get('/resumes/my-resume');
export const getCandidateResumeApi = (userId) => api.get(`/resumes/candidate/${userId}`);
export const deleteResumeApi = () => api.delete('/resumes');

/* ==========================================================================
   3. JOBS API SERVICES
   ========================================================================== */
export const getJobsApi = (params) => api.get('/jobs', { params });
export const getJobByIdApi = (id) => api.get(`/jobs/${id}`);
export const createJobApi = (data) => api.post('/jobs', data);
export const updateJobApi = (id, data) => api.put(`/jobs/${id}`, data);
export const deleteJobApi = (id) => api.delete(`/jobs/${id}`);
export const getRecommendedJobsApi = () => api.get('/jobs/recommended');
export const getCandidateMatchesApi = (jobId) => api.get(`/jobs/${jobId}/candidate-matches`);

/* ==========================================================================
   4. APPLICATIONS API SERVICES
   ========================================================================== */
export const getApplicationsApi = (params) => api.get('/applications', { params });
export const getApplicationByIdApi = (id) => api.get(`/applications/${id}`);
export const createApplicationApi = (data) => api.post('/applications', data);
export const updateApplicationApi = (id, data) => api.put(`/applications/${id}`, data);
export const withdrawApplicationApi = (id) => api.put(`/applications/${id}/withdraw`);
export const deleteApplicationApi = (id) => api.delete(`/applications/${id}`);
export const triggerATSAnalysisApi = (id) => api.post(`/applications/${id}/ats-analysis`);
export const sendOfferLetterApi = (id, data) => api.post(`/applications/${id}/offer`, data);
export const respondToOfferLetterApi = (id, data) => api.put(`/applications/${id}/offer/respond`, data);

/* ==========================================================================
   5. INTERVIEWS API SERVICES
   ========================================================================== */
export const getInterviewsApi = (params) => api.get('/interviews', { params });
export const getInterviewByIdApi = (id) => api.get(`/interviews/${id}`);
export const scheduleInterviewApi = (data) => api.post('/interviews', data);
export const rescheduleInterviewApi = (id, data) => api.put(`/interviews/${id}/reschedule`, data);
export const completeInterviewApi = (id, data) => api.put(`/interviews/${id}/complete`, data);
export const cancelInterviewApi = (id, data) => api.put(`/interviews/${id}/cancel`, data);
export const generateInterviewPrepApi = (data) => api.post('/interviews/prep/generate', data);
export const evaluateInterviewAnswerApi = (data) => api.post('/interviews/prep/feedback', data);

/* ==========================================================================
   6. NOTIFICATIONS API SERVICES
   ========================================================================== */
export const getNotificationsApi = () => api.get('/notifications');
export const markNotificationReadApi = (id) => api.patch(`/notifications/${id}/read`);
export const markAllNotificationsReadApi = () => api.patch('/notifications/read-all');

export default api;

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

// Auth API services
export const registerApi = (data) => api.post('/auth/register', data);
export const loginApi = (data) => api.post('/auth/login', data);
export const getMeApi = () => api.get('/auth/me');

// Applications API services
export const getApplicationsApi = () => api.get('/applications');
export const getApplicationByIdApi = (id) => api.get(`/applications/${id}`);
export const createApplicationApi = (data) => api.post('/applications', data);
export const updateApplicationApi = (id, data) => api.put(`/applications/${id}`, data);
export const deleteApplicationApi = (id) => api.delete(`/applications/${id}`);

// Jobs API services
export const getRecommendedJobsApi = () => api.get('/jobs/recommended');
export const getCandidateMatchesApi = (jobId) => api.get(`/jobs/${jobId}/candidate-matches`);

export default api;

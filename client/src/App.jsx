import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Layout from './components/Layout';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

// Job Seeker Pages
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Applications from './pages/Applications';
import ApplicationNew from './pages/ApplicationNew';
import ApplicationEdit from './pages/ApplicationEdit';
import Interviews from './pages/Interviews';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

// HR Recruiter Pages
import HRDashboard from './pages/hr/HRDashboard';
import HRJobs from './pages/hr/HRJobs';
import HRJobCreate from './pages/hr/HRJobCreate';
import HRApplicants from './pages/hr/HRApplicants';
import HRInterviews from './pages/hr/HRInterviews';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Landing Page Route */}
            <Route path="/" element={<LandingPage />} />

            {/* Public Unauthenticated Auth Routes */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected Authenticated Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                {/* Candidate Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/applications/new" element={<ApplicationNew />} />
                <Route path="/applications/:id/edit" element={<ApplicationEdit />} />
                <Route path="/interviews" element={<Interviews />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />

                {/* HR Recruiter Routes */}
                <Route path="/hr/dashboard" element={<HRDashboard />} />
                <Route path="/hr/jobs" element={<HRJobs />} />
                <Route path="/hr/jobs/new" element={<HRJobCreate />} />
                <Route path="/hr/jobs/:id/edit" element={<HRJobCreate />} />
                <Route path="/hr/applicants" element={<HRApplicants />} />
                <Route path="/hr/interviews" element={<HRInterviews />} />
              </Route>
            </Route>

            {/* Fallback Catch-all Route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

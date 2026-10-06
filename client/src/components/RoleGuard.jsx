import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingState from './ui/LoadingState';

const RoleGuard = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingState message="Verifying role permissions..." fullScreen />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const rawRole = user.role || 'seeker';
  const normalizedRole = rawRole === 'job_seeker' ? 'seeker' : rawRole;

  const isAllowed =
    allowedRoles.length === 0 ||
    allowedRoles.includes(rawRole) ||
    allowedRoles.includes(normalizedRole) ||
    (allowedRoles.includes('seeker') && (rawRole === 'job_seeker' || rawRole === 'seeker'));

  if (!isAllowed) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleGuard;

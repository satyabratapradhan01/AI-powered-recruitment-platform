import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Search,
  Briefcase,
  Calendar,
  User,
  Bell,
  PlusCircle,
  Users,
  Kanban,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Building2,
  FileCheck2,
  FileText,
  Award,
  HelpCircle,
  X,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const userRole = user?.role || 'seeker';
  const isCandidateUser = userRole === 'job_seeker' || userRole === 'seeker';
  const isHRUser = userRole === 'hr';
  const isAdminUser = userRole === 'admin';

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHRRoute = location.pathname.startsWith('/hr');

  // Determine active context role
  const activeRole = isAdminRoute || userRole === 'admin'
    ? 'admin'
    : isHRRoute || userRole === 'hr'
    ? 'hr'
    : 'seeker';

  // 1. Job Seeker navigation
  const seekerNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, end: true },
    { label: 'Find Jobs', path: '/jobs', icon: Search, end: true },
    { label: 'My Applications', path: '/applications', icon: Briefcase },
    { label: 'Offer Letters', path: '/offers', icon: Award },
    { label: 'Resume / ATS', path: '/ats-score', icon: FileCheck2 },
    { label: 'Interviews', path: '/interviews', icon: Calendar },
    { label: 'Interview Prep', path: '/interview-preparation', icon: HelpCircle },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  // 2. HR Recruiter navigation
  const hrNavItems = [
    { label: 'Dashboard', path: '/hr/dashboard', icon: LayoutDashboard, end: true },
    { label: 'My Jobs', path: '/hr/jobs', icon: Briefcase, end: true },
    { label: 'Post Job', path: '/hr/jobs/new', icon: PlusCircle, end: true },
    { label: 'Applicants', path: '/hr/applicants', icon: Users },
    { label: 'Offer Letters', path: '/hr/offers', icon: Award },
    { label: 'Interviews', path: '/hr/interviews', icon: Calendar },
    { label: 'Notifications', path: '/hr/notifications', icon: Bell },
    { label: 'Company Profile', path: '/hr/company-profile', icon: Building2 },
  ];

  // 3. Admin navigation
  const adminNavItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, end: true },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Jobs', path: '/admin/jobs', icon: Briefcase, end: true },
    { label: 'Applications', path: '/admin/applications', icon: Kanban },
    { label: 'Analytics', path: '/admin/analytics', icon: TrendingUp },
  ];

  let currentNavItems = seekerNavItems;
  let activeRoleColor = 'bg-indigo-600 shadow-indigo-500/20';
  let portalTitle = 'Job Seeker Workspace';

  if (activeRole === 'admin') {
    currentNavItems = adminNavItems;
    activeRoleColor = 'bg-slate-900 shadow-slate-900/30';
    portalTitle = 'Admin Portal Workspace';
  } else if (activeRole === 'hr') {
    currentNavItems = hrNavItems;
    activeRoleColor = 'bg-purple-600 shadow-purple-500/20';
    portalTitle = 'HR Recruiter Workspace';
  }

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed md:sticky top-0 md:top-[57px] z-40 bg-white border-r border-slate-200/80 p-3.5 h-screen md:h-[calc(100vh-57px)] flex flex-col justify-between transition-all duration-500 ease-in-out ${
          isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        } ${isHovered ? 'md:w-64 md:shadow-2xl' : 'md:w-20'}`}
      >
        <div className="space-y-5">
          {/* Mobile Sidebar Close Header */}
          <div className="flex items-center justify-between pb-3 md:hidden border-b border-slate-100">
            <span className="font-bold text-sm text-slate-800">{portalTitle}</span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role Switcher Bar */}
          <div className="flex items-center justify-between p-1 bg-slate-100 rounded-xl border border-slate-200/80 min-h-[36px] transition-all duration-500">
            {isHovered ? (
              <div className="flex items-center justify-between w-full animate-fade-in">
                {(isCandidateUser || (isAdminUser && !isAdminRoute)) && (
                  <NavLink
                    to="/dashboard"
                    className={`flex-1 text-center py-1 text-[10px] font-bold rounded-lg transition-all duration-300 ${
                      activeRole === 'seeker'
                        ? 'bg-white text-indigo-600 shadow-xs font-black'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Candidate
                  </NavLink>
                )}

                {(isHRUser || (isAdminUser && !isAdminRoute)) && (
                  <NavLink
                    to="/hr/dashboard"
                    className={`flex-1 text-center py-1 text-[10px] font-bold rounded-lg transition-all duration-300 ${
                      activeRole === 'hr'
                        ? 'bg-purple-600 text-white shadow-xs font-black'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    HR
                  </NavLink>
                )}

                {isAdminUser && (
                  <NavLink
                    to="/admin/dashboard"
                    className={`flex-1 text-center py-1 text-[10px] font-bold rounded-lg transition-all duration-300 ${
                      activeRole === 'admin'
                        ? 'bg-slate-900 text-white shadow-xs font-black'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Admin
                  </NavLink>
                )}
              </div>
            ) : (
              <div className="w-full flex items-center justify-center text-[11px] font-black uppercase text-indigo-700 tracking-wider animate-fade-in">
                {activeRole === 'admin' ? 'ADM' : activeRole === 'hr' ? 'HR' : 'CAND'}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <p className={`px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 transition-all duration-500 ${!isHovered ? 'md:text-center md:px-0' : ''}`}>
              {isHovered ? portalTitle : '•••'}
            </p>
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={onClose}
                  title={item.label}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-2.5 text-xs font-semibold rounded-xl transition-all duration-300 ${
                      isHovered ? 'px-3.5 justify-start' : 'px-3.5 md:px-0 md:justify-center'
                    } ${
                      isActive
                        ? `${activeRoleColor} text-white shadow-sm font-bold`
                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 transition-transform duration-300" />
                  <span className={`whitespace-nowrap transition-all duration-500 ${!isHovered ? 'md:hidden md:opacity-0' : 'inline opacity-100'}`}>
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;

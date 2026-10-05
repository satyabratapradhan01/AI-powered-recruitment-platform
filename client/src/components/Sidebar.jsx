import React from 'react';
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
  X,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHRRoute = location.pathname.startsWith('/hr');

  const seekerNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Find Jobs', path: '/jobs', icon: Search },
    { label: 'Applications', path: '/applications', icon: Briefcase },
    { label: 'Interviews', path: '/interviews', icon: Calendar },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const hrNavItems = [
    { label: 'HR Dashboard', path: '/hr/dashboard', icon: LayoutDashboard },
    { label: 'My Posted Jobs', path: '/hr/jobs', icon: Briefcase },
    { label: 'Create New Job', path: '/hr/jobs/new', icon: PlusCircle },
    { label: 'Applicants Pipeline', path: '/hr/applicants', icon: Users },
    { label: 'HR Interviews', path: '/hr/interviews', icon: Calendar },
  ];

  const adminNavItems = [
    { label: 'Admin Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'User Management', path: '/admin/users', icon: Users },
    { label: 'Platform Jobs', path: '/admin/jobs', icon: Briefcase },
    { label: 'System Applications', path: '/admin/applications', icon: Kanban },
    { label: 'Platform Analytics', path: '/admin/analytics', icon: TrendingUp },
  ];

  let currentNavItems = seekerNavItems;
  let activeRoleColor = 'bg-indigo-600 shadow-indigo-500/20';
  let portalTitle = 'Candidate Navigation';

  if (isAdminRoute) {
    currentNavItems = adminNavItems;
    activeRoleColor = 'bg-slate-900 shadow-slate-900/30';
    portalTitle = 'Admin Operations Navigation';
  } else if (isHRRoute) {
    currentNavItems = hrNavItems;
    activeRoleColor = 'bg-purple-600 shadow-purple-500/20';
    portalTitle = 'Recruiter Navigation';
  }

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all duration-150 ${
      isActive
        ? `${activeRoleColor} text-white shadow-sm font-bold`
        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
    }`;

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
        className={`fixed md:sticky top-0 md:top-[57px] z-40 w-64 bg-white border-r border-slate-200/80 p-4 h-screen md:h-[calc(100vh-57px)] flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Mobile Sidebar Close Header */}
          <div className="flex items-center justify-between pb-3 md:hidden border-b border-slate-100">
            <span className="font-bold text-sm text-slate-800">
              {isAdminRoute ? 'Admin Portal' : isHRRoute ? 'HR Recruiter Portal' : 'Candidate Portal'}
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Portal Switcher Bar */}
          <div className="flex items-center justify-between p-1 bg-slate-100 rounded-xl border border-slate-200/80">
            <NavLink
              to="/dashboard"
              className={`flex-1 text-center py-1 text-[10px] font-bold rounded-lg transition ${
                !isHRRoute && !isAdminRoute ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Candidate
            </NavLink>
            <NavLink
              to="/hr/dashboard"
              className={`flex-1 text-center py-1 text-[10px] font-bold rounded-lg transition ${
                isHRRoute ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              HR
            </NavLink>
            <NavLink
              to="/admin/dashboard"
              className={`flex-1 text-center py-1 text-[10px] font-bold rounded-lg transition ${
                isAdminRoute ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Admin
            </NavLink>
          </div>

          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              {portalTitle}
            </p>
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={linkClasses}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer Info Card */}
        <div
          className={`p-3.5 border rounded-xl space-y-1.5 ${
            isAdminRoute
              ? 'bg-slate-900 text-white border-slate-800'
              : isHRRoute
              ? 'bg-purple-50/60 border-purple-100'
              : 'bg-indigo-50/60 border-indigo-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className={`text-xs font-bold ${isAdminRoute ? 'text-slate-100' : isHRRole ? 'text-purple-950' : 'text-indigo-950'}`}>
              {isAdminRoute ? 'Admin Control' : isHRRoute ? 'Recruiter Hub' : 'AI ATS Engine'}
            </p>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className={`text-[11px] leading-snug ${isAdminRoute ? 'text-slate-400' : isHRRole ? 'text-purple-700/80' : 'text-indigo-700/80'}`}>
            {isAdminRoute
              ? 'System operational & active.'
              : isHRRoute
              ? 'Candidate ATS match active.'
              : 'Resume matched with 94% score.'}
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

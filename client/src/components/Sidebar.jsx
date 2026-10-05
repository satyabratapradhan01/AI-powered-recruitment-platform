import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Briefcase,
  Calendar,
  User,
  Bell,
  PlusCircle,
  X,
  Sparkles,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Find Jobs', path: '/jobs', icon: Search },
    { label: 'Applications', path: '/applications', icon: Briefcase },
    { label: 'Interviews', path: '/interviews', icon: Calendar },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all duration-150 ${
      isActive
        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20 font-bold'
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
            <span className="font-bold text-sm text-slate-800">Job Seeker Portal</span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Candidate Navigation
            </p>
            {navItems.map((item) => {
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
        <div className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-indigo-950">AI ATS Engine</p>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-[11px] text-indigo-700/80 leading-snug">
            Resume matched against live jobs with 94% accuracy rating.
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

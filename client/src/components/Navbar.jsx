import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Menu, LogOut, User, Sparkles } from 'lucide-react';
import Dropdown from './ui/Dropdown';
import Badge from './ui/Badge';
import NotificationBell from './NotificationBell';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  const userRole = user?.role || 'seeker';

  const roleLabels = {
    seeker: 'Job Seeker',
    job_seeker: 'Job Seeker',
    hr: 'HR Recruiter',
    admin: 'Platform Admin',
  };

  const roleVariants = {
    seeker: 'info',
    job_seeker: 'info',
    hr: 'purple',
    admin: 'danger',
  };

  const dropdownItems = [
    {
      label: `Signed in as ${user?.name || 'User'}`,
      icon: User,
      onClick: () => { },
    },
    { divider: true },
    {
      label: 'Sign Out',
      icon: LogOut,
      isDanger: true,
      onClick: logout,
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 transition-all">
      <div className="flex items-center justify-between">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 select-none">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center shadow-xs">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base text-slate-900 tracking-tight">
                  HireFlow <span className="font-bold text-slate-900">AI</span>
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                  RECRUIT
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Notification Bell, Role Badge & User Profile Dropdown */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-3">
              {/* In-App Notification Bell */}
              <NotificationBell />

              <Badge variant={roleVariants[userRole] || 'info'} size="xs" showDot>
                {roleLabels[userRole] || 'Job Seeker'}
              </Badge>

              <Dropdown
                trigger={
                  <div className="flex items-center gap-2 p-1 px-2.5 rounded-xl hover:bg-slate-100/80 transition cursor-pointer">
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-800 leading-tight">
                        {user.name}
                      </p>
                      <p className="text-[11px] font-medium text-slate-500 leading-none mt-0.5">
                        {user.email}
                      </p>
                    </div>
                  </div>
                }
                items={dropdownItems}
                align="right"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

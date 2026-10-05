import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const linkClasses = ({ isActive }) =>
    `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition ${
      isActive
        ? 'bg-indigo-50 text-indigo-700 font-semibold'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 min-h-[calc(100vh-65px)]">
      <nav className="space-y-1">
        <NavLink to="/dashboard" className={linkClasses}>
          Dashboard
        </NavLink>
        <NavLink to="/applications" className={linkClasses}>
          Applications
        </NavLink>
        <NavLink to="/applications/new" className={linkClasses}>
          Add Application
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;

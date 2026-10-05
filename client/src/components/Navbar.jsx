import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <h1 className="text-xl font-bold text-indigo-600">JobTracker</h1>
      </div>
      <div className="flex items-center space-x-4">
        {user && (
          <span className="text-sm font-medium text-gray-700">
            Welcome, <span className="font-semibold text-gray-900">{user.name}</span>
          </span>
        )}
        <button
          onClick={logout}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;

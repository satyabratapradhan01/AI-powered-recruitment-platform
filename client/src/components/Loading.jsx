import React from 'react';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center min-h-[200px] p-6">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default Loading;

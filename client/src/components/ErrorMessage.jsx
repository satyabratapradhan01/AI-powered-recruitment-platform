import React from 'react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm my-2">
      <p className="font-medium">{message}</p>
    </div>
  );
};

export default ErrorMessage;

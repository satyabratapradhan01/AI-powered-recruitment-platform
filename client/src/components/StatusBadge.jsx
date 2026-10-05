import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeStyle = (status) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Interview':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Offer':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle(
        status
      )}`}
    >
      {status || 'Applied'}
    </span>
  );
};

export default StatusBadge;

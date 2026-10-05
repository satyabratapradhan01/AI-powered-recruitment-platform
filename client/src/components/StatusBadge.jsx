import React from 'react';
import Badge from './ui/Badge';

const StatusBadge = ({ status }) => {
  const getVariant = (s) => {
    switch (s) {
      case 'Applied':
        return 'info';
      case 'Interview':
        return 'warning';
      case 'Offer':
        return 'success';
      case 'Rejected':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <Badge variant={getVariant(status)} showDot size="sm">
      {status || 'Applied'}
    </Badge>
  );
};

export default StatusBadge;

import React from 'react';
import Badge from './ui/Badge';

const StatusBadge = ({ status }) => {
  const getVariant = (s) => {
    switch (s) {
      case 'Applied':
        return 'info';
      case 'Under Review':
        return 'info';
      case 'Shortlisted':
        return 'purple';
      case 'Interview':
      case 'Interview Scheduled':
      case 'Interview Completed':
        return 'warning';
      case 'Offer':
      case 'Offer Extended':
        return 'purple';
      case 'Selected':
      case 'Offer Accepted':
        return 'success';
      case 'Rejected':
      case 'Offer Rejected':
      case 'Withdrawn':
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

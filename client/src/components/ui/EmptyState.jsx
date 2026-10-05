import React from 'react';
import { FolderOpen } from 'lucide-react';
import Button from './Button';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No records found',
  description = 'There are no items to display at this time.',
  actionLabel,
  onAction,
  actionLink,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-white border border-slate-200/80 rounded-2xl shadow-xs ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && actionLink && (
        <Link to={actionLink}>
          <Button variant="primary" size="sm">
            {actionLabel}
          </Button>
        </Link>
      )}

      {actionLabel && onAction && !actionLink && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

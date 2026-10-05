import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

const ErrorState = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while processing your request.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 text-center bg-rose-50/70 border border-rose-200/80 rounded-2xl ${className}`}
    >
      <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-bold text-rose-900 tracking-tight">{title}</h3>
      <p className="text-xs text-rose-700 max-w-md mt-1 mb-4 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="danger"
          size="xs"
          leftIcon={RefreshCw}
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;

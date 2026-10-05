import React from 'react';

export const Card = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variants = {
    default: 'bg-white border border-slate-200/80 shadow-xs rounded-xl',
    glass: 'bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-xs rounded-xl',
    interactive:
      'bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 rounded-xl cursor-pointer',
    bordered: 'bg-slate-50/50 border border-slate-200 rounded-xl',
  };

  return (
    <div className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => (
  <div
    className={`px-6 py-4 border-b border-slate-100 flex flex-col space-y-1 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', ...props }) => (
  <h3
    className={`text-base font-bold text-slate-900 tracking-tight leading-snug ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-xs text-slate-500 leading-normal ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div
    className={`px-6 py-3.5 bg-slate-50/50 border-t border-slate-100 rounded-b-xl flex items-center justify-between ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;

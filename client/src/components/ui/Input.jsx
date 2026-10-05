import React from 'react';

const Input = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      fullWidth = true,
      className = '',
      id,
      name,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const inputId = id || name;

    return (
      <div className={`${fullWidth ? 'w-full' : ''} space-y-1.5`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700 tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative rounded-lg shadow-xs">
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <LeftIcon className="w-4 h-4" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            className={`block w-full text-sm rounded-lg border bg-white px-3 py-2 transition-all duration-150 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
              LeftIcon ? 'pl-9' : ''
            } ${RightIcon ? 'pr-9' : ''} ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 text-rose-900'
                : 'border-slate-300 hover:border-slate-400'
            } ${className}`}
            {...props}
          />
          {RightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
              <RightIcon className="w-4 h-4" />
            </div>
          )}
        </div>
        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

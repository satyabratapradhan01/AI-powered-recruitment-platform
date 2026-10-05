import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      options = [],
      placeholder = 'Select an option',
      leftIcon: LeftIcon,
      fullWidth = true,
      className = '',
      id,
      name,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || name;

    return (
      <div className={`${fullWidth ? 'w-full' : ''} space-y-1.5`}>
        {label && (
          <label
            htmlFor={selectId}
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
          <select
            ref={ref}
            id={selectId}
            name={name}
            className={`block w-full text-sm rounded-lg border bg-white px-3 py-2 pr-9 appearance-none transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
              LeftIcon ? 'pl-9' : ''
            } ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 text-rose-900'
                : 'border-slate-300 hover:border-slate-400'
            } ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children
              ? children
              : options.map((opt) => {
                  const value = typeof opt === 'object' ? opt.value : opt;
                  const label = typeof opt === 'object' ? opt.label : opt;
                  return (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  );
                })}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;

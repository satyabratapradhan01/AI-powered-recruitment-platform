import React from 'react';

const Textarea = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      fullWidth = true,
      className = '',
      id,
      name,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || name;

    return (
      <div className={`${fullWidth ? 'w-full' : ''} space-y-1.5`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold text-slate-700 tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative rounded-lg shadow-xs">
          <textarea
            ref={ref}
            id={textareaId}
            name={name}
            rows={rows}
            className={`block w-full text-sm rounded-lg border bg-white px-3 py-2 transition-all duration-150 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 text-rose-900'
                : 'border-slate-300 hover:border-slate-400'
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;

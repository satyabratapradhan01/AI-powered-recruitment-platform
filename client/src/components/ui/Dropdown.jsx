import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({
  trigger,
  items = [],
  align = 'right',
  className = '',
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignments = {
    left: 'left-0 origin-top-left',
    right: 'right-0 origin-top-right',
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute z-40 mt-2 w-56 rounded-xl bg-white shadow-xl ring-1 ring-black/5 border border-slate-100 divide-y divide-slate-100 focus:outline-none animate-fade-in ${alignments[align]} ${className}`}
        >
          {children ? (
            <div className="py-1" onClick={() => setIsOpen(false)}>
              {children}
            </div>
          ) : (
            <div className="py-1">
              {items.map((item, idx) => {
                if (item.divider) {
                  return <div key={idx} className="my-1 border-t border-slate-100" />;
                }

                const Icon = item.icon;

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={item.disabled}
                    onClick={() => {
                      if (!item.disabled && item.onClick) {
                        item.onClick();
                        setIsOpen(false);
                      }
                    }}
                    className={`group flex w-full items-center px-4 py-2 text-xs font-medium transition ${
                      item.isDanger
                        ? 'text-rose-600 hover:bg-rose-50'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {Icon && (
                      <Icon
                        className={`mr-2.5 h-4 w-4 shrink-0 ${
                          item.isDanger
                            ? 'text-rose-500'
                            : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                    )}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;

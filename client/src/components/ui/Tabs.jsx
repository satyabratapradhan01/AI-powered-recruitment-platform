import React from 'react';

const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  variant = 'underline',
  className = '',
}) => {
  return (
    <div
      className={`border-b border-slate-200 ${
        variant === 'pills' ? 'border-b-0 bg-slate-100/80 p-1 rounded-xl inline-flex' : 'flex'
      } ${className}`}
    >
      <nav className="flex space-x-2 overflow-x-auto no-scrollbar" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          if (variant === 'pills') {
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 shrink-0" />}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`inline-flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {Icon && <Icon className="w-4 h-4 shrink-0" />}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Tabs;

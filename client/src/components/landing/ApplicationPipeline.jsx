import React from 'react';
import StatusBadge from '../StatusBadge';

const ApplicationPipeline = () => {
  // Static Landing Pipeline Data (Zero Backend Calls)
  const pipelineStages = [
    {
      name: 'Applied',
      count: '12 applications',
      description: 'Initial application submitted to hiring team',
      badgeStatus: 'Applied',
      color: 'border-blue-200 bg-blue-50/40 text-blue-900',
    },
    {
      name: 'Interview',
      count: '5 applications',
      description: 'Screening & recruiter phone calls',
      badgeStatus: 'Interview',
      color: 'border-yellow-200 bg-yellow-50/40 text-yellow-900',
    },
    {
      name: 'Technical Round',
      count: '3 applications',
      description: 'Coding tests & architecture assessments',
      badgeStatus: 'Interview',
      color: 'border-purple-200 bg-purple-50/40 text-purple-900',
    },
    {
      name: 'HR Round',
      count: '2 applications',
      description: 'Culture fit & compensation discussions',
      badgeStatus: 'Interview',
      color: 'border-indigo-200 bg-indigo-50/40 text-indigo-900',
    },
    {
      name: 'Offer',
      count: '2 applications',
      description: 'Job offer extended & contract pending',
      badgeStatus: 'Offer',
      color: 'border-emerald-200 bg-emerald-50/40 text-emerald-900',
    },
  ];

  const rejectedStage = {
    name: 'Rejected',
    count: '5 applications',
    description: 'Applications closed or not pursued further',
    badgeStatus: 'Rejected',
    color: 'border-rose-200 bg-rose-50/40 text-rose-900',
  };

  return (
    <section id="pipeline" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wide">
            <span>Visual Pipeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Know exactly where every application stands.
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Effortlessly monitor your hiring progress across every stage of the interview lifecycle.
          </p>
        </div>

        {/* Main Progressive Pipeline Flow */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative">
            {pipelineStages.map((stage, idx) => (
              <div key={stage.name} className="relative group">
                <div
                  className={`border rounded-2xl p-5 shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-200 h-full flex flex-col justify-between ${stage.color}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Stage 0{idx + 1}
                      </span>
                      <StatusBadge status={stage.badgeStatus} />
                    </div>

                    <h3 className="text-base font-bold text-gray-900">{stage.name}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{stage.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-gray-900">{stage.count}</span>
                    {idx < pipelineStages.length - 1 && (
                      <span className="hidden lg:inline text-indigo-400 font-bold text-sm">→</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Separate Stage Card for Rejected Applications */}
          <div className="max-w-md mx-auto pt-4">
            <div className={`border rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex items-center justify-between ${rejectedStage.color}`}>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-gray-900">{rejectedStage.name}</h3>
                  <StatusBadge status={rejectedStage.badgeStatus} />
                </div>
                <p className="text-xs text-gray-600">{rejectedStage.description}</p>
              </div>
              <div className="text-right pl-4">
                <span className="text-xs font-extrabold text-gray-900 block whitespace-nowrap">
                  {rejectedStage.count}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplicationPipeline;

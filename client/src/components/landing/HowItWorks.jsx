import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Create Your Account',
      description: 'Register securely and create your personal job tracking workspace in seconds.',
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      delay: 'delay-100',
    },
    {
      number: '02',
      title: 'Add Applications',
      description: 'Save company, role, location, job URL, status and application date.',
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      delay: 'delay-200',
    },
    {
      number: '03',
      title: 'Track Your Progress',
      description: 'Update statuses and monitor your job search metrics directly from your dashboard.',
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      delay: 'delay-300',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50/60 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wide">
            <span>Simple 3-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            From application to offer, all in one place.
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Get your job search organized in less than two minutes.
          </p>
        </div>

        {/* 3 Step Cards with Desktop Timeline Line */}
        <div className="relative">
          {/* Connecting Timeline Line (Desktop Only) */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-indigo-200 via-violet-200 to-indigo-200 -translate-y-1/2 -z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`bg-white border border-gray-200/90 rounded-2xl p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between animate-fade-in-up ${step.delay}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-black text-indigo-600 tracking-tight font-mono">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100/60 flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

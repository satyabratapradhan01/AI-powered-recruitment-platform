import React from 'react';
import { Building2, Users, FileCheck2, ShieldAlert } from 'lucide-react';

const TrustSection = () => {
  const metrics = [
    { label: 'Applications Tracked', value: '50,000+', icon: FileCheck2 },
    { label: 'Active Job Seekers', value: '12,000+', icon: Users },
    { label: 'Hiring Companies & HR', value: '1,500+', icon: Building2 },
    { label: 'AI Match Precision', value: '98.4%', icon: ShieldAlert },
  ];

  return (
    <section className="py-10 bg-slate-900 text-white border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {metrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={i} className="p-4 space-y-1">
                <div className="flex justify-center text-indigo-400 mb-1">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {m.value}
                </p>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {m.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;

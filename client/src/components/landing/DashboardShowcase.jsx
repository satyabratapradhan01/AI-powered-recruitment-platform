import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../StatusBadge';

const DashboardShowcase = () => {
  // Static Sample Data Only (Zero API / DB Interaction)
  const sampleStats = [
    { label: 'Total', count: 24, color: 'border-indigo-500 text-indigo-600 bg-indigo-50/50' },
    { label: 'Applied', count: 12, color: 'border-blue-500 text-blue-600 bg-blue-50/50' },
    { label: 'Interviews', count: 5, color: 'border-yellow-500 text-yellow-600 bg-yellow-50/50' },
    { label: 'Offers', count: 2, color: 'border-emerald-500 text-emerald-600 bg-emerald-50/50' },
    { label: 'Rejected', count: 5, color: 'border-rose-500 text-rose-600 bg-rose-50/50' },
  ];

  const sampleApplications = [
    { id: 1, company: 'Google', title: 'Software Engineer', date: 'Sep 27', status: 'Interview' },
    { id: 2, company: 'Microsoft', title: 'Frontend Developer', date: 'Sep 25', status: 'Applied' },
    { id: 3, company: 'Amazon', title: 'SDE Technical', date: 'Sep 24', status: 'Interview' },
    { id: 4, company: 'Infosys', title: 'Software Engineer', date: 'Sep 20', status: 'Rejected' },
    { id: 5, company: 'TCS', title: 'Graduate Engineer', date: 'Sep 18', status: 'Applied' },
  ];

  return (
    <section id="dashboard" className="py-20 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Feature Copy */}
          <div className="lg:col-span-4 space-y-6 text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase">
              <span>Intuitive Interface</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-snug">
              Your entire job search at a glance.
            </h2>

            <p className="text-base text-gray-600 leading-relaxed">
              See where every application stands, identify opportunities that need attention, and keep your search organized.
            </p>

            <ul className="space-y-3 text-sm text-gray-700 font-medium pt-2 text-left">
              <li className="flex items-center space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">✓</span>
                <span>Real-time status overview cards</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">✓</span>
                <span>Filter and search controls for fast lookup</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">✓</span>
                <span>Zero configuration required</span>
              </li>
            </ul>

            <div className="pt-4">
              <Link to="/register" className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200">
                Try HireFlow Free →
              </Link>
            </div>
          </div>

          {/* Right Column: Static SaaS Mockup Window (Fade-in-up) */}
          <div className="lg:col-span-8 animate-fade-in-up delay-200">
            <div className="bg-white border border-gray-200/90 rounded-2xl shadow-2xl shadow-indigo-100/60 overflow-hidden hover:-translate-y-1 transition-all duration-300">
              <div className="bg-gray-100/80 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                </div>
                <div className="bg-white border rounded-md px-4 py-1 text-xs text-gray-500 font-mono">
                  🔒 app.hireflow.ai/dashboard
                </div>
                <div className="w-12" />
              </div>

              <div className="flex min-h-[460px]">
                {/* Mock Sidebar */}
                <div className="hidden sm:flex flex-col w-48 bg-white border-r border-gray-100 p-4 space-y-4">
                  <div className="flex items-center space-x-2 pb-3 border-b">
                    <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center shadow-xs">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 2 7 12 12 22 7 12 2" />
                        <polyline points="2 17 12 22 22 17" />
                        <polyline points="2 12 12 17 22 12" />
                      </svg>
                    </div>
                    <span className="font-bold text-sm text-gray-900">HireFlow AI</span>
                  </div>
                  <div className="space-y-1 text-xs font-semibold">
                    <div className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 flex items-center space-x-2"><span>📊</span><span>Dashboard</span></div>
                    <div className="px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center space-x-2"><span>💼</span><span>Applications</span></div>
                    <div className="px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center space-x-2"><span>➕</span><span>Add New</span></div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-5 sm:p-6 bg-gray-50/40 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Dashboard</h3>
                      <p className="text-[11px] text-gray-500">Welcome back, Alex!</p>
                    </div>
                    <span className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow-xs">+ Add Application</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
                    {sampleStats.map((stat) => (
                      <div key={stat.label} className={`p-3 rounded-xl border-l-4 border bg-white shadow-xs ${stat.color}`}>
                        <p className="text-[10px] font-semibold text-gray-500 uppercase">{stat.label}</p>
                        <p className="text-xl font-extrabold text-gray-900 mt-0.5">{stat.count}</p>
                      </div>
                    ))}
                  </div>

                  {/* Search Bar & Filter Button */}
                  <div className="bg-white p-2.5 border border-gray-200 rounded-xl shadow-xs flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 flex-1">
                      <span className="text-gray-400 text-xs">🔍</span>
                      <span className="text-xs text-gray-400">Search company or role...</span>
                    </div>
                    <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700">⚙️ Filter Status</div>
                  </div>

                  {/* Table with Badges */}
                  <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
                    <table className="w-full text-left text-xs text-gray-600">
                      <thead className="bg-gray-50 text-[10px] font-semibold text-gray-500 uppercase border-b">
                        <tr>
                          <th className="px-4 py-2.5">Company</th>
                          <th className="px-4 py-2.5">Job Title</th>
                          <th className="px-4 py-2.5">Applied Date</th>
                          <th className="px-4 py-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {sampleApplications.map((app) => (
                          <tr key={app.id} className="hover:bg-gray-50/80">
                            <td className="px-4 py-2.5 font-bold text-gray-900">{app.company}</td>
                            <td className="px-4 py-2.5 text-gray-700">{app.title}</td>
                            <td className="px-4 py-2.5 text-gray-400">{app.date}</td>
                            <td className="px-4 py-2.5"><StatusBadge status={app.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardShowcase;

import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-white via-indigo-50/30 to-white">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/3 right-4 sm:right-10 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-violet-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left animate-fade-in-up">
            {/* Tag Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>Job Search Management</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
              Track Every Application.{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 block sm:inline mt-1 sm:mt-0">
                Land Your Next Opportunity.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Organize your job search, track application progress, and keep every opportunity in one simple dashboard.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all duration-200 text-center text-base"
              >
                Get Started
              </Link>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm hover:border-gray-300 hover:-translate-y-0.5 transition-all duration-200 text-center text-base flex items-center justify-center space-x-2"
              >
                <span>View Dashboard</span>
                <span className="text-indigo-600 font-bold">→</span>
              </Link>
            </div>

            {/* Micro Tagline */}
            <div className="pt-1 text-xs font-semibold text-gray-500 tracking-wide">
              Simple • Secure • Built for modern job seekers
            </div>
          </div>

          {/* Right Column: Floating Visual Element */}
          <div className="lg:col-span-5 relative flex justify-center pt-4 sm:pt-0 animate-fade-in delay-200">
            {/* Floating Status Badge 1 (Top Right) */}
            <div className="absolute -top-6 right-0 sm:right-2 z-20 bg-white p-2.5 sm:p-3.5 rounded-2xl shadow-xl border border-emerald-100 flex items-center space-x-2.5 sm:space-x-3 animate-float-slow">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm sm:text-lg">
                🎉
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-bold text-gray-900">Offer Received</p>
                <p className="text-[10px] sm:text-[11px] text-emerald-600 font-semibold">Google • $140,000/yr</p>
              </div>
            </div>

            {/* Main Central Card */}
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-indigo-100/50 relative z-10 hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 sm:pb-4 mb-3 sm:mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                    JT
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-xs sm:text-sm">Application Tracker</h3>
                    <p className="text-[10px] sm:text-xs text-gray-500">Live Status Overview</p>
                  </div>
                </div>
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] sm:text-xs font-bold">
                  Active
                </span>
              </div>

              {/* Stat Pills Grid */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-2.5 sm:p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <p className="text-[10px] sm:text-[11px] font-semibold text-gray-500">TOTAL APPLIED</p>
                  <p className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-0.5 sm:mt-1">18</p>
                </div>
                <div className="p-2.5 sm:p-3 rounded-2xl bg-amber-50/60 border border-amber-100">
                  <p className="text-[10px] sm:text-[11px] font-semibold text-amber-700">INTERVIEWS</p>
                  <p className="text-xl sm:text-2xl font-extrabold text-amber-800 mt-0.5 sm:mt-1">4</p>
                </div>
              </div>

              {/* Recent Application Row */}
              <div className="p-3 sm:p-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-900 truncate max-w-[160px] sm:max-w-none">
                    Senior Frontend Engineer
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-gray-500">Stripe • Applied 2 days ago</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 whitespace-nowrap">
                  Interview
                </span>
              </div>
            </div>

            {/* Floating Status Badge 2 (Bottom Left) */}
            <div className="absolute -bottom-6 left-0 sm:left-2 z-20 bg-white p-2.5 sm:p-3.5 rounded-2xl shadow-xl border border-indigo-100 flex items-center space-x-2.5 sm:space-x-3 animate-float-slow delay-300">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm sm:text-lg">
                🗓️
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-bold text-gray-900">Interview Scheduled</p>
                <p className="text-[10px] sm:text-[11px] text-indigo-600 font-semibold">Tomorrow at 10:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

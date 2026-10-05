import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 text-white p-10 sm:p-16 shadow-2xl shadow-indigo-200/60 text-center space-y-6">
          {/* Subtle Decorative Background Glow Orbs */}
          <div className="w-80 h-80 rounded-full bg-white/10 blur-3xl absolute -top-24 -left-24 pointer-events-none" />
          <div className="w-80 h-80 rounded-full bg-violet-400/20 blur-3xl absolute -bottom-24 -right-24 pointer-events-none" />

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight relative z-10 leading-tight">
            Ready to organize your job search?
          </h2>

          {/* Description */}
          <p className="text-base sm:text-xl text-indigo-100 max-w-2xl mx-auto font-normal leading-relaxed relative z-10">
            Stop managing applications across spreadsheets, notes, and browser tabs.
          </p>

          {/* Primary CTA Button */}
          <div className="pt-4 relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-indigo-700 bg-white hover:bg-indigo-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-base"
            >
              Get Started — It's Free
            </Link>
          </div>

          {/* Secondary Text */}
          <p className="text-xs text-indigo-200 font-medium tracking-wide relative z-10 pt-2">
            No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

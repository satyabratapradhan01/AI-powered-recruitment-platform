import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase } from 'lucide-react';

const CTASection = () => {
  // Generate static random meteor streaks for consistent SSR/Hydration rendering
  const meteors = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: Math.floor((i * 4.2 + (i % 3) * 7.5) % 95) + 2,
      top: -20 - (i % 5) * 15,
      height: 35 + (i % 4) * 20,
      delay: (i * 0.45) % 4,
      duration: 2.8 + (i % 3) * 0.8,
      opacity: 0.3 + (i % 4) * 0.18,
    }));
  }, []);

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA Card Container */}
        <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0F0D24] via-[#161338] to-[#0A0B14] text-white p-6 sm:p-10 lg:p-12 shadow-[0_15px_45px_-10px_rgba(15,13,36,0.6)] hover:shadow-[0_20px_55px_-8px_rgba(91,61,245,0.4)] border border-white/10 transition-all duration-500 ease-out hover:-translate-y-1 text-center space-y-5">
          
          {/* Animated Meteor Rain Streaks (Shooting Stars) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {meteors.map((m) => (
              <div
                key={m.id}
                className="absolute w-[1.5px] bg-gradient-to-b from-transparent via-white/80 to-indigo-300 rounded-full animate-meteor-rain"
                style={{
                  left: `${m.left}%`,
                  top: `${m.top}px`,
                  height: `${m.height}px`,
                  animationDelay: `${m.delay}s`,
                  animationDuration: `${m.duration}s`,
                  opacity: m.opacity,
                  boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
                }}
              />
            ))}
          </div>

          {/* Background Giant Watermark Text */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/[0.035] text-5xl sm:text-7xl lg:text-8xl font-black tracking-widest uppercase pointer-events-none select-none font-serif z-0">
            HireFlow
          </div>

          {/* Ambient Floating Glow Orbs */}
          <div className="w-80 h-80 rounded-full bg-[#5B3DF5]/20 blur-3xl absolute -top-28 -left-28 pointer-events-none animate-orb-1 z-0" />
          <div className="w-80 h-80 rounded-full bg-[#7C5CFF]/15 blur-3xl absolute -bottom-28 -right-28 pointer-events-none animate-orb-2 z-0" />
          <div className="w-56 h-56 rounded-full bg-indigo-400/10 blur-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-pulse-subtle z-0" />

          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 text-xs font-semibold tracking-wider uppercase shadow-inner relative z-10 hover:bg-white/15 transition-colors">
            <span>Start Hiring & Applying Today</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight relative z-10 leading-tight max-w-3xl mx-auto text-white">
            Transform your recruitment workflow with{' '}
            <span className="bg-gradient-to-r from-white via-indigo-200 to-[#A78BFA] bg-clip-text text-transparent inline-block animate-text-gradient">
              HireFlow AI
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-indigo-200/90 max-w-xl mx-auto font-normal leading-relaxed relative z-10">
            Join thousands of job seekers and hiring teams discovering candidates with AI matching, ATS resume scoring, and live application tracking.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            {/* Candidate Register Pill */}
            <Link to="/register" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#5B3DF5] hover:bg-[#4C2FE0] text-white font-bold text-sm sm:text-base shadow-[0_8px_25px_rgba(91,61,245,0.4)] hover:shadow-[0_12px_35px_rgba(91,61,245,0.6)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Create Candidate Account</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>
            </Link>

            {/* HR / Employer Register Pill */}
            <Link to="/register?role=hr" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white font-bold text-sm sm:text-base backdrop-blur-md hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer shadow-md"
              >
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-200 group-hover:-translate-y-0.5 group-hover:rotate-6 transition-transform duration-300" />
                <span>Register as Employer / HR</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;



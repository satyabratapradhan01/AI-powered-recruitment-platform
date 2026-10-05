import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Briefcase } from 'lucide-react';
import Button from '../ui/Button';

const CTASection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-10 sm:p-16 shadow-2xl text-center space-y-6">
          {/* Subtle Glows */}
          <div className="w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl absolute -top-24 -left-24 pointer-events-none" />
          <div className="w-80 h-80 rounded-full bg-purple-500/20 blur-3xl absolute -bottom-24 -right-24 pointer-events-none" />

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 text-xs font-bold uppercase tracking-wide relative z-10">
            <Sparkles className="w-3.5 h-3.5" /> Start Hiring & Applying Today
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight relative z-10 leading-tight">
            Transform your recruitment workflow with TalentAI
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-lg text-indigo-200/90 max-w-2xl mx-auto font-normal leading-relaxed relative z-10">
            Join thousands of job seekers and hiring teams discovering candidates with AI matching, ATS resume scoring, and live application tracking.
          </p>

          {/* Primary CTA Buttons */}
          <div className="pt-4 relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button
                variant="primary"
                size="lg"
                rightIcon={ArrowRight}
                className="bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg"
              >
                Create Candidate Account
              </Button>
            </Link>
            <Link to="/register">
              <Button
                variant="outline"
                size="lg"
                leftIcon={Briefcase}
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white px-8 py-3.5 rounded-xl font-bold"
              >
                Register as Employer / HR
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

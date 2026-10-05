import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Search, PlusCircle, CheckCircle2, TrendingUp, Cpu, FileText, Calendar, ShieldCheck } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-12 sm:py-20 lg:py-28 bg-gradient-to-b from-white via-indigo-50/40 to-slate-50">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-indigo-300/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/3 right-4 sm:right-10 w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] bg-purple-300/20 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Action CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left animate-fade-in-up">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold tracking-wide uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
              <span>Next-Gen AI Recruitment & Job Platform</span>
            </div>

            {/* Main Required Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Find the right opportunity.{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 block sm:inline mt-1 sm:mt-0">
                Hire the right talent.
              </span>
            </h1>

            {/* Required Supporting Message */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              An intelligent platform uniting job seekers, recruiters, and companies with{' '}
              <strong className="text-slate-800 font-semibold">AI-powered job matching</strong>,{' '}
              <strong className="text-slate-800 font-semibold">ATS resume analysis</strong>, real-time{' '}
              <strong className="text-slate-800 font-semibold">application tracking</strong>, and automated{' '}
              <strong className="text-slate-800 font-semibold">interview management</strong>.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <Link to="/register" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  leftIcon={Search}
                  fullWidth
                  className="px-8 py-3.5 text-base rounded-xl font-bold shadow-lg shadow-indigo-500/25"
                >
                  Find Jobs
                </Button>
              </Link>
              <Link to="/register" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  leftIcon={PlusCircle}
                  fullWidth
                  className="px-8 py-3.5 text-base rounded-xl font-bold border-slate-300 text-slate-800 hover:bg-slate-100/80"
                >
                  Post a Job
                </Button>
              </Link>
            </div>

            {/* Feature Highlights Grid */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>AI ATS Scoring</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Candidate Ranking</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Interview Sync</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                <span>R2 Cloud Storage</span>
              </div>
            </div>
          </div>

          {/* Right Column: Polished Visual Representation of Platform Dashboard */}
          <div className="lg:col-span-5 relative flex justify-center pt-6 lg:pt-0 animate-fade-in delay-200">
            {/* Top Right Floating Pill: AI Match Score */}
            <div className="absolute -top-6 right-0 sm:right-2 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-indigo-100 flex items-center gap-3 animate-float-slow">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900">AI ATS Match: 96%</p>
                <p className="text-[11px] font-semibold text-emerald-600">Senior Full-Stack Developer</p>
              </div>
            </div>

            {/* Central Platform Mockup Card */}
            <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xl shadow-indigo-100 relative z-10 hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black">
                    AI
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">TalentAI Recruitment Workspace</h3>
                    <p className="text-xs text-slate-500">Live AI Job & Candidate Pipeline</p>
                  </div>
                </div>
                <Badge variant="success" showDot size="xs">
                  Active
                </Badge>
              </div>

              {/* Stat Counters */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Total Applications
                  </p>
                  <p className="text-2xl font-black text-slate-900 mt-1">24</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                  <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                    Interviews Scheduled
                  </p>
                  <p className="text-2xl font-black text-indigo-900 mt-1">6</p>
                </div>
              </div>

              {/* Sample Job Card item */}
              <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-900">Lead React Engineer</p>
                  <p className="text-[11px] font-semibold text-slate-500">Microsoft • Remote</p>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>Top 3 Candidate Match</span>
                  </div>
                </div>
                <Badge variant="info" size="xs">
                  Interview
                </Badge>
              </div>
            </div>

            {/* Bottom Left Floating Pill: Interview Reminder */}
            <div className="absolute -bottom-6 left-0 sm:left-2 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-200/80 flex items-center gap-3 animate-float-slow delay-300">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900">Technical Interview</p>
                <p className="text-[11px] font-semibold text-indigo-600">Today at 2:30 PM • Google</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

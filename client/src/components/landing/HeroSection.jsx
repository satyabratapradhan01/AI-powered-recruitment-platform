import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Lock, Plus, TrendingUp, CheckCircle2, Award, FileText, LayoutDashboard, Users, ArrowUpRight } from 'lucide-react';

const HeroSection = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Map scroll Y from 0 to 650px continuously as user scrolls down
      const progress = Math.min(Math.max(scrollY / 650, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic scroll expansion: starts compact (0.78 scale & 12deg tilt) when at top of page, and expands up to 1.18 scale & 0deg tilt directly as you scroll down
  const scale = 0.78 + scrollProgress * 0.4;
  const rotateX = (1 - scrollProgress) * 12;
  const translateY = -25 * scrollProgress;
  const textOpacity = Math.max(1 - scrollProgress * 1.1, 0.25);

  return (
    <section className="relative pt-10 sm:pt-16 pb-20 sm:pb-32 bg-gradient-to-b from-[#F2EEFF] via-[#F8F6FF] to-white overflow-hidden">
      {/* Background Dot Grid with Ambient Pulsing Glow */}
      <div className="absolute inset-0 bg-dot-pattern opacity-90 animate-pulse-grid pointer-events-none" />

      {/* Top Center Floating V-shaped Radial Light Beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-300/40 via-purple-200/20 to-transparent blur-2xl -z-10 pointer-events-none animate-float-beam" />

      {/* Soft Radial Ambient Lighting with Smooth Orb Animations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[400px] sm:h-[500px] bg-indigo-200/30 rounded-full blur-3xl -z-10 pointer-events-none animate-orb-1" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-purple-200/25 rounded-full blur-3xl -z-10 pointer-events-none animate-orb-2" />


      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Top Text Content with Scroll Fade */}
        <div style={{ opacity: textOpacity, transition: 'opacity 0.1s ease-out' }}>
          {/* Top Pill Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100/90 border border-indigo-200/80 text-indigo-700 text-xs sm:text-sm font-semibold shadow-xs mb-5 hover:bg-indigo-100 transition-colors">
            <Zap className="w-4 h-4 text-indigo-600 fill-indigo-600 animate-pulse" />
            <span>Full-Stack Portfolio • AI ATS Resume Screening & Recruitment Platform</span>
          </div>

          {/* Serif Highlighted Main Headline */}
          <h1 className="animate-fade-in-up delay-100 text-3xl sm:text-5xl lg:text-6xl font-serif font-normal text-slate-800 tracking-tight leading-[1.2] max-w-3xl mx-auto">
            AI-powered hiring on{' '}
            <span className="bg-[#E5DCFF] text-[#1A1448] font-serif italic px-3 sm:px-4 py-0.5 rounded-2xl border border-indigo-200/90 shadow-xs inline-block my-1 sm:my-0 hover:scale-105 transition-transform duration-300 cursor-default">
              autopilot.
            </span>{' '}
            At any scale.
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up delay-200 mt-5 text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-normal leading-relaxed">
            Automate resume ATS scoring with Gemini AI, streamline recruiter pipelines, issue official offer letters, and evaluate top candidates in real-time.
          </p>

          {/* Built For Tagline */}
          <p className="animate-fade-in-up delay-200 mt-2.5 text-xs sm:text-sm font-semibold text-slate-500">
            Engineered for <span className="text-indigo-600 font-bold">HR recruiters</span>, <span className="text-indigo-600 font-bold">employers</span> & <span className="text-indigo-600 font-bold">job seekers</span>
          </p>

          {/* Action Buttons */}
          <div className="animate-fade-in-up delay-300 mt-7 flex flex-wrap items-center justify-center gap-3.5">
            <Link to="/register">
              <button
                type="button"
                className="px-7 py-3 rounded-full bg-[#1A1830] hover:bg-[#2A2748] text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-950/20 hover:scale-[1.04] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center gap-2 group"
              >
                <span>Try Live Platform</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </button>
            </Link>
            <a href="#demo" onClick={(e) => { e.preventDefault(); document.getElementById('mockup-preview')?.scrollIntoView({ behavior: 'smooth' }); }}>
              <button
                type="button"
                className="px-7 py-3 rounded-full bg-white/90 hover:bg-white border border-slate-200/90 text-slate-800 font-bold text-sm sm:text-base shadow-xs hover:shadow-md hover:scale-[1.04] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center gap-2"
              >
                <span>Explore Features</span>
              </button>
            </a>
          </div>
        </div>


        {/* ========================================================================= */}
        {/* Main App Mockup Window with Smooth Dynamic Scroll Expansion (Matching 3rd Image) */}
        {/* ========================================================================= */}
        <div
          id="mockup-preview"
          className="animate-fade-in-up delay-400 mt-10 sm:mt-14 relative max-w-5xl mx-auto text-left group"
          style={{
            transform: `perspective(1000px) rotateX(${rotateX}deg) scale(${scale}) translateY(${translateY}px)`,
            transformOrigin: 'top center',
            transition: 'transform 0.05s linear, box-shadow 0.3s ease-out',
          }}

        >
          {/* Main Browser Window Frame */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_30px_100px_-20px_rgba(99,102,241,0.22)] group-hover:shadow-[0_40px_120px_-20px_rgba(99,102,241,0.32)] transition-all duration-500 ease-out overflow-hidden relative">
            
            {/* Browser Top Navigation Bar */}
            <div className="bg-slate-100/90 border-b border-slate-200/80 px-4 py-2.5 flex items-center justify-between">
              {/* Traffic Light Window Buttons */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400 hover:opacity-80 transition" />
                <div className="w-3 h-3 rounded-full bg-amber-400 hover:opacity-80 transition" />
                <div className="w-3 h-3 rounded-full bg-emerald-400 hover:opacity-80 transition" />
              </div>

              {/* URL Address Bar */}
              <div className="bg-white border border-slate-200/90 text-slate-600 px-5 py-1 rounded-md text-xs font-mono flex items-center gap-1.5 shadow-2xs min-w-[200px] justify-center">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span className="font-medium text-slate-700">app.hireflow.ai</span>
              </div>

              <div className="w-12" /> {/* Spacer */}
            </div>

            {/* Dashboard Content Container */}
            <div className="flex min-h-[480px] bg-slate-50/50">
              
              {/* Dashboard Sidebar */}
              <div className="w-52 border-r border-slate-200/70 bg-white p-4 hidden md:block space-y-6">
                <div className="flex items-center gap-2.5 px-2">
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
                  <span className="font-extrabold text-slate-900 text-sm">HireFlow AI</span>
                </div>

                <div className="space-y-1">
                  <div className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-xs flex items-center gap-2.5 shadow-2xs">
                    <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                    <span>Dashboard</span>
                  </div>
                  <div className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-xs flex items-center gap-2.5 cursor-pointer transition-colors">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>Candidates</span>
                  </div>
                  <div className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-xs flex items-center gap-2.5 cursor-pointer transition-colors">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>ATS Scoring</span>
                  </div>
                  <div className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-xs flex items-center gap-2.5 cursor-pointer transition-colors">
                    <Award className="w-4 h-4 text-slate-400" />
                    <span>Live Jobs</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Workspace
                  </div>
                  <div className="px-3 py-2 mt-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-between">
                    <span>Sunrise Tech</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Main Dashboard Workspace Body */}
              <div className="flex-1 p-5 sm:p-8 space-y-6 overflow-hidden">
                
                {/* Dashboard Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">HR Recruitment Dashboard</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Create jobs, screen resumes with AI, and view ranks.</p>
                  </div>
                  <button type="button" className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-slate-800 transition w-fit">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Job</span>
                  </button>
                </div>

                {/* Workspace Live Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-indigo-200 transition">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Jobs
                    </p>
                    <p className="text-xl font-extrabold text-slate-900 mt-1">12</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-emerald-200 transition">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                    </p>
                    <p className="text-xl font-extrabold text-slate-900 mt-1">8</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-amber-200 transition">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Candidates
                    </p>
                    <p className="text-xl font-extrabold text-slate-900 mt-1">148</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-purple-200 transition">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Submitted
                    </p>
                    <p className="text-xl font-extrabold text-slate-900 mt-1">142</p>
                  </div>
                </div>

                {/* Candidate AI Ranking Preview Table */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Top Candidate AI ATS Scores</span>
                    <span className="text-[11px] font-semibold text-indigo-600 hover:underline cursor-pointer flex items-center gap-0.5">
                      View all <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 hover:bg-indigo-50/30 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shadow-2xs">
                          SP
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Satyabrata Pradhan</p>
                          <p className="text-[10px] text-slate-500">Senior React Engineer • 6 yrs exp</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold shadow-2xs">
                          96% ATS Match
                        </span>
                        <span className="text-xs font-bold text-slate-700">Rank #1</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 hover:bg-purple-50/30 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shadow-2xs">
                          AR
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Alex Rivera</p>
                          <p className="text-[10px] text-slate-500">Full-Stack Node.js Developer • 4 yrs exp</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold shadow-2xs">
                          91% ATS Match
                        </span>
                        <span className="text-xs font-bold text-slate-700">Rank #2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Candidate Portal Child Window Overlay (Levitating Floating Animation) */}
          <div className="animate-float-slow absolute -bottom-8 -right-3 sm:right-6 max-w-xs sm:max-w-md w-full bg-white rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.18)] border border-slate-200/90 overflow-hidden z-20 hover:scale-[1.02] transition-transform duration-300 hidden sm:block">
            {/* Child Browser Bar */}
            <div className="bg-slate-100/90 border-b border-slate-200/80 px-3 py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="bg-white border border-slate-200 text-slate-600 px-3 py-0.5 rounded text-[10px] font-mono flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-emerald-600" />
                <span>exam.hireflow.ai</span>
              </div>
            </div>

            {/* Child Portal Content */}
            <div className="p-4 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Live AI Assessment Test</span>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md animate-pulse">
                  ⏱️ Time left: 14:20
                </span>
              </div>
              <div className="p-3 rounded-lg border border-indigo-100 bg-indigo-50/40 text-xs text-slate-800 space-y-2">
                <p className="font-semibold text-slate-900">Question 1: Explain React 19 Use Action State hook.</p>
                <div className="space-y-1 text-[11px]">
                  <div className="p-1.5 rounded bg-indigo-600 text-white font-medium flex items-center justify-between shadow-2xs">
                    <span>A) Manages pending states during async form actions</span>
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                  <div className="p-1.5 rounded bg-white border border-slate-200 text-slate-700">
                    <span>B) Synchronizes local storage items</span>
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

export default HeroSection;






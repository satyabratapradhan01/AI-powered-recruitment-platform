import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Lock, Plus, TrendingUp, CheckCircle2, Award, FileText, LayoutDashboard, Users, ArrowUpRight } from 'lucide-react';

const HeroSection = () => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  // ---------------------------------------------------------------------------
  // Scroll -> writes a single CSS variable (--p: 0..1) on the section.
  // Every 3D transform below reads --p, so scrolling never re-renders React.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let ticking = false;

    const update = () => {
      const progress = Math.min(Math.max(window.scrollY / 650, 0), 1);
      section.style.setProperty('--p', progress.toFixed(4));
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ---------------------------------------------------------------------------
  // Interactive dot grid: dots near the cursor swell, glow indigo and get
  // pushed away from the pointer, then ease back when the mouse leaves.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext('2d');

    const GAP = 24;       // distance between dots (px)
    const RADIUS = 110;   // cursor influence radius (px)
    const BASE = [167, 162, 224];  // resting dot colour (soft lavender)
    const HOT = [79, 70, 229];     // dot colour under the cursor (indigo-600)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const m = { x: -9999, y: -9999, tx: -9999, ty: -9999, power: 0, inside: false };
    let w = 0, h = 0, raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = section.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e) => {
      const rect = section.getBoundingClientRect();
      m.tx = e.clientX - rect.left;
      m.ty = e.clientY - rect.top;
      if (!m.inside && m.x < -1000) { m.x = m.tx; m.y = m.ty; }
      m.inside = true;
    };
    const onLeave = () => { m.inside = false; };

    const draw = (t) => {
      // Smooth follow + fade in/out of the effect
      m.x += (m.tx - m.x) * 0.16;
      m.y += (m.ty - m.y) * 0.16;
      m.power += ((m.inside ? 1 : 0) - m.power) * 0.08;

      ctx.clearRect(0, 0, w, h);

      // Soft spotlight following the cursor
      if (m.power > 0.01) {
        const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, RADIUS * 1.3);
        g.addColorStop(0, `rgba(129,140,248,${0.10 * m.power})`);
        g.addColorStop(1, 'rgba(129,140,248,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      const cols = Math.ceil(w / GAP) + 1;
      const rows = Math.ceil(h / GAP) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx = c * GAP + GAP / 2;
          const by = r * GAP + GAP / 2;
          const dx = bx - m.x;
          const dy = by - m.y;
          const d = Math.hypot(dx, dy);

          // smoothstep falloff 0..1
          let k = d < RADIUS ? 1 - d / RADIUS : 0;
          k = k * k * (3 - 2 * k) * m.power;

          // push dots away from the cursor, with a gentle ripple
          const push = k * 5;
          const x = d > 0.001 ? bx + (dx / d) * push : bx;
          const y = d > 0.001 ? by + (dy / d) * push : by;

          const shimmer = reduceMotion ? 0 : (Math.sin(t / 1100 + c * 0.35 + r * 0.35) * 0.5 + 0.5) * 0.2;
          const radius = 1.1 + shimmer + k * 1.3;

          const cr = Math.round(BASE[0] + (HOT[0] - BASE[0]) * k);
          const cg = Math.round(BASE[1] + (HOT[1] - BASE[1]) * k);
          const cb = Math.round(BASE[2] + (HOT[2] - BASE[2]) * k);

          ctx.fillStyle = `rgba(${cr},${cg},${cb},${0.50 + k * 0.40})`;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(section);
    if (!reduceMotion) {
      section.addEventListener('pointermove', onMove);
      section.addEventListener('pointerleave', onLeave);
    }
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ '--p': 0 }}
      className="relative pt-10 sm:pt-16 pb-20 sm:pb-32 bg-gradient-to-b from-[#F2EEFF] via-[#F8F6FF] to-white overflow-hidden"
    >
      {/* Interactive Dot Grid (reacts to the mouse) with Ambient Pulsing Glow */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-75 animate-pulse-grid pointer-events-none" />

      {/* Top Center Floating V-shaped Radial Light Beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-300/40 via-purple-200/20 to-transparent blur-2xl -z-10 pointer-events-none animate-float-beam" />

      {/* Soft Radial Ambient Lighting with Smooth Orb Animations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[400px] sm:h-[500px] bg-indigo-200/30 rounded-full blur-3xl -z-10 pointer-events-none animate-orb-1" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-purple-200/25 rounded-full blur-3xl -z-10 pointer-events-none animate-orb-2" />


      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

        {/* Top Text Content with Scroll Fade */}
        <div style={{ opacity: 'max(1 - var(--p) * 1.1, 0.25)', transition: 'opacity 0.1s ease-out' }}>
          {/* Top Pill Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100/90 border border-indigo-200/80 text-indigo-700 text-xs sm:text-sm font-semibold shadow-xs mb-5 hover:bg-indigo-100 transition-colors">
            <Zap className="w-4 h-4 text-indigo-600 fill-indigo-600 animate-pulse" />
            <span>AI Job Application Tracker</span>
          </div>

          {/* Serif Highlighted Main Headline */}
          <h1 className="animate-fade-in-up delay-100 text-3xl sm:text-5xl lg:text-6xl font-serif font-normal text-slate-800 tracking-tight leading-[1.2] max-w-3xl mx-auto">
            Your job search on{' '}
            <span className="bg-[#E5DCFF] text-[#1A1448] font-serif italic px-3 sm:px-4 py-0.5 rounded-2xl border border-indigo-200/90 shadow-xs inline-block my-1 sm:my-0 hover:scale-105 transition-transform duration-300 cursor-default">
              autopilot
            </span>{' '}
            Land offers faster.
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up delay-200 mt-5 text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-normal leading-relaxed">
            Track every application in one place, match your resume to each job with Gemini AI, practice mock interviews, and never miss a follow-up.
          </p>

          {/* Built For Tagline */}
          <p className="animate-fade-in-up delay-200 mt-2.5 text-xs sm:text-sm font-semibold text-slate-500">
            Built for <span className="text-indigo-600 font-bold">job seekers</span>, <span className="text-indigo-600 font-bold">career switchers</span> & <span className="text-indigo-600 font-bold">fresh graduates</span>
          </p>

          {/* Action Buttons */}
          <div className="animate-fade-in-up delay-300 mt-7 flex flex-wrap items-center justify-center gap-3.5">
            <Link to="/register">
              <button
                type="button"
                className="px-7 py-3 rounded-full bg-[#1A1830] hover:bg-[#2A2748] text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-950/20 hover:scale-[1.04] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center gap-2 group"
              >
                <span>Start tracking free</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </button>
            </Link>
            <a href="#demo" onClick={(e) => { e.preventDefault(); document.getElementById('mockup-preview')?.scrollIntoView({ behavior: 'smooth' }); }}>
              <button
                type="button"
                className="px-7 py-3 rounded-full bg-white/90 hover:bg-white border border-slate-200/90 text-slate-800 font-bold text-sm sm:text-base shadow-xs hover:shadow-md hover:scale-[1.04] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center gap-2"
              >
                <span>See the product</span>
              </button>
            </a>
          </div>
        </div>


        {/* ========================================================================= */}
        {/* Main App Mockup Window with Smooth Dynamic Scroll Expansion */}
        {/* ========================================================================= */}
        <div
          id="mockup-preview"
          className="animate-fade-in-up delay-400 mt-10 sm:mt-14 relative max-w-5xl mx-auto text-left"
        >
          {/* Ground glow that intensifies as the dashboard grows */}
          <div
            className="absolute inset-x-12 -bottom-6 h-24 rounded-full bg-indigo-400/40 blur-3xl pointer-events-none"
            style={{ opacity: 'calc(0.15 + var(--p) * 0.65)' }}
          />

        {/* 3D layer: tilts, swings and grows as the page scrolls */}
        <div
          className="group relative z-10"
          style={{
            transform:
              'perspective(1400px) rotateX(calc((1 - var(--p)) * 20deg)) rotateY(calc((1 - var(--p)) * -12deg)) rotateZ(calc((1 - var(--p)) * 1.5deg)) scale(calc(0.74 + var(--p) * 0.44)) translateY(calc(var(--p) * -25px))',
            transformOrigin: 'top center',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.12s ease-out, box-shadow 0.3s ease-out',
            willChange: 'transform',
          }}
        >
          {/* Main Browser Window Frame */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_30px_100px_-20px_rgba(99,102,241,0.22)] group-hover:shadow-[0_40px_120px_-20px_rgba(99,102,241,0.32)] transition-all duration-500 ease-out overflow-hidden relative">

            {/* Light sweep that glides across the window while scrolling */}
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
              <div
                className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                style={{
                  transform: 'translateX(calc(var(--p) * 450%)) skewX(-20deg)',
                  opacity: 'calc(var(--p) * (1 - var(--p)) * 4)',
                }}
              />
            </div>

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
                    <span>Applications</span>
                  </div>
                  <div className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-xs flex items-center gap-2.5 cursor-pointer transition-colors">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>Resume Match</span>
                  </div>
                  <div className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-xs flex items-center gap-2.5 cursor-pointer transition-colors">
                    <Award className="w-4 h-4 text-slate-400" />
                    <span>Interview Prep</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Workspace
                  </div>
                  <div className="px-3 py-2 mt-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-between">
                    <span>Job Hunt 2026</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Main Dashboard Workspace Body */}
              <div className="flex-1 p-5 sm:p-8 space-y-6 overflow-hidden">

                {/* Dashboard Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Job Search Dashboard</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Track applications, match your resume with AI, and prep for interviews.</p>
                  </div>
                  <button type="button" className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-slate-800 transition w-fit">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Application</span>
                  </button>
                </div>

                {/* Workspace Live Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-indigo-200 transition" style={{ transform: 'translateY(calc((1 - var(--p)) * 16px))' }}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Applied
                    </p>
                    <p className="text-xl font-extrabold text-slate-900 mt-1">48</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-emerald-200 transition" style={{ transform: 'translateY(calc((1 - var(--p)) * 24px))' }}>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Interviews
                    </p>
                    <p className="text-xl font-extrabold text-slate-900 mt-1">9</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-amber-200 transition" style={{ transform: 'translateY(calc((1 - var(--p)) * 32px))' }}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Saved
                    </p>
                    <p className="text-xl font-extrabold text-slate-900 mt-1">21</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-purple-200 transition" style={{ transform: 'translateY(calc((1 - var(--p)) * 40px))' }}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Offers
                    </p>
                    <p className="text-xl font-extrabold text-slate-900 mt-1">3</p>
                  </div>
                </div>

                {/* AI Resume Match Preview Table */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Top AI Resume Matches</span>
                    <span className="text-[11px] font-semibold text-indigo-600 hover:underline cursor-pointer flex items-center gap-0.5">
                      View all <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 hover:bg-indigo-50/30 transition" style={{ transform: 'translateX(calc((1 - var(--p)) * -28px))' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shadow-2xs">
                          NL
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Senior React Engineer</p>
                          <p className="text-[10px] text-slate-500">Northwind Labs • Applied 2 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold shadow-2xs">
                          96% Resume Match
                        </span>
                        <span className="text-xs font-bold text-slate-700">Interview</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 hover:bg-purple-50/30 transition" style={{ transform: 'translateX(calc((1 - var(--p)) * 28px))' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shadow-2xs">
                          AC
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Full-Stack Node.js Developer</p>
                          <p className="text-[10px] text-slate-500">Acme Cloud • Applied 5 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold shadow-2xs">
                          91% Resume Match
                        </span>
                        <span className="text-xs font-bold text-slate-700">Applied</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Interview Prep Child Window Overlay (Levitating Floating Animation) */}
          <div
            className="absolute -bottom-16 -right-3 sm:right-6 max-w-xs sm:max-w-md w-full z-20 hidden sm:block"
            style={{
              transform:
                'translateZ(calc((1 - var(--p)) * 120px)) translate3d(calc(var(--p) * 18px), calc(var(--p) * 14px), 0) scale(calc(1 + var(--p) * 0.06))',
              transition: 'transform 0.12s ease-out',
            }}
          >
          <div className="animate-float-slow bg-white rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.18)] border border-slate-200/90 overflow-hidden hover:scale-[1.02] transition-transform duration-300">
            {/* Child Browser Bar */}
            <div className="bg-slate-100/90 border-b border-slate-200/80 px-3 py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="bg-white border border-slate-200 text-slate-600 px-3 py-0.5 rounded text-[10px] font-mono flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-emerald-600" />
                <span>prep.hireflow.ai</span>
              </div>
            </div>

            {/* Child Portal Content */}
            <div className="p-4 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">AI Mock Interview</span>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md animate-pulse">
                  ⏱️ Time left: 14:20
                </span>
              </div>
              <div className="p-3 rounded-lg border border-indigo-100 bg-indigo-50/40 text-xs text-slate-800 space-y-2">
                <p className="font-semibold text-slate-900">Question 1: Explain React 19 useActionState hook.</p>
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
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
import React from 'react';
import { Link } from 'react-router-dom';

const LandingFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pagesLinks = [
    { name: 'All Products', path: '/#features' },
    { name: 'AI Job Matcher', path: '/#features' },
    { name: 'ATS Scanner', path: '/#features' },
    { name: 'Pricing', path: '/#pricing' },
    { name: 'Blog', path: '/#blog' },
  ];

  const socialsLinks = [
    { name: 'Facebook', url: 'https://facebook.com' },
    { name: 'Instagram', url: 'https://instagram.com' },
    { name: 'Twitter', url: 'https://twitter.com' },
    { name: 'LinkedIn', url: 'https://linkedin.com' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Cookie Policy', path: '/cookies' },
  ];

  const registerLinks = [
    { name: 'Candidate Sign Up', path: '/register' },
    { name: 'HR / Recruiter Signup', path: '/register?role=hr' },
    { name: 'Login', path: '/login' },
    { name: 'Forgot Password', path: '/forgot-password' },
  ];

  return (
    <footer className="w-full bg-white text-slate-700 pt-16 md:pt-24 pb-8 overflow-hidden relative border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Top Content Layout: Brand Info + 4 Grids */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-16 mb-16 lg:mb-24">

          {/* Left Column: Logo & Copyright */}
          <div className="flex flex-col items-start space-y-4 max-w-sm">
            <Link to="/" onClick={scrollToTop} className="flex items-center gap-2.5 group">
              {/* Sleek Minimalist Geometric Logo Icon (matching Aceternity style) */}
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white transition-transform group-hover:scale-105">
                <svg
                  width="18"
                  height="18"
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
              <span className="text-xl font-bold tracking-tight text-slate-900">
                HireFlow AI
              </span>
            </Link>

            <p className="text-sm text-slate-400 font-normal leading-relaxed">
              © copyright HireFlow AI 2026. All rights reserved.
            </p>
          </div>

          {/* Right Section: 4 Grids */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 lg:gap-16 w-full lg:w-auto">
            {/* 1. Pages */}
            <div>
              <h4 className="font-semibold text-slate-900 text-sm mb-4 tracking-tight">Pages</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                {pagesLinks.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      to={item.path}
                      className="hover:text-slate-900 transition-colors duration-150 block font-normal"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Socials */}
            <div>
              <h4 className="font-semibold text-slate-900 text-sm mb-4 tracking-tight">Socials</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                {socialsLinks.map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-slate-900 transition-colors duration-150 block font-normal"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Legal */}
            <div>
              <h4 className="font-semibold text-slate-900 text-sm mb-4 tracking-tight">Legal</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                {legalLinks.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      to={item.path}
                      className="hover:text-slate-900 transition-colors duration-150 block font-normal"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Register */}
            <div>
              <h4 className="font-semibold text-slate-900 text-sm mb-4 tracking-tight">Register</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                {registerLinks.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      to={item.path}
                      className="hover:text-slate-900 transition-colors duration-150 block font-normal"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* Giant Signature Watermark Text across the bottom (Aceternity UI Footer hallmark) */}
      <div className="w-full overflow-hidden select-none pointer-events-none leading-none pt-4 flex justify-center items-center">
        <h1 className="text-[14vw] sm:text-[15vw] md:text-[17vw] lg:text-[18vw] font-black tracking-tight leading-none text-slate-200/60 text-center uppercase translate-y-[15%]">
          HireFlow AI
        </h1>
      </div>
    </footer>
  );
};

export default LandingFooter;

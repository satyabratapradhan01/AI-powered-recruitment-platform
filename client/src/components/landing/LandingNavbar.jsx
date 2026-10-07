import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full px-3 sm:px-6 lg:px-8 pt-3 pb-2 transition-all duration-300">
      {/* Floating Pill Card Container (Aceternity UI Classic Navbar Style) */}
      <div
        className={`max-w-7xl mx-auto bg-white border border-slate-200/90 rounded-2xl shadow-sm transition-all duration-300 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 ${isScrolled ? 'shadow-md border-slate-300/80 bg-white/95 backdrop-blur-md' : ''
          }`}
      >
        {/* Left: Brand Logo & Name */}
        <Link
          to="/"
          onClick={() => scrollToSection('top')}
          className="flex items-center gap-2.5 group shrink-0"
        >
          {/* Black Square Logo Badge */}
          <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center font-extrabold text-xs shadow-xs group-hover:scale-105 transition-transform">
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
          <span className="text-base font-bold text-slate-900 tracking-tight">
            HireFlow <span className="font-bold text-slate-900">AI</span>
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <button
            onClick={() => scrollToSection('top')}
            className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            Products
          </button>
          <button
            onClick={() => scrollToSection('roles')}
            className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            Pricing
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            Blog
          </button>
          <button
            onClick={() => scrollToSection('dashboard-preview')}
            className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            Company
          </button>
        </nav>

        {/* Right: Login Button + Get Started Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Log In Button */}
          <Link to="/login" className="hidden sm:inline-flex">
            <button className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-medium text-sm px-4 py-2 rounded-xl transition-all">
              Log in
            </button>
          </Link>

          {/* Primary Action Button (Solid Black Pill) */}
          <Link to="/register" className="hidden sm:inline-flex">
            <button className="bg-black hover:bg-slate-800 text-white font-medium text-sm px-4 sm:px-5 py-2 rounded-xl transition-all shadow-xs active:scale-95">
              Get started
            </button>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden max-w-7xl mx-auto mt-2 bg-white border border-slate-200 rounded-2xl p-4 shadow-lg space-y-3 animate-fade-in">
          <button
            onClick={() => scrollToSection('top')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Products
          </button>
          <button
            onClick={() => scrollToSection('roles')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Pricing
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Blog
          </button>
          <button
            onClick={() => scrollToSection('dashboard-preview')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Company
          </button>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link to="/login" className="w-full">
              <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-sm py-2 rounded-xl transition">
                Log In
              </button>
            </Link>
            <Link to="/register" className="w-full">
              <button className="w-full bg-black hover:bg-slate-800 text-white font-medium text-sm py-2 rounded-xl transition">
                Get started
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;

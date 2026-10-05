import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Sparkles, Menu, X, ArrowRight, UserCheck, Shield } from 'lucide-react';
import Button from '../ui/Button';

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
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
          : 'bg-white/60 backdrop-blur-xs py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                Talent<span className="text-indigo-600">AI</span>
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Sparkles className="w-2.5 h-2.5" /> RECRUIT
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-7">
          <button
            onClick={() => scrollToSection('features')}
            className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
          >
            AI Features
          </button>
          <button
            onClick={() => scrollToSection('roles')}
            className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
          >
            For Seekers & HR
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('dashboard-preview')}
            className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
          >
            Dashboard
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Log In
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm" rightIcon={ArrowRight}>
              Get Started Free
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-3 animate-fade-in">
          <button
            onClick={() => scrollToSection('features')}
            className="block w-full text-left py-2 text-sm font-semibold text-slate-700"
          >
            AI Features
          </button>
          <button
            onClick={() => scrollToSection('roles')}
            className="block w-full text-left py-2 text-sm font-semibold text-slate-700"
          >
            For Seekers & HR
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left py-2 text-sm font-semibold text-slate-700"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('dashboard-preview')}
            className="block w-full text-left py-2 text-sm font-semibold text-slate-700"
          >
            Dashboard Preview
          </button>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link to="/login">
              <Button variant="outline" size="md" fullWidth>
                Log In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="md" fullWidth>
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;

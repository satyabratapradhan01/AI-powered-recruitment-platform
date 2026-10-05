import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import TrustSection from '../components/landing/TrustSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorks from '../components/landing/HowItWorks';
import RoleBasedSection from '../components/landing/RoleBasedSection';
import DashboardShowcase from '../components/landing/DashboardShowcase';
import SecuritySection from '../components/landing/SecuritySection';
import CTASection from '../components/landing/CTASection';
import LandingFooter from '../components/landing/LandingFooter';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between overflow-x-hidden w-full font-sans">
      {/* 1. Navbar */}
      <LandingNavbar />

      <main className="flex-1 space-y-4 sm:space-y-8 overflow-x-hidden">
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. Trusted Platform Metrics */}
        <TrustSection />

        {/* 4-11. Core Features Grid: AI Job Matching, ATS Score, Job Search, Application Tracking, Interview Scheduling, HR Management, AI Candidate Matching, Notifications */}
        <FeaturesSection />

        {/* 12. How It Works */}
        <HowItWorks />

        {/* 13. Role-based features (Job Seekers, HR, Admin) */}
        <RoleBasedSection />

        {/* 14. Dashboard Preview */}
        <div id="dashboard-preview">
          <DashboardShowcase />
        </div>

        {/* 15. Security & Data Protection */}
        <SecuritySection />

        {/* 16. Call to Action */}
        <CTASection />
      </main>

      {/* 17. Footer */}
      <LandingFooter />
    </div>
  );
};

export default LandingPage;

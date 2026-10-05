import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorks from '../components/landing/HowItWorks';
import ApplicationPipeline from '../components/landing/ApplicationPipeline';
import DashboardShowcase from '../components/landing/DashboardShowcase';
import SecuritySection from '../components/landing/SecuritySection';
import CTASection from '../components/landing/CTASection';
import LandingFooter from '../components/landing/LandingFooter';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between overflow-x-hidden w-full">
      <LandingNavbar />
      <main className="flex-1 space-y-4 sm:space-y-8 overflow-x-hidden">
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <ApplicationPipeline />
        <DashboardShowcase />
        <SecuritySection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;

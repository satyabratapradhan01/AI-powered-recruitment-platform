import React, { useState } from 'react';
import { UserPlus, FileUp, Sparkles, PlusCircle, BrainCircuit, UserCheck, ArrowRight } from 'lucide-react';
import Card, { CardContent } from '../ui/Card';
import Badge from '../ui/Badge';

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState('seeker');

  const seekerSteps = [
    {
      number: '01',
      title: 'Build Profile & Upload Resume',
      description: 'Create your account and upload your PDF resume securely to Cloudflare R2 storage.',
      icon: FileUp,
    },
    {
      number: '02',
      title: 'AI Resume Analysis & Matching',
      description: 'Gemini AI evaluates your ATS match score (0-100%) against open position requirements.',
      icon: Sparkles,
    },
    {
      number: '03',
      title: 'Track Pipeline & Ace Interviews',
      description: 'Monitor application stages in real-time, receive email alerts, and access AI interview prep.',
      icon: UserCheck,
    },
  ];

  const hrSteps = [
    {
      number: '01',
      title: 'Create Employer Company Profile',
      description: 'Register your organization and define recruiting team access parameters.',
      icon: UserPlus,
    },
    {
      number: '02',
      title: 'Post Open Jobs with Key Requirements',
      description: 'Publish position listings with required technical skills, experience levels, and location.',
      icon: PlusCircle,
    },
    {
      number: '03',
      title: 'AI Candidate Ranking & Scheduling',
      description: 'Inspect applicants sorted by AI match confidence, shortlist candidates, and schedule interviews.',
      icon: BrainCircuit,
    },
  ];

  const currentSteps = activeTab === 'seeker' ? seekerSteps : hrSteps;

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wide">
            <span>Simple Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How TalentAI Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            A streamlined 3-step recruitment process tailored for candidates and hiring managers.
          </p>

          {/* Tab Switcher */}
          <div className="inline-flex bg-slate-100 p-1 rounded-2xl border border-slate-200/80 mt-4">
            <button
              onClick={() => setActiveTab('seeker')}
              className={`px-5 py-2 text-xs font-bold rounded-xl transition ${
                activeTab === 'seeker'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Job Seekers
            </button>
            <button
              onClick={() => setActiveTab('hr')}
              className={`px-5 py-2 text-xs font-bold rounded-xl transition ${
                activeTab === 'hr'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For HR Recruiters
            </button>
          </div>
        </div>

        {/* 3 Steps Cards */}
        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 -translate-y-1/2 -z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {currentSteps.map((step) => {
              const Icon = step.icon;
              return (
                <Card
                  key={step.number}
                  variant="default"
                  className="p-8 hover:shadow-lg transition-all duration-200 border-slate-200/90"
                >
                  <CardContent className="p-0 space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-black text-indigo-600 font-mono tracking-tight">
                        {step.number}
                      </span>
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">{step.title}</h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">{step.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

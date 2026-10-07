import React from 'react';
import {
  Sparkles,
  FileCheck,
  Search,
  Kanban,
  CalendarCheck,
  Users,
  BrainCircuit,
  BellRing,
} from 'lucide-react';
import Card, { CardContent } from '../ui/Card';
import Badge from '../ui/Badge';

const FeaturesSection = () => {
  const featureList = [
    {
      id: 'ai-matching',
      title: '1. AI Job Matching',
      badge: 'Gemini AI',
      badgeVariant: 'purple',
      description:
        'Analyzes candidate skill sets, experience, and career aspirations against live job postings to deliver automated compatibility matching.',
      icon: Sparkles,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
    },
    {
      id: 'ats-score',
      title: '2. ATS Resume Score',
      badge: 'ATS Scanner',
      badgeVariant: 'primary',
      description:
        'Parses resume PDFs, evaluates keyword density against job descriptions, and calculates a 0-100% ATS score with skill gap improvement tips.',
      icon: FileCheck,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      id: 'job-search',
      title: '3. Intelligent Job Search',
      badge: 'Discovery',
      badgeVariant: 'info',
      description:
        'Filter opportunities by role, technology stack, salary range, location, and work style (Remote/Hybrid) with instant query indexing.',
      icon: Search,
      color: 'bg-sky-50 text-sky-600 border-sky-100',
    },
    {
      id: 'application-tracking',
      title: '4. Application Tracking Pipeline',
      badge: 'Kanban Pipeline',
      badgeVariant: 'warning',
      description:
        'Monitor your application lifecycle across stage milestones: Applied, Screening, Interview Scheduled, Offer Received, and Decision.',
      icon: Kanban,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      id: 'interview-scheduling',
      title: '5. Interview Scheduling & Prep',
      badge: 'Cal & Prep',
      badgeVariant: 'success',
      description:
        'Coordinate interview dates between candidates and HR recruiters with automated calendar sync, reminders, and AI sample Q&A prep.',
      icon: CalendarCheck,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      id: 'hr-management',
      title: '6. HR Candidate Management',
      badge: 'Recruiter Portal',
      badgeVariant: 'primary',
      description:
        'Empowers hiring managers to publish job postings, review applicant profiles, download private resumes from R2 storage, and manage shortlists.',
      icon: Users,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      id: 'ai-candidate-ranking',
      title: '7. AI Candidate Matching & Ranking',
      badge: 'Recruitment AI',
      badgeVariant: 'purple',
      description:
        'Automatically sorts and ranks applicant submissions for HR teams based on job requirements, skill weightings, and experience fit.',
      icon: BrainCircuit,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
    },
    {
      id: 'notifications',
      title: '8. Real-time Notifications',
      badge: 'SMTP Email',
      badgeVariant: 'danger',
      description:
        'Instant status change notifications, email interview invitations, and recruiter updates sent seamlessly via Gmail SMTP.',
      icon: BellRing,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wide">
            <span>Platform Capabilities</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            End-to-End AI Recruitment Suite
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            From initial resume parsing to final candidate selection, explore the intelligent features powering job seekers and HR teams.
          </p>
        </div>

        {/* 8 Feature Cards Grid with Staggered Entrance & Interactive Hover Effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureList.map((f, index) => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${(index % 4) * 100 + 100}ms` }}
              >
                <Card
                  variant="interactive"
                  className="p-6 h-full flex flex-col justify-between group rounded-3xl border border-slate-200/80 hover:border-indigo-400/80 hover:shadow-[0_20px_45px_-12px_rgba(99,102,241,0.2)] hover:-translate-y-2 transition-all duration-300 ease-out relative overflow-hidden"
                >
                  {/* Hover Light Gradient Accent */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <CardContent className="p-0 space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className={`p-3.5 rounded-2xl border ${f.color} group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-2xs`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge variant={f.badgeVariant} size="xs" className="group-hover:scale-105 transition-transform">
                        {f.badge}
                      </Badge>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                      {f.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {f.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

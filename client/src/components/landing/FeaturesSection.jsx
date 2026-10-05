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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            End-to-End AI Recruitment Suite
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            From initial resume parsing to final candidate selection, explore the intelligent features powering job seekers and HR teams.
          </p>
        </div>

        {/* 8 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureList.map((f) => {
            const Icon = f.icon;
            return (
              <Card
                key={f.id}
                variant="interactive"
                className="p-6 flex flex-col justify-between group hover:border-indigo-300"
              >
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl border ${f.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant={f.badgeVariant} size="xs">
                      {f.badge}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition leading-snug">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

import React, { useState } from 'react';
import { UserCheck, Building2, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';

const RoleBasedSection = () => {
  const [activeRole, setActiveRole] = useState('seeker');

  const roles = [
    {
      id: 'seeker',
      title: 'Job Seekers',
      subtitle: 'Accelerate your career search with AI assistance',
      icon: UserCheck,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      badgeVariant: 'primary',
      features: [
        'Search curated job opportunities matched to your profile',
        'Upload & optimize resumes with instant AI ATS scoring (0-100%)',
        'Track application statuses across real-time Kanban pipelines',
        'Receive automated email updates & interview notifications',
        'Practice with AI-generated interview preparation questions',
      ],
      ctaText: 'Join as Job Seeker',
      ctaLink: '/register',
    },
    {
      id: 'hr',
      title: 'HR & Recruiters',
      subtitle: 'Streamline hiring with automated candidate ranking',
      icon: Building2,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      badgeVariant: 'purple',
      features: [
        'Publish company job postings & define custom skill parameters',
        'Discover top candidates sorted by automated AI match scores',
        'Inspect candidate profiles & download private PDF resumes from R2',
        'Shortlist, reject, or advance candidates in one click',
        'Schedule technical/HR interviews with calendar integration',
      ],
      ctaText: 'Post Jobs as Employer',
      ctaLink: '/register',
    },
    {
      id: 'admin',
      title: 'Platform Admins',
      subtitle: 'Monitor platform ecosystem, security, and moderation',
      icon: ShieldCheck,
      color: 'text-slate-800 bg-slate-100 border-slate-300',
      badgeVariant: 'neutral',
      features: [
        'Manage user accounts across Job Seekers & HR Recruiters',
        'Activate, deactivate, or suspend accounts for policy compliance',
        'Moderate published job listings & prevent spam/unverified posts',
        'Track platform-wide analytics, applications, and activity metrics',
        'Audit system health, database connections, and storage usage',
      ],
      ctaText: 'Explore Admin Controls',
      ctaLink: '/login',
    },
  ];

  return (
    <section id="roles" className="py-20 bg-slate-50/70 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wide">
            <span>Role-Based Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tailored Experiences for Every Role
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Whether you are landing your next role, sourcing top talent, or administering the platform, TalentAI delivers dedicated workflows.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.id}
                variant="default"
                className="p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-200 border-slate-200/90"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className={`p-3.5 rounded-2xl border ${role.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant={role.badgeVariant} size="sm">
                      {role.title}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{role.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{role.subtitle}</p>
                  </div>

                  <ul className="space-y-3 pt-2">
                    {role.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6">
                  <Link to={role.ctaLink}>
                    <Button
                      variant={role.id === 'hr' ? 'secondary' : 'outline'}
                      size="md"
                      fullWidth
                      rightIcon={ArrowRight}
                    >
                      {role.ctaText}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RoleBasedSection;

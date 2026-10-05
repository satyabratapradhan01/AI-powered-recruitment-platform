import React from 'react';
import { ShieldCheck, Lock, HardDrive, KeyRound } from 'lucide-react';
import Card, { CardContent } from '../ui/Card';
import Badge from '../ui/Badge';

const SecuritySection = () => {
  const securityFeatures = [
    {
      title: 'Cloudflare R2 Resume Storage',
      description: 'Resumes and cover letters are stored in private Cloudflare R2 buckets with signed access links.',
      icon: HardDrive,
      badge: 'R2 ENCRYPTED',
      badgeVariant: 'primary',
    },
    {
      title: 'JWT Role-Based Auth (RBAC)',
      description: 'Strict role authorization for Candidate, HR Recruiter, and Administrator workspace access.',
      icon: KeyRound,
      badge: 'RBAC VERIFIED',
      badgeVariant: 'purple',
    },
    {
      title: 'Bcrypt Password Protection',
      description: 'All passwords are standard bcrypt hashed before storage in MongoDB database clusters.',
      icon: Lock,
      badge: 'BCRYPT HASHED',
      badgeVariant: 'success',
    },
  ];

  return (
    <section id="security" className="py-20 bg-gradient-to-br from-indigo-50/50 via-slate-50 to-purple-50/40 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wide shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Security & Data Compliance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Enterprise-Grade Platform Security
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            TalentAI protects sensitive resume documents, application histories, and credentials with multi-layer security.
          </p>
        </div>

        {/* 3 Security Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {securityFeatures.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} variant="glass" className="p-8 hover:shadow-lg transition-all duration-200">
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant={item.badgeVariant} size="xs">
                      {item.badge}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 pt-2">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-indigo-600">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Enterprise Standard</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;

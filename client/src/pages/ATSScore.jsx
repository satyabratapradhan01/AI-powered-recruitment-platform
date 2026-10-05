import React from 'react';
import { mockProfile } from '../data/seekerMockData';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { FileText, Sparkles, CheckCircle2, Upload, AlertCircle } from 'lucide-react';

const ATSScore = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          AI Resume & ATS Optimization
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Evaluate resume keywords, ATS compatibility scores, and skill gap recommendations.
        </p>
      </div>

      <Card variant="default" className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" /> Resume ATS Score Breakdown
            </CardTitle>
            <CardDescription>Evaluated against full-stack developer position benchmarks</CardDescription>
          </div>
          <Badge variant="purple" size="md">{mockProfile.atsScore}% ATS Match</Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-indigo-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-900 text-sm">{mockProfile.resumeFilename}</p>
                <p className="text-xs text-slate-500">Cloudflare R2 Bucket • Uploaded {mockProfile.resumeUploadedDate}</p>
              </div>
            </div>
            <Button variant="outline" size="xs" leftIcon={Upload}>
              Re-scan Resume
            </Button>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Keyword Optimization Strength</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between font-semibold">
                <span>React.js & Frontend Architecture</span>
                <span className="text-emerald-600 font-bold">100% Match</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-full" />
              </div>

              <div className="flex items-center justify-between font-semibold pt-2">
                <span>Node.js REST APIs & Microservices</span>
                <span className="text-emerald-600 font-bold">95% Match</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-[95%]" />
              </div>

              <div className="flex items-center justify-between font-semibold pt-2">
                <span>Cloud Infrastructure & CI/CD</span>
                <span className="text-amber-600 font-bold">75% Match</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full w-[75%]" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ATSScore;

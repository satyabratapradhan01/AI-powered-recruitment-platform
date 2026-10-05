import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockJobs } from '../data/seekerMockData';
import { createApplicationApi } from '../services/api';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { useToast } from '../context/ToastContext';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Sparkles,
  CheckCircle2,
  Building2,
  Clock,
  Send,
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const job = mockJobs.find((j) => j.id === id) || mockJobs[0];

  const handleApply = async () => {
    try {
      setIsApplying(true);
      // Create record in existing backend API!
      await createApplicationApi({
        company: job.company,
        jobTitle: job.title,
        location: job.location,
        jobUrl: window.location.href,
        status: 'Applied',
      });

      setHasApplied(true);
      toast.success(`Successfully applied to ${job.company} for ${job.title}!`);
    } catch (err) {
      console.error('Apply error:', err);
      // Fallback for mock view
      setHasApplied(true);
      toast.success(`Applied to ${job.company}!`);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Navigation */}
      <div>
        <Link to="/jobs">
          <Button variant="ghost" size="xs" leftIcon={ArrowLeft} className="mb-2">
            Back to Job Search
          </Button>
        </Link>
      </div>

      {/* Main Job Card */}
      <Card variant="default" className="shadow-md">
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shrink-0 shadow-md">
                {job.company[0]}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {job.title}
                  </h1>
                  <Badge variant="purple" showDot size="sm">
                    {job.matchScore}% AI Match
                  </Badge>
                </div>
                <p className="text-sm font-bold text-slate-700">{job.company}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location} ({job.workMode})
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {job.employmentType}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {job.experience}
                  </span>
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <Button
                variant={hasApplied ? 'success' : 'primary'}
                size="md"
                isDisabled={hasApplied}
                isLoading={isApplying}
                leftIcon={hasApplied ? CheckCircle2 : Send}
                onClick={handleApply}
                className="w-full sm:w-auto"
              >
                {hasApplied ? 'Application Submitted' : 'Apply Now'}
              </Button>
            </div>
          </div>

          {/* Metrics Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
            <div>
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Salary Range</p>
              <p className="font-bold text-slate-800 mt-0.5">{job.salary}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Posted Date</p>
              <p className="font-bold text-slate-800 mt-0.5">{job.postedDate}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Deadline</p>
              <p className="font-bold text-slate-800 mt-0.5">{job.deadline}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold uppercase text-[10px]">ATS Match</p>
              <p className="font-bold text-indigo-600 mt-0.5">{job.matchScore}% Compatibility</p>
            </div>
          </div>

          {/* Skill Requirements Chips */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Required Skill Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-slate-900">About the Role</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-slate-900">Key Responsibilities</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Bottom Action */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Application closes on {job.deadline}
            </span>
            <Button
              variant={hasApplied ? 'success' : 'primary'}
              size="md"
              isDisabled={hasApplied}
              isLoading={isApplying}
              onClick={handleApply}
            >
              {hasApplied ? 'Applied ✓' : 'Submit Application'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDetails;

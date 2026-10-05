import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getJobByIdApi, createApplicationApi, getApplicationsApi } from '../services/api';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { SkeletonCard } from '../components/ui/SkeletonLoader';
import { useToast } from '../context/ToastContext';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Send,
  CheckCircle2,
  Building2,
  Sparkles,
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [existingApplication, setExistingApplication] = useState(null);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getJobByIdApi(id);
      setJob(res.data?.data || null);

      // Check if candidate has already applied to this job
      try {
        const appRes = await getApplicationsApi({ jobId: id });
        const list = appRes.data?.data || [];
        if (list.length > 0) {
          setHasApplied(true);
          setExistingApplication(list[0]);
        }
      } catch (err) {
        // optional check
      }
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError(err.response?.data?.message || 'Job position not found');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!job) return;
    try {
      setIsApplying(true);
      const res = await createApplicationApi({
        jobId: job._id,
        coverLetter: `Expressing strong interest in the ${job.title} position at ${job.company}.`,
      });

      setHasApplied(true);
      setExistingApplication(res.data?.data);
      toast.success(res.data?.message || `Successfully applied to ${job.company} for ${job.title}!`);
    } catch (err) {
      console.error('Apply error:', err);
      toast.error(err.response?.data?.message || 'Failed to submit job application');
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <SkeletonCard />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/jobs">
          <Button variant="ghost" size="xs" leftIcon={ArrowLeft}>
            Back to Jobs
          </Button>
        </Link>
        <ErrorState title="Job Position Not Found" message={error || 'This job posting may have expired.'} onRetry={fetchJobDetails} />
      </div>
    );
  }

  const requiredSkills = job.requiredSkills || [];
  const preferredSkills = job.preferredSkills || [];

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
                {job.company ? job.company[0] : 'C'}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {job.title}
                  </h1>
                  <Badge variant="purple" showDot size="sm">
                    {job.workMode || 'Full-time'}
                  </Badge>
                </div>
                <p className="text-sm font-bold text-slate-700">{job.company}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location || 'Remote'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {job.employmentType || 'Full-time'}
                  </span>
                  {job.experienceRequired && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {job.experienceRequired}
                    </span>
                  )}
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
              <p className="font-bold text-slate-800 mt-0.5">
                {job.salaryMin ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax?.toLocaleString()}` : 'Competitive'}
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Posted Date</p>
              <p className="font-bold text-slate-800 mt-0.5">
                {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Status</p>
              <p className="font-bold text-emerald-600 mt-0.5">{job.status || 'Active'}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Department</p>
              <p className="font-bold text-indigo-600 mt-0.5">{job.department || 'Engineering'}</p>
            </div>
          </div>

          {/* Skill Requirements Chips */}
          {requiredSkills.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Required Skill Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {requiredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Preferred Skill Stack */}
          {preferredSkills.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Preferred Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {preferredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-slate-900">About the Role</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Bottom Action */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              {hasApplied ? 'You have already submitted an application for this role.' : 'Ready to take the next step in your career?'}
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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJobsApi, getApplicationsApi, getInterviewsApi } from '../../services/api';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Avatar from '../../components/ui/Avatar';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { SkeletonCard, SkeletonTable } from '../../components/ui/SkeletonLoader';
import {
  Briefcase,
  Users,
  Calendar,
  UserCheck,
  Plus,
  ArrowRight,
  Sparkles,
  Clock,
  ExternalLink,
} from 'lucide-react';

const HRDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHRDashboardData();
  }, []);

  const fetchHRDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [jobsRes, appRes, intRes] = await Promise.all([
        getJobsApi(),
        getApplicationsApi(),
        getInterviewsApi(),
      ]);

      setJobs(jobsRes.data?.data || []);
      setApplications(appRes.data?.data || []);
      setInterviews(intRes.data?.data || []);
    } catch (err) {
      console.error('Error fetching HR dashboard:', err);
      setError(err.response?.data?.message || 'Failed to load recruiter console');
    } finally {
      setLoading(false);
    }
  };

  const activeJobsCount = jobs.filter((j) => j.status === 'Active' || !j.status).length;
  const totalApplicantsCount = applications.length;
  const upcomingInterviews = interviews.filter((i) => i.status === 'Scheduled' || i.status === 'Rescheduled');
  const selectedCount = applications.filter((a) => a.status === 'Selected').length;

  const topMatchingApplicants = [...applications]
    .sort((a, b) => (b.atsScore || 75) - (a.atsScore || 75))
    .slice(0, 3);

  const upcomingInterview = upcomingInterviews[0];

  const stats = [
    {
      label: 'Active Jobs',
      count: activeJobsCount,
      icon: Briefcase,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      label: 'Total Applicants',
      count: totalApplicantsCount,
      icon: Users,
      color: 'text-sky-600 bg-sky-50 border-sky-100',
    },
    {
      label: 'Interviews Scheduled',
      count: upcomingInterviews.length,
      icon: Calendar,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      label: 'Selected Candidates',
      count: selectedCount,
      icon: UserCheck,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-purple-200">
            <Sparkles className="w-3.5 h-3.5" /> Employer & HR Recruiter Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Recruiter Management Console
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/90 max-w-xl">
            Sourcing candidates, managing job postings, evaluating AI ATS scores, and scheduling interviews.
          </p>
        </div>

        <div className="relative z-10 shrink-0 flex items-center gap-3">
          <Link to="/hr/jobs/new">
            <Button variant="primary" size="md" leftIcon={Plus} className="bg-purple-600 hover:bg-purple-500 text-white shadow-lg">
              Create New Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} variant="interactive" className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
                  {s.label}
                </span>
                <div className={`p-2 rounded-xl border ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {s.count}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Two Columns: Top Matching Candidates & Upcoming Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Top Matching Candidates (7 cols) */}
        <div className="lg:col-span-7">
          <Card variant="default" className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" /> Top AI Matching Candidates
                </CardTitle>
                <CardDescription>Applicants sorted by AI ATS compatibility score</CardDescription>
              </div>
              <Link to="/hr/applicants">
                <Button variant="ghost" size="xs" rightIcon={ArrowRight}>
                  All Applicants
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <SkeletonCard />
              ) : topMatchingApplicants.length === 0 ? (
                <EmptyState icon={Users} title="No applicants yet" description="Posted jobs will receive applicant submissions here." />
              ) : (
                topMatchingApplicants.map((app) => {
                  const candidateName = app.candidateId?.name || app.candidateName || 'Candidate';
                  return (
                    <div
                      key={app._id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 hover:bg-slate-100/60 transition"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar name={candidateName} size="md" status="online" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">{candidateName}</h4>
                            <Badge variant="purple" size="xs">{app.atsScore || 75}% AI Match</Badge>
                          </div>
                          <p className="text-xs font-semibold text-slate-600">{app.jobTitle}</p>
                          <p className="text-[11px] text-slate-400">{app.company}</p>
                        </div>
                      </div>
                      <Link to="/hr/applicants">
                        <Button variant="outline" size="xs">
                          Review
                        </Button>
                      </Link>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Upcoming Interview (5 cols) */}
        <div className="lg:col-span-5">
          <Card variant="default" className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-500" /> Upcoming HR Interview
                </CardTitle>
                <CardDescription>Next scheduled candidate call</CardDescription>
              </div>
              <Link to="/hr/interviews">
                <Button variant="ghost" size="xs" rightIcon={ArrowRight}>
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {upcomingInterview ? (
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">
                        {upcomingInterview.candidateId?.name || 'Candidate'}
                      </h4>
                      <p className="text-xs font-bold text-indigo-600">
                        {upcomingInterview.applicationId?.jobTitle || 'Role'}
                      </p>
                    </div>
                    <Badge variant="warning" showDot size="xs">
                      {upcomingInterview.interviewDate}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-amber-100">
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" /> {upcomingInterview.interviewTime} ({upcomingInterview.duration || 60} mins)
                    </p>
                    {upcomingInterview.interviewerName && (
                      <p className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-amber-600" /> {upcomingInterview.interviewerName}
                      </p>
                    )}
                  </div>
                  {upcomingInterview.meetingLink && (
                    <div className="pt-2 flex justify-end">
                      <a href={upcomingInterview.meetingLink} target="_blank" rel="noopener noreferrer">
                        <Button variant="primary" size="xs" rightIcon={ExternalLink}>
                          Launch Meeting
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <EmptyState icon={Calendar} title="No upcoming interviews" description="Scheduled interviews will appear here." />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Applicants Table */}
      <Card variant="default">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" /> Recent Applicant Submissions
            </CardTitle>
            <CardDescription>Latest candidates who submitted applications</CardDescription>
          </div>
          <Link to="/hr/applicants">
            <Button variant="ghost" size="xs" rightIcon={ArrowRight}>
              View All Applicants ({applications.length})
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <SkeletonTable rows={5} />
          ) : error ? (
            <ErrorState title="Error Loading Applicants" message={error} onRetry={fetchHRDashboardData} />
          ) : applications.length === 0 ? (
            <EmptyState title="No applicants recorded" description="Posted jobs will display applicant submissions here." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Applied Position</TableHead>
                  <TableHead>AI Match</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.slice(0, 5).map((app) => {
                  const candidateName = app.candidateId?.name || app.candidateName || 'Applicant';
                  const candidateEmail = app.candidateId?.email || app.email || '';

                  let statusVariant = 'info';
                  if (app.status === 'Shortlisted') statusVariant = 'purple';
                  if (app.status === 'Selected') statusVariant = 'success';
                  if (app.status === 'Rejected') statusVariant = 'danger';

                  return (
                    <TableRow key={app._id}>
                      <TableCell className="font-bold text-slate-900 flex items-center gap-2.5">
                        <Avatar name={candidateName} size="xs" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{candidateName}</p>
                          <p className="text-[10px] text-slate-400">{candidateEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-slate-700">{app.jobTitle}</TableCell>
                      <TableCell>
                        <Badge variant="purple" size="xs">{app.atsScore || 75}% Match</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant} showDot size="xs">
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to="/hr/applicants">
                          <Button variant="outline" size="xs">
                            Review Profile
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HRDashboard;

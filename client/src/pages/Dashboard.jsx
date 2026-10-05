import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApplicationsApi, getRecommendedJobsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { mockJobs, mockInterviews, mockNotifications, mockProfile } from '../data/seekerMockData';
import StatusBadge from '../components/StatusBadge';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { SkeletonCard, SkeletonTable } from '../components/ui/SkeletonLoader';
import {
  Briefcase,
  Send,
  Calendar,
  Award,
  XCircle,
  Plus,
  ArrowRight,
  Sparkles,
  TrendingUp,
  UserCheck,
  Bell,
  Clock,
  ExternalLink,
  MapPin,
  CheckCircle2,
  Check,
  AlertCircle,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [recommendations, setRecommendations] = useState([]);
  const [recLoading, setRecLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const appRes = await getApplicationsApi();
      setApplications(appRes.data.data);
    } catch (err) {
      console.error('Error fetching dashboard applications:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }

    try {
      setRecLoading(true);
      const recRes = await getRecommendedJobsApi();
      setRecommendations(recRes.data.data || []);
    } catch (err) {
      console.error('Error fetching job recommendations:', err);
      setRecommendations([]);
    } finally {
      setRecLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalCount = applications.length;
  const appliedCount = applications.filter((a) => a.status === 'Applied').length;
  const interviewCount = applications.filter((a) => a.status === 'Interview').length;
  const offerCount = applications.filter((a) => a.status === 'Offer').length;
  const rejectedCount = applications.filter((a) => a.status === 'Rejected').length;

  const recentApplications = [...applications]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.appliedDate) - new Date(a.createdAt || a.appliedDate)
    )
    .slice(0, 5);

  const upcomingInterview = mockInterviews.find((i) => i.type === 'Upcoming');

  const stats = [
    {
      label: 'Total Applications',
      count: totalCount,
      icon: Briefcase,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      label: 'Under Review',
      count: appliedCount,
      icon: Send,
      color: 'text-sky-600 bg-sky-50 border-sky-100',
    },
    {
      label: 'Interviews',
      count: interviewCount,
      icon: Calendar,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      label: 'Offers Received',
      count: offerCount,
      icon: Award,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Personalized Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200">
            <Sparkles className="w-3.5 h-3.5" /> AI Match Intelligence Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Applicant'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200/90 max-w-xl">
            You have <strong className="text-white">{upcomingInterview ? '1 upcoming interview' : '0 pending interviews'}</strong> and <strong className="text-white">{mockNotifications.filter(n => !n.isRead).length} new notifications</strong>.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <Link to="/applications/new">
            <Button variant="primary" size="md" leftIcon={Plus} className="bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg">
              New Application
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Profile Completion Bar Card */}
      <Card variant="default" className="p-5 border-indigo-100 bg-indigo-50/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">Profile Completion</h3>
                <Badge variant="purple" size="xs">94% Complete</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Add 2 more skill tags to reach 100% profile optimization score.
              </p>
            </div>
          </div>
          <div className="w-full sm:w-48 bg-slate-200 rounded-full h-2 overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full w-[94%]" />
          </div>
          <Link to="/profile">
            <Button variant="outline" size="xs">
              Edit Profile
            </Button>
          </Link>
        </div>
      </Card>

      {/* 3. Metric Cards */}
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
                {totalCount > 0 && (
                  <span className="text-[11px] font-semibold text-slate-400">
                    {Math.round((s.count / totalCount) * 100)}%
                  </span>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* 4. Main Two Column Grid: Upcoming Interview & Notifications Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upcoming Interview (7 cols) */}
        <div className="lg:col-span-7">
          <Card variant="default" className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-500" /> Upcoming Interview
                </CardTitle>
                <CardDescription>Scheduled hiring discussion</CardDescription>
              </div>
              <Link to="/interviews">
                <Button variant="ghost" size="xs" rightIcon={ArrowRight}>
                  All Interviews
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {upcomingInterview ? (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">
                        {upcomingInterview.jobTitle}
                      </h4>
                      <p className="text-xs font-bold text-indigo-600">
                        {upcomingInterview.company}
                      </p>
                    </div>
                    <Badge variant="warning" showDot size="xs">
                      {upcomingInterview.date}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-amber-100/80">
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" /> {upcomingInterview.time} ({upcomingInterview.format})
                    </p>
                    <p className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-amber-600" /> {upcomingInterview.interviewer}
                    </p>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <a href={upcomingInterview.joinUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="primary" size="xs" rightIcon={ExternalLink}>
                        Join Video Call
                      </Button>
                    </a>
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon={Calendar}
                  title="No upcoming interviews"
                  description="Keep submitting applications to land your next interview."
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Notifications Summary Widget (5 cols) */}
        <div className="lg:col-span-5">
          <Card variant="default" className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-indigo-600" /> Recent Alerts
                </CardTitle>
                <CardDescription>Live notifications</CardDescription>
              </div>
              <Link to="/notifications">
                <Button variant="ghost" size="xs" rightIcon={ArrowRight}>
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockNotifications.slice(0, 3).map((n) => (
                <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{n.title}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{n.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">{n.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 5. AI Recommended Jobs Section */}
      <Card variant="default">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" /> Top AI Job Matches
            </CardTitle>
            <CardDescription>Personalized open roles matched to your resume, skills & experience</CardDescription>
          </div>
          <Link to="/jobs">
            <Button variant="ghost" size="xs" rightIcon={ArrowRight}>
              Search All Jobs
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : recommendations.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="No AI Job Recommendations yet"
              description="Complete your profile skills and upload a resume to receive AI job recommendations."
              actionLabel="Update Profile Skills"
              actionLink="/profile"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.slice(0, 3).map((item) => {
                const job = item.job || item;
                const matchScore = item.matchScore ?? job.matchScore ?? 80;
                const matchingSkills = item.matchingSkills || [];
                const missingSkills = item.missingSkills || [];
                const explanation = item.explanation || '';

                let badgeVariant = 'purple';
                if (matchScore >= 80) badgeVariant = 'success';
                else if (matchScore >= 60) badgeVariant = 'info';

                return (
                  <div
                    key={job._id || job.id}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:shadow-lg transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">{job.title}</h4>
                          <p className="text-xs font-semibold text-slate-600">{job.company}</p>
                        </div>
                        <Badge variant={badgeVariant} size="xs" className="shrink-0 font-bold">
                          {matchScore}% Match
                        </Badge>
                      </div>

                      <div className="text-[11px] text-slate-500 space-y-1">
                        <p className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {job.location || 'Remote'} ({job.workMode || 'Full-time'})
                        </p>
                        {job.salaryMin ? (
                          <p className="font-semibold text-slate-700">
                            ${job.salaryMin.toLocaleString()} - ${job.salaryMax?.toLocaleString()}
                          </p>
                        ) : null}
                      </div>

                      {/* Matching Skills */}
                      {matchingSkills.length > 0 && (
                        <div className="pt-1 flex flex-wrap gap-1">
                          {matchingSkills.slice(0, 3).map((s, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-0.5 text-[10px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-100"
                            >
                              <Check className="w-2.5 h-2.5 text-emerald-600" /> {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Missing Skills */}
                      {missingSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {missingSkills.slice(0, 2).map((s, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-0.5 text-[10px] font-medium bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-100"
                            >
                              <AlertCircle className="w-2.5 h-2.5 text-amber-600" /> Missing: {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Explanation */}
                      {explanation && (
                        <p className="text-[11px] text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100 leading-snug line-clamp-2">
                          "{explanation}"
                        </p>
                      )}
                    </div>

                    <Link to={`/jobs/${job._id || job.id}`}>
                      <Button variant="outline" size="xs" fullWidth rightIcon={ArrowRight} className="mt-2">
                        View Position
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 6. Recent Applications Table */}
      <Card variant="default">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" /> Recent Applications
            </CardTitle>
            <CardDescription>Your 5 latest submitted job applications</CardDescription>
          </div>
          {applications.length > 5 && (
            <Link to="/applications">
              <Button variant="ghost" size="xs" rightIcon={ArrowRight}>
                View All ({applications.length})
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <SkeletonTable rows={5} />
          ) : error ? (
            <ErrorState title="Failed to Load Dashboard" message={error} onRetry={fetchApplications} />
          ) : recentApplications.length === 0 ? (
            <EmptyState
              title="No job applications tracked yet"
              description="Start by adding your active job applications to monitor recruitment responses."
              actionLabel="Add Your First Application"
              actionLink="/applications/new"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentApplications.map((app) => (
                  <TableRow key={app._id}>
                    <TableCell className="font-bold text-slate-900">{app.company}</TableCell>
                    <TableCell className="font-semibold text-slate-700">{app.jobTitle}</TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {app.appliedDate
                        ? new Date(app.appliedDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={app.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/applications/${app._id}/edit`}>
                        <Button variant="outline" size="xs">
                          Edit
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

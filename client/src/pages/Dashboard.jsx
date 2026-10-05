import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApplicationsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table, {
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../components/ui/Table';
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
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getApplicationsApi();
      setApplications(response.data.data);
    } catch (err) {
      console.error('Error fetching dashboard applications:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
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

  const stats = [
    {
      label: 'Total Applications',
      count: totalCount,
      icon: Briefcase,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      label: 'Applied',
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
      label: 'Offers',
      count: offerCount,
      icon: Award,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      label: 'Rejected',
      count: rejectedCount,
      icon: XCircle,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200">
            <Sparkles className="w-3.5 h-3.5" /> AI Recruitment Insights Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Applicant'}!
          </h1>
          <p className="text-sm text-indigo-200/90 max-w-xl">
            Track your recruitment progress, application status, and AI interview matches in one real-time workspace.
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

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <SkeletonTable rows={5} />
        </div>
      ) : error ? (
        <ErrorState
          title="Failed to Load Dashboard"
          message={error}
          onRetry={fetchApplications}
        />
      ) : (
        <>
          {/* Stats Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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

          {/* Recent Applications Table */}
          <Card variant="default">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  Recent Applications
                </CardTitle>
                <CardDescription>
                  Your 5 most recently updated job submissions
                </CardDescription>
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
              {recentApplications.length === 0 ? (
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
                        <TableCell className="font-bold text-slate-900">
                          {app.company}
                        </TableCell>
                        <TableCell className="font-semibold text-slate-700">
                          {app.jobTitle}
                        </TableCell>
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
        </>
      )}
    </div>
  );
};

export default Dashboard;

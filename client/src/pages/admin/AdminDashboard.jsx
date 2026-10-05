import React from 'react';
import { Link } from 'react-router-dom';
import { mockAdminUsers, mockAdminJobs, mockAdminApplications, mockAdminAnalytics } from '../../data/adminMockData';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Avatar from '../../components/ui/Avatar';
import {
  Users,
  UserCheck,
  Building2,
  Briefcase,
  Kanban,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Activity,
} from 'lucide-react';

const AdminDashboard = () => {
  const metrics = [
    {
      label: 'Total Platform Users',
      value: mockAdminAnalytics.totalUsers,
      icon: Users,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      label: 'Job Seekers',
      value: mockAdminAnalytics.seekersCount,
      icon: UserCheck,
      color: 'text-sky-600 bg-sky-50 border-sky-100',
    },
    {
      label: 'HR Recruiter Users',
      value: mockAdminAnalytics.hrCount,
      icon: Building2,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      label: 'Active Job Openings',
      value: mockAdminAnalytics.activeJobsCount,
      icon: Briefcase,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      label: 'Total Applications',
      value: mockAdminAnalytics.totalApplicationsCount,
      icon: Kanban,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      label: 'Total Interviews',
      value: mockAdminAnalytics.totalInterviewsCount,
      icon: Calendar,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Platform Admin Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Administrator Overview & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200/90 max-w-xl">
            Monitor system health, manage user permissions, moderate job listings, and track platform-wide applications.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <Link to="/admin/analytics">
            <Button variant="primary" size="md" rightIcon={ArrowRight} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-md">
              Platform Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.label} variant="interactive" className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                  {m.label}
                </span>
                <div className={`p-1.5 rounded-xl border ${m.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black text-slate-900">
                  {m.value}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Two Columns: Recent User Signups & Job Openings Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Users (7 cols) */}
        <div className="lg:col-span-7">
          <Card variant="default" className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" /> Registered Users
                </CardTitle>
                <CardDescription>Recent account registrations across roles</CardDescription>
              </div>
              <Link to="/admin/users">
                <Button variant="ghost" size="xs" rightIcon={ArrowRight}>
                  User Management
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAdminUsers.slice(0, 4).map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-bold text-slate-900 flex items-center gap-2">
                        <Avatar name={u.name} size="xs" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{u.name}</p>
                          <p className="text-[10px] text-slate-400">{u.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={u.role === 'admin' ? 'purple' : u.role === 'hr' ? 'primary' : 'info'}
                          size="xs"
                        >
                          {u.role.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={u.status === 'Active' ? 'success' : 'neutral'} showDot size="xs">
                          {u.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">{u.joinedDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Platform Applications (5 cols) */}
        <div className="lg:col-span-5">
          <Card variant="default" className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Kanban className="w-5 h-5 text-emerald-600" /> System Applications
                </CardTitle>
                <CardDescription>Latest candidate submissions</CardDescription>
              </div>
              <Link to="/admin/applications">
                <Button variant="ghost" size="xs" rightIcon={ArrowRight}>
                  All Submissions
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockAdminApplications.slice(0, 3).map((app) => (
                <div key={app.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{app.candidateName}</p>
                    <p className="text-[11px] font-semibold text-indigo-600">{app.jobTitle} • {app.company}</p>
                    <p className="text-[10px] text-slate-400">{app.appliedDate}</p>
                  </div>
                  <Badge variant={app.status === 'Offer' ? 'success' : app.status === 'Interview' ? 'warning' : 'info'} size="xs">
                    {app.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

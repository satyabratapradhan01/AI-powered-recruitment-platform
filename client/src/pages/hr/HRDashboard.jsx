import React from 'react';
import { Link } from 'react-router-dom';
import { mockPostedJobs, mockApplicants, mockHRInterviews } from '../../data/hrMockData';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Avatar from '../../components/ui/Avatar';
import {
  Briefcase,
  Users,
  Calendar,
  UserCheck,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Clock,
  ExternalLink,
} from 'lucide-react';

const HRDashboard = () => {
  const activeJobsCount = mockPostedJobs.filter((j) => j.status === 'Active').length;
  const totalApplicantsCount = mockApplicants.length;
  const interviewsCount = mockHRInterviews.filter((i) => i.status === 'Upcoming').length;
  const selectedCount = mockApplicants.filter((a) => a.status === 'Selected').length;

  const topMatchingApplicants = [...mockApplicants]
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  const upcomingInterview = mockHRInterviews.find((i) => i.status === 'Upcoming');

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
      count: interviewsCount,
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
              {topMatchingApplicants.map((cand) => (
                <div
                  key={cand.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 hover:bg-slate-100/60 transition"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={cand.candidateName} size="md" status="online" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{cand.candidateName}</h4>
                        <Badge variant="purple" size="xs">{cand.matchScore}% AI Match</Badge>
                      </div>
                      <p className="text-xs font-semibold text-slate-600">{cand.jobTitle}</p>
                      <p className="text-[11px] text-slate-400">{cand.location}</p>
                    </div>
                  </div>
                  <Link to={`/hr/applicants`}>
                    <Button variant="outline" size="xs">
                      Review
                    </Button>
                  </Link>
                </div>
              ))}
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
                      <h4 className="font-bold text-slate-900 text-base">{upcomingInterview.candidateName}</h4>
                      <p className="text-xs font-bold text-indigo-600">{upcomingInterview.jobTitle}</p>
                    </div>
                    <Badge variant="warning" showDot size="xs">{upcomingInterview.date}</Badge>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-amber-100">
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" /> {upcomingInterview.time} ({upcomingInterview.format})
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-600" /> {upcomingInterview.interviewer}
                    </p>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <a href={upcomingInterview.joinUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="primary" size="xs" rightIcon={ExternalLink}>
                        Launch Meeting
                      </Button>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-500">No interviews scheduled.</div>
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
              View All Applicants ({mockApplicants.length})
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
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
              {mockApplicants.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-bold text-slate-900 flex items-center gap-2.5">
                    <Avatar name={app.candidateName} size="xs" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{app.candidateName}</p>
                      <p className="text-[10px] text-slate-400">{app.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-slate-700">{app.jobTitle}</TableCell>
                  <TableCell>
                    <Badge variant="purple" size="xs">{app.matchScore}% Match</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">{app.appliedDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        app.status === 'Shortlisted'
                          ? 'primary'
                          : app.status === 'Selected'
                          ? 'success'
                          : app.status === 'Rejected'
                          ? 'danger'
                          : 'info'
                      }
                      showDot
                      size="xs"
                    >
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default HRDashboard;

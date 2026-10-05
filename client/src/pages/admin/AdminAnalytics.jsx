import React, { useState, useEffect } from 'react';
import { getApplicationsApi, getJobsApi, getUsersApi, getInterviewsApi } from '../../services/api';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import ErrorState from '../../components/ui/ErrorState';
import { SkeletonCard } from '../../components/ui/SkeletonLoader';
import { TrendingUp, Building2 } from 'lucide-react';

const AdminAnalytics = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [uRes, jRes, aRes, iRes] = await Promise.all([
        getUsersApi(),
        getJobsApi(),
        getApplicationsApi(),
        getInterviewsApi(),
      ]);

      setUsers(uRes.data?.data || []);
      setJobs(jRes.data?.data || []);
      setApplications(aRes.data?.data || []);
      setInterviews(iRes.data?.data || []);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(err.response?.data?.message || 'Failed to load platform analytics');
    } finally {
      setLoading(false);
    }
  };

  const hrCount = users.filter((u) => u.role === 'hr').length;
  const totalApps = applications.length || 1;

  // Pipeline stage counts
  const appliedCount = applications.filter((a) => a.status === 'Applied').length;
  const reviewCount = applications.filter((a) => a.status === 'Under Review').length;
  const shortlistCount = applications.filter((a) => a.status === 'Shortlisted').length;
  const interviewCount = applications.filter((a) => a.status === 'Interview Scheduled' || a.status === 'Interview Completed').length;
  const selectedCount = applications.filter((a) => a.status === 'Selected').length;

  const stageDistribution = [
    { stage: 'Applied', count: appliedCount, percentage: Math.round((appliedCount / totalApps) * 100) },
    { stage: 'Under Review', count: reviewCount, percentage: Math.round((reviewCount / totalApps) * 100) },
    { stage: 'Shortlisted', count: shortlistCount, percentage: Math.round((shortlistCount / totalApps) * 100) },
    { stage: 'Interview Phase', count: interviewCount, percentage: Math.round((interviewCount / totalApps) * 100) },
    { stage: 'Selected / Hired', count: selectedCount, percentage: Math.round((selectedCount / totalApps) * 100) },
  ];

  // Group jobs by company
  const companyMap = {};
  jobs.forEach((j) => {
    const company = j.company || 'Unknown Employer';
    if (!companyMap[company]) {
      companyMap[company] = { name: company, activeOpenings: 0, applicants: 0 };
    }
    companyMap[company].activeOpenings += 1;
  });

  applications.forEach((a) => {
    const company = a.company || 'Unknown Employer';
    if (companyMap[company]) {
      companyMap[company].applicants += 1;
    }
  });

  const topCompanies = Object.values(companyMap).sort((a, b) => b.activeOpenings - a.activeOpenings);

  const conversionRate = totalApps > 0 ? `${Math.round((interviews.length / totalApps) * 100)}%` : '0%';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Platform Performance & AI Recruitment Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          High-level operational metrics, candidate conversion rates, and company job volume breakdown.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : error ? (
        <ErrorState title="Error Loading Analytics" message={error} onRetry={fetchAnalyticsData} />
      ) : (
        <>
          {/* Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card variant="interactive" className="p-5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Candidate Conversion Rate</p>
              <p className="text-3xl font-black text-emerald-600 mt-1">{conversionRate}</p>
              <p className="text-[11px] text-slate-500 mt-1">Applied → Interview Ratio</p>
            </Card>
            <Card variant="interactive" className="p-5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total System Applications</p>
              <p className="text-3xl font-black text-indigo-600 mt-1">{applications.length}</p>
              <p className="text-[11px] text-slate-500 mt-1">Logged across all hiring pipelines</p>
            </Card>
            <Card variant="interactive" className="p-5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Job Openings</p>
              <p className="text-3xl font-black text-amber-600 mt-1">{jobs.length}</p>
              <p className="text-[11px] text-slate-500 mt-1">Live employer listings</p>
            </Card>
            <Card variant="interactive" className="p-5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Registered Employers</p>
              <p className="text-3xl font-black text-purple-600 mt-1">{hrCount}</p>
              <p className="text-[11px] text-slate-500 mt-1">Verified HR user accounts</p>
            </Card>
          </div>

          {/* Two Column Section: Application Stage Progress Bars & Top Companies */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Stage Breakdown (6 cols) */}
            <div className="lg:col-span-6">
              <Card variant="default" className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" /> Pipeline Stage Breakdown
                  </CardTitle>
                  <CardDescription>Application volume distribution across recruitment stages</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stageDistribution.map((stg) => (
                    <div key={stg.stage} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800">{stg.stage}</span>
                        <span className="text-indigo-600">{stg.count} ({stg.percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(5, stg.percentage)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Top Hiring Companies (6 cols) */}
            <div className="lg:col-span-6">
              <Card variant="default" className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-purple-600" /> Hiring Companies
                  </CardTitle>
                  <CardDescription>Employers with active job postings & candidate engagement</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Active Openings</TableHead>
                        <TableHead>Applicants</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topCompanies.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-xs text-slate-400 py-6">
                            No employer company data recorded yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        topCompanies.slice(0, 5).map((c) => (
                          <TableRow key={c.name}>
                            <TableCell className="font-bold text-slate-900">{c.name}</TableCell>
                            <TableCell className="text-xs text-slate-700 font-semibold">{c.activeOpenings} jobs</TableCell>
                            <TableCell className="text-xs text-indigo-600 font-bold">{c.applicants} candidates</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;

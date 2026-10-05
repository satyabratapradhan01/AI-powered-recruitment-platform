import React from 'react';
import { mockAdminAnalytics } from '../../data/adminMockData';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import { TrendingUp, Users, Briefcase, Award, Sparkles, Building2, Percent } from 'lucide-react';

const AdminAnalytics = () => {
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

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="interactive" className="p-5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Candidate Conversion Rate</p>
          <p className="text-3xl font-black text-emerald-600 mt-1">{mockAdminAnalytics.conversionRate}</p>
          <p className="text-[11px] text-slate-500 mt-1">Applied → Interview Ratio</p>
        </Card>
        <Card variant="interactive" className="p-5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total System Applications</p>
          <p className="text-3xl font-black text-indigo-600 mt-1">{mockAdminAnalytics.totalApplicationsCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">Logged across all hiring pipelines</p>
        </Card>
        <Card variant="interactive" className="p-5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Job Openings</p>
          <p className="text-3xl font-black text-amber-600 mt-1">{mockAdminAnalytics.activeJobsCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">Live employer listings</p>
        </Card>
        <Card variant="interactive" className="p-5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Registered Employers</p>
          <p className="text-3xl font-black text-purple-600 mt-1">{mockAdminAnalytics.hrCount}</p>
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
              {mockAdminAnalytics.applicationStageDistribution.map((stg) => (
                <div key={stg.stage} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">{stg.stage}</span>
                    <span className="text-indigo-600">{stg.count} ({stg.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${stg.percentage}%` }}
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
                <Building2 className="w-5 h-5 text-purple-600" /> Top Hiring Companies
              </CardTitle>
              <CardDescription>Employers with highest job postings & candidate engagement</CardDescription>
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
                  {mockAdminAnalytics.topCompanies.map((c) => (
                    <TableRow key={c.name}>
                      <TableCell className="font-bold text-slate-900">{c.name}</TableCell>
                      <TableCell className="text-xs text-slate-700 font-semibold">{c.activeOpenings} jobs</TableCell>
                      <TableCell className="text-xs text-indigo-600 font-bold">{c.applicants} candidates</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;

import React, { useState, useEffect } from 'react';
import { getApplicationsApi } from '../../services/api';
import Card, { CardContent } from '../../components/ui/Card';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Avatar from '../../components/ui/Avatar';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { SkeletonTable } from '../../components/ui/SkeletonLoader';
import { Search } from 'lucide-react';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchAdminApplications();
  }, []);

  const fetchAdminApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getApplicationsApi();
      setApplications(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching admin applications:', err);
      setError(err.response?.data?.message || 'Failed to load application audit log');
    } finally {
      setLoading(false);
    }
  };

  const filtered = applications.filter((a) => {
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const candidateName = a.candidateId?.name || a.candidateName || 'Applicant';
    const companyName = a.company || '';
    const jobTitle = a.jobTitle || '';

    const matchesQuery =
      candidateName.toLowerCase().includes(query) ||
      jobTitle.toLowerCase().includes(query) ||
      companyName.toLowerCase().includes(query);

    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Platform Application Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global system-wide audit of all candidate job submissions across employers.
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search candidate, job title, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={Search}
          />
        </div>

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'All', label: 'All Statuses' },
            { value: 'Applied', label: 'Applied' },
            { value: 'Under Review', label: 'Under Review' },
            { value: 'Shortlisted', label: 'Shortlisted' },
            { value: 'Interview Scheduled', label: 'Interview Scheduled' },
            { value: 'Selected', label: 'Selected' },
            { value: 'Rejected', label: 'Rejected' },
          ]}
          fullWidth={false}
        />
      </div>

      {/* Table */}
      <Card variant="default">
        <CardContent className="p-0">
          {loading ? (
            <SkeletonTable rows={5} />
          ) : error ? (
            <ErrorState title="Error Loading Audit Trail" message={error} onRetry={fetchAdminApplications} />
          ) : filtered.length === 0 ? (
            <EmptyState title="No applications recorded" description="No candidate applications match your filters." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>AI Match Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((app) => {
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
                      <TableCell className="text-xs font-bold text-indigo-600">{app.company}</TableCell>
                      <TableCell>
                        <Badge variant="purple" showDot size="xs">
                          {app.atsScore || 75}% Match
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant} showDot size="xs">
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent'}
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

export default AdminApplications;

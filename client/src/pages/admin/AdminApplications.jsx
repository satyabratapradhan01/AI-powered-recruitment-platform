import React, { useState } from 'react';
import { mockAdminApplications } from '../../data/adminMockData';
import Card, { CardContent } from '../../components/ui/Card';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Avatar from '../../components/ui/Avatar';
import { Search, Kanban } from 'lucide-react';

const AdminApplications = () => {
  const [applications] = useState(mockAdminApplications);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = applications.filter((a) => {
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      a.candidateName.toLowerCase().includes(query) ||
      a.jobTitle.toLowerCase().includes(query) ||
      a.company.toLowerCase().includes(query);
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
            { value: 'Interview', label: 'Interview' },
            { value: 'Offer', label: 'Offer' },
            { value: 'Rejected', label: 'Rejected' },
          ]}
          fullWidth={false}
        />
      </div>

      {/* Table */}
      <Card variant="default">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-bold text-slate-900 flex items-center gap-2.5">
                    <Avatar name={app.candidateName} size="xs" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{app.candidateName}</p>
                      <p className="text-[10px] text-slate-400">{app.candidateEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-slate-700">{app.jobTitle}</TableCell>
                  <TableCell className="text-xs font-bold text-indigo-600">{app.company}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        app.status === 'Offer'
                          ? 'success'
                          : app.status === 'Interview'
                          ? 'warning'
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
                  <TableCell className="text-xs text-slate-500">{app.appliedDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminApplications;

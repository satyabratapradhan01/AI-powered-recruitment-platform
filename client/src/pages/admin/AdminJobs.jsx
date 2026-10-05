import React, { useState } from 'react';
import { mockAdminJobs } from '../../data/adminMockData';
import Card, { CardContent } from '../../components/ui/Card';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Tabs from '../../components/ui/Tabs';
import Modal from '../../components/ui/Modal';
import { Search, Eye, Briefcase, Building2, User } from 'lucide-react';

const AdminJobs = () => {
  const [jobs] = useState(mockAdminJobs);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredJobs = jobs.filter((j) => {
    const matchesStatus = activeTab === 'All' || j.status === activeTab;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      j.title.toLowerCase().includes(query) ||
      j.company.toLowerCase().includes(query) ||
      j.hrOwnerName.toLowerCase().includes(query);
    return matchesStatus && matchesQuery;
  });

  const tabs = [
    { id: 'All', label: 'All Jobs', count: jobs.length },
    { id: 'Active', label: 'Active Jobs', count: jobs.filter((j) => j.status === 'Active').length },
    { id: 'Closed', label: 'Closed Jobs', count: jobs.filter((j) => j.status === 'Closed').length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Platform Job Openings & HR Owners
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global view of all published jobs across employer companies and HR recruiters.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={(t) => setActiveTab(t)} variant="pills" />
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <Input
          placeholder="Search job title, company name, or HR recruiter..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={Search}
        />
      </div>

      {/* Table */}
      <Card variant="default">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>HR Recruiter Owner</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Applicants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-bold text-slate-900">{job.title}</TableCell>
                  <TableCell className="text-xs font-bold text-indigo-600">{job.company}</TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <p className="font-bold text-slate-800">{job.hrOwnerName}</p>
                      <p className="text-[10px] text-slate-400">{job.hrOwnerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">{job.location}</TableCell>
                  <TableCell className="text-xs font-bold text-slate-700">{job.applicantCount} candidates</TableCell>
                  <TableCell>
                    <Badge variant={job.status === 'Active' ? 'success' : 'neutral'} showDot size="xs">
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="xs"
                      leftIcon={Eye}
                      onClick={() => {
                        setSelectedJob(job);
                        setModalOpen(true);
                      }}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Job Details Modal */}
      {selectedJob && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`Job Details — ${selectedJob.title}`}
          description={`Published by ${selectedJob.company} on ${selectedJob.createdDate}`}
          size="md"
        >
          <div className="space-y-4 py-2 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">{selectedJob.title}</h4>
                <Badge variant={selectedJob.status === 'Active' ? 'success' : 'neutral'} showDot size="xs">
                  {selectedJob.status}
                </Badge>
              </div>
              <p className="font-bold text-indigo-600">{selectedJob.company} • {selectedJob.location}</p>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl space-y-1">
              <p className="font-bold text-indigo-950 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-600" /> HR Owner Details
              </p>
              <p className="text-indigo-900 font-bold">{selectedJob.hrOwnerName}</p>
              <p className="text-indigo-800">{selectedJob.hrOwnerEmail}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="primary" size="sm" onClick={() => setModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminJobs;

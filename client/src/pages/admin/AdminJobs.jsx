import React, { useState, useEffect } from 'react';
import { getJobsApi, deleteJobApi } from '../../services/api';
import Card, { CardContent } from '../../components/ui/Card';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Tabs from '../../components/ui/Tabs';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { SkeletonTable } from '../../components/ui/SkeletonLoader';
import { useToast } from '../../context/ToastContext';
import { Search, Eye, User, Trash2 } from 'lucide-react';

const AdminJobs = () => {
  const toast = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchAdminJobs();
  }, []);

  const fetchAdminJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getJobsApi();
      setJobs(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching admin jobs:', err);
      setError(err.response?.data?.message || 'Failed to load platform job postings');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId, title) => {
    if (!window.confirm(`Are you sure you want to delete job "${title}"?`)) return;
    try {
      await deleteJobApi(jobId);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      toast.success(`Job "${title}" deleted successfully.`);
      if (selectedJob && selectedJob._id === jobId) setModalOpen(false);
    } catch (err) {
      console.error('Delete job error:', err);
      toast.error('Failed to delete job posting');
    }
  };

  const filteredJobs = jobs.filter((j) => {
    const jobStatus = j.status || 'Active';
    const matchesStatus = activeTab === 'All' || jobStatus === activeTab;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      (j.title && j.title.toLowerCase().includes(query)) ||
      (j.company && j.company.toLowerCase().includes(query)) ||
      (j.department && j.department.toLowerCase().includes(query));
    return matchesStatus && matchesQuery;
  });

  const tabs = [
    { id: 'All', label: 'All Jobs', count: jobs.length },
    { id: 'Active', label: 'Active Jobs', count: jobs.filter((j) => j.status === 'Active' || !j.status).length },
    { id: 'Closed', label: 'Closed Jobs', count: jobs.filter((j) => j.status === 'Closed').length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Platform Job Openings & HR Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global admin view of all published jobs across employer companies and recruiters.
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
          placeholder="Search job title, company name, or department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={Search}
        />
      </div>

      {/* Table */}
      <Card variant="default">
        <CardContent className="p-0">
          {loading ? (
            <SkeletonTable rows={5} />
          ) : error ? (
            <ErrorState title="Error Loading Jobs" message={error} onRetry={fetchAdminJobs} />
          ) : filteredJobs.length === 0 ? (
            <EmptyState title="No job postings found" description="No jobs match your selected search criteria." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Recruiter / Posted By</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => {
                  const recruiter = job.postedBy || {};
                  const recruiterName = recruiter.name || 'HR Recruiter';
                  const recruiterEmail = recruiter.email || '';

                  return (
                    <TableRow key={job._id}>
                      <TableCell className="font-bold text-slate-900">{job.title}</TableCell>
                      <TableCell className="text-xs font-bold text-indigo-600">{job.company}</TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <p className="font-bold text-slate-800">{recruiterName}</p>
                          <p className="text-[10px] text-slate-400">{recruiterEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">{job.location || 'Remote'}</TableCell>
                      <TableCell>
                        <Badge variant={(job.status || 'Active') === 'Active' ? 'success' : 'neutral'} showDot size="xs">
                          {job.status || 'Active'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
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
                        <Button
                          variant="ghost"
                          size="xs"
                          className="text-rose-600 hover:bg-rose-50"
                          onClick={() => handleDeleteJob(job._id, job.title)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Job Details Modal */}
      {selectedJob && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`Job Details — ${selectedJob.title}`}
          description={`Published by ${selectedJob.company}`}
          size="md"
        >
          <div className="space-y-4 py-2 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">{selectedJob.title}</h4>
                <Badge variant={(selectedJob.status || 'Active') === 'Active' ? 'success' : 'neutral'} showDot size="xs">
                  {selectedJob.status || 'Active'}
                </Badge>
              </div>
              <p className="font-bold text-indigo-600">{selectedJob.company} • {selectedJob.location || 'Remote'}</p>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl space-y-1">
              <p className="font-bold text-indigo-950 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-600" /> HR Owner Details
              </p>
              <p className="text-indigo-900 font-bold">{selectedJob.postedBy?.name || 'Recruiter'}</p>
              <p className="text-indigo-800">{selectedJob.postedBy?.email || 'N/A'}</p>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-slate-800">Job Description Snippet:</p>
              <p className="text-slate-600 leading-relaxed line-clamp-4">{selectedJob.description}</p>
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

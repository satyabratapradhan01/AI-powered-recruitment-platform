import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJobsApi, deleteJobApi, updateJobApi } from '../../services/api';
import Card, { CardContent, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import Tabs from '../../components/ui/Tabs';
import Input from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { SkeletonCard } from '../../components/ui/SkeletonLoader';
import { useToast } from '../../context/ToastContext';
import { Plus, Search, MapPin, DollarSign, Edit3, Trash2 } from 'lucide-react';

const HRJobs = () => {
  const toast = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobToDelete, setSelectedJobToDelete] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchHRJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getJobsApi();
      setJobs(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching HR jobs:', err);
      setError(err.response?.data?.message || 'Failed to load job postings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHRJobs();
  }, []);

  const handleDeleteJob = async () => {
    if (!selectedJobToDelete) return;
    try {
      await deleteJobApi(selectedJobToDelete._id);
      setJobs((prev) => prev.filter((j) => j._id !== selectedJobToDelete._id));
      toast.success(`Job "${selectedJobToDelete.title}" deleted successfully.`);
      setDeleteModalOpen(false);
      setSelectedJobToDelete(null);
    } catch (err) {
      console.error('Delete job error:', err);
      toast.error(err.response?.data?.message || 'Failed to delete job posting');
    }
  };

  const filteredJobs = jobs.filter((j) => {
    const statusMatches = activeTab === 'All' || j.status === activeTab;
    const query = searchQuery.toLowerCase();
    const queryMatches =
      j.title.toLowerCase().includes(query) ||
      (j.department && j.department.toLowerCase().includes(query)) ||
      (j.location && j.location.toLowerCase().includes(query));
    return statusMatches && queryMatches;
  });

  const tabs = [
    { id: 'All', label: 'All Posted Jobs', count: jobs.length },
    { id: 'Active', label: 'Active Listings', count: jobs.filter((j) => j.status === 'Active' || !j.status).length },
    { id: 'Closed', label: 'Closed Jobs', count: jobs.filter((j) => j.status === 'Closed').length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            My Posted Job Listings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage company openings, create position requirements, or archive closed listings.
          </p>
        </div>

        <Link to="/hr/jobs/new">
          <Button variant="primary" size="md" leftIcon={Plus} className="bg-purple-600 hover:bg-purple-500 text-white shadow-md">
            Create New Job
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={(t) => setActiveTab(t)} variant="pills" />
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <Input
          placeholder="Search posted jobs by title, department, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={Search}
        />
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : error ? (
        <ErrorState title="Error Loading Jobs" message={error} onRetry={fetchHRJobs} />
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          title="No posted jobs found"
          description="Create your first job listing to start receiving candidate applications."
          actionLabel="Post New Job Opening"
          actionLink="/hr/jobs/new"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const jobId = job._id || job.id;
            const requiredSkills = job.requiredSkills || [];

            return (
              <Card key={jobId} variant="default" className="flex flex-col justify-between h-full hover:shadow-md transition">
                <CardContent className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{job.title}</h3>
                      <p className="text-xs font-semibold text-purple-600">{job.department || 'Engineering'}</p>
                    </div>
                    <Badge variant={job.status === 'Closed' ? 'neutral' : 'success'} showDot size="xs">
                      {job.status || 'Active'}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.location || 'Remote'} ({job.workMode || 'Full-time'})</span>
                    </div>
                    {job.salaryMin ? (
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-700">
                          ${job.salaryMin.toLocaleString()} - ${job.salaryMax?.toLocaleString()}
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {requiredSkills.slice(0, 4).map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="gap-2">
                  <Link to={`/hr/jobs/${jobId}/edit`} className="w-full">
                    <Button variant="outline" size="xs" fullWidth leftIcon={Edit3}>
                      Edit Job
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="text-rose-600 hover:bg-rose-50"
                    onClick={() => {
                      setSelectedJobToDelete(job);
                      setDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {selectedJobToDelete && (
        <ConfirmationDialog
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteJob}
          title="Delete Job Posting"
          description={`Are you sure you want to permanently delete "${selectedJobToDelete.title}"?`}
          confirmLabel="Delete Job"
          variant="danger"
        />
      )}
    </div>
  );
};

export default HRJobs;

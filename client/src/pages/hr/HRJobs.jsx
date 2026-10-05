import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockPostedJobs } from '../../data/hrMockData';
import Card, { CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import Tabs from '../../components/ui/Tabs';
import Input from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';
import { Plus, Search, MapPin, DollarSign, Users, Edit3, XCircle, CheckCircle2, ArrowRight } from 'lucide-react';

const HRJobs = () => {
  const toast = useToast();
  const [jobs, setJobs] = useState(mockPostedJobs);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobToClose, setSelectedJobToClose] = useState(null);
  const [closeModalOpen, setCloseModalOpen] = useState(false);

  const filteredJobs = jobs.filter((j) => {
    const matchesStatus = activeTab === 'All' || j.status === activeTab;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      j.title.toLowerCase().includes(query) ||
      j.department.toLowerCase().includes(query) ||
      j.location.toLowerCase().includes(query);
    return matchesStatus && matchesQuery;
  });

  const handleToggleJobStatus = () => {
    if (!selectedJobToClose) return;
    const newStatus = selectedJobToClose.status === 'Active' ? 'Closed' : 'Active';

    setJobs((prev) =>
      prev.map((j) => (j.id === selectedJobToClose.id ? { ...j, status: newStatus } : j))
    );

    toast.success(
      `Job "${selectedJobToClose.title}" is now ${newStatus.toLowerCase()}.`
    );
    setCloseModalOpen(false);
    setSelectedJobToClose(null);
  };

  const tabs = [
    { id: 'All', label: 'All Posted Jobs', count: jobs.length },
    { id: 'Active', label: 'Active Listings', count: jobs.filter((j) => j.status === 'Active').length },
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
            Manage company openings, create new position requirements, or close filled jobs.
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <Card key={job.id} variant="default" className="flex flex-col justify-between h-full hover:shadow-md transition">
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{job.title}</h3>
                  <p className="text-xs font-semibold text-purple-600">{job.department}</p>
                </div>
                <Badge variant={job.status === 'Active' ? 'success' : 'neutral'} showDot size="xs">
                  {job.status}
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{job.location} ({job.workMode})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-700">{job.salary}</span>
                </div>
                <div className="flex items-center gap-1.5 text-indigo-600 font-bold">
                  <Users className="w-3.5 h-3.5" />
                  <span>{job.applicantCount} Candidates Applied</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {job.requiredSkills.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                    {s}
                  </span>
                ))}
              </div>
            </CardContent>

            <CardFooter className="gap-2">
              <Link to={`/hr/jobs/${job.id}/edit`} className="w-full">
                <Button variant="outline" size="xs" fullWidth leftIcon={Edit3}>
                  Edit Job
                </Button>
              </Link>
              <Button
                variant={job.status === 'Active' ? 'ghost' : 'success'}
                size="xs"
                className={job.status === 'Active' ? 'text-rose-600 hover:bg-rose-50' : ''}
                onClick={() => {
                  setSelectedJobToClose(job);
                  setCloseModalOpen(true);
                }}
              >
                {job.status === 'Active' ? 'Close Job' : 'Reopen Job'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Confirmation Modal */}
      {selectedJobToClose && (
        <ConfirmationDialog
          isOpen={closeModalOpen}
          onClose={() => setCloseModalOpen(false)}
          onConfirm={handleToggleJobStatus}
          title={selectedJobToClose.status === 'Active' ? 'Close Job Posting' : 'Reopen Job Posting'}
          description={`Are you sure you want to ${
            selectedJobToClose.status === 'Active' ? 'close' : 'reopen'
          } "${selectedJobToClose.title}"?`}
          confirmLabel={selectedJobToClose.status === 'Active' ? 'Close Job' : 'Reopen Job'}
          variant={selectedJobToClose.status === 'Active' ? 'danger' : 'primary'}
        />
      )}
    </div>
  );
};

export default HRJobs;

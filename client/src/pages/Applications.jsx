import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApplicationsApi, deleteApplicationApi } from '../services/api';
import ApplicationCard from '../components/ApplicationCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { SkeletonCard } from '../components/ui/SkeletonLoader';
import { useToast } from '../context/ToastContext';
import { Search, Plus, LayoutGrid, List } from 'lucide-react';

const Applications = () => {
  const toast = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [deletingIds, setDeletingIds] = useState(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getApplicationsApi();
      setApplications(response.data.data);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      setError(err.response?.data?.message || 'Failed to load job applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    setDeletingIds((prev) => new Set(prev).add(id));
    try {
      await deleteApplicationApi(id);
      setApplications((prev) => prev.filter((app) => app._id !== id));
      toast.success('Application deleted successfully');
    } catch (err) {
      console.error('Delete application error:', err);
      toast.error(
        err.response?.data?.message || 'Failed to delete application. Please try again.'
      );
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  // Filter logic
  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      app.company.toLowerCase().includes(query) ||
      app.jobTitle.toLowerCase().includes(query) ||
      (app.location && app.location.toLowerCase().includes(query));

    return matchesStatus && matchesSearch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const filterTabs = [
    { id: 'All', label: 'All Applications', count: applications.length },
    {
      id: 'Applied',
      label: 'Applied',
      count: applications.filter((a) => a.status === 'Applied').length,
    },
    {
      id: 'Interview',
      label: 'Interview',
      count: applications.filter((a) => a.status === 'Interview').length,
    },
    {
      id: 'Offer',
      label: 'Offer',
      count: applications.filter((a) => a.status === 'Offer').length,
    },
    {
      id: 'Rejected',
      label: 'Rejected',
      count: applications.filter((a) => a.status === 'Rejected').length,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Job Applications
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your recruitment pipeline and track application statuses.
          </p>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
        <Tabs
          tabs={filterTabs}
          activeTab={statusFilter}
          onChange={(tabId) => {
            setStatusFilter(tabId);
            setCurrentPage(1);
          }}
          variant="pills"
        />
      </div>

      {/* Search and Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search company, position, or location..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            leftIcon={Search}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'grid'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'list'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState
          title="Failed to Load Applications"
          message={error}
          onRetry={fetchApplications}
        />
      ) : filteredApplications.length === 0 ? (
        <EmptyState
          title="No job applications found"
          description={
            applications.length === 0
              ? "You haven't submitted any job applications yet."
              : 'No applications match your current search or status filter.'
          }
          actionLabel={applications.length === 0 ? 'Browse Open Positions' : undefined}
          actionLink={applications.length === 0 ? '/jobs' : undefined}
        />
      ) : (
        <div className="space-y-6">
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
                : 'space-y-4'
            }
          >
            {paginatedApplications.map((application) => (
              <ApplicationCard
                key={application._id}
                application={application}
                onDelete={handleDelete}
                isDeleting={deletingIds.has(application._id)}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            totalItems={filteredApplications.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
};

export default Applications;

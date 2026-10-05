import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApplicationsApi, deleteApplicationApi } from '../services/api';
import ApplicationCard from '../components/ApplicationCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deletingIds, setDeletingIds] = useState(new Set());

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      setActionError(null);
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
    // 1. Show confirmation dialog
    const confirmed = window.confirm(
      'Are you sure you want to delete this job application? This action cannot be undone.'
    );
    if (!confirmed) return;

    setActionError(null);

    // 2 & 3. Track deleting state for loading UI
    setDeletingIds((prev) => new Set(prev).add(id));

    try {
      // 2. Call DELETE endpoint
      await deleteApplicationApi(id);

      // 4. Update UI state locally without reloading full browser page
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (err) {
      console.error('Delete application error:', err);
      // 5. Display error message if deletion fails
      setActionError(
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

  // Live filtering
  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      app.company.toLowerCase().includes(query) ||
      app.jobTitle.toLowerCase().includes(query) ||
      (app.location && app.location.toLowerCase().includes(query));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage all your submitted job applications
          </p>
        </div>
        <Link
          to="/applications/new"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition"
        >
          + Add Application
        </Link>
      </div>

      {/* Action Error Alert */}
      {actionError && (
        <div className="flex items-center justify-between">
          <ErrorMessage message={actionError} />
          <button
            onClick={() => setActionError(null)}
            className="text-xs font-semibold text-gray-500 hover:text-gray-700 ml-2 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company or job title..."
            className="w-full px-3.5 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="w-full sm:w-auto flex items-center space-x-2">
          <label className="text-xs font-semibold text-gray-600 whitespace-nowrap">
            Filter Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <Loading message="Loading job applications..." />
      ) : error ? (
        <div className="p-4 bg-white border border-gray-200 rounded-lg text-center space-y-3">
          <ErrorMessage message={error} />
          <button
            onClick={fetchApplications}
            className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
          >
            Retry
          </button>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center space-y-4">
          <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-xl font-bold">
            📋
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">No applications found</h3>
            <p className="text-sm text-gray-500 mt-1">
              {applications.length === 0
                ? "You haven't added any job applications yet."
                : 'No applications match your current search or filter criteria.'}
            </p>
          </div>
          {applications.length === 0 && (
            <Link
              to="/applications/new"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition"
            >
              Add your first application
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredApplications.map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
              onDelete={handleDelete}
              isDeleting={deletingIds.has(application._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;

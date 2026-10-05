import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApplicationsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Dashboard = () => {
  const { user } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getApplicationsApi();
      setApplications(response.data.data);
    } catch (err) {
      console.error('Error fetching dashboard applications:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Calculated Statistics
  const totalCount = applications.length;
  const appliedCount = applications.filter((a) => a.status === 'Applied').length;
  const interviewCount = applications.filter((a) => a.status === 'Interview').length;
  const offerCount = applications.filter((a) => a.status === 'Offer').length;
  const rejectedCount = applications.filter((a) => a.status === 'Rejected').length;

  // 5 Most Recent Applications
  const recentApplications = [...applications]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.appliedDate) - new Date(a.createdAt || a.appliedDate)
    )
    .slice(0, 5);

  const statCards = [
    { label: 'Total Applications', count: totalCount, color: 'border-indigo-500 text-indigo-600 bg-indigo-50/50' },
    { label: 'Applied', count: appliedCount, color: 'border-blue-500 text-blue-600 bg-blue-50/50' },
    { label: 'Interview', count: interviewCount, color: 'border-yellow-500 text-yellow-600 bg-yellow-50/50' },
    { label: 'Offer', count: offerCount, color: 'border-emerald-500 text-emerald-600 bg-emerald-50/50' },
    { label: 'Rejected', count: rejectedCount, color: 'border-rose-500 text-rose-600 bg-rose-50/50' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, <span className="font-semibold text-gray-700">{user?.name}</span>! Here is an overview of your job search.
          </p>
        </div>
        <Link
          to="/applications/new"
          className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition"
        >
          + Add Application
        </Link>
      </div>

      {loading ? (
        <Loading message="Loading dashboard statistics..." />
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
      ) : (
        <>
          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className={`p-5 rounded-lg border-l-4 border bg-white shadow-sm flex flex-col justify-between ${stat.color}`}
              >
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-3xl font-extrabold text-gray-900 mt-2">{stat.count}</p>
              </div>
            ))}
          </div>

          {/* 5 Most Recent Applications */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">Recent Applications</h2>
                <p className="text-xs text-gray-500">Your 5 latest submitted job applications</p>
              </div>
              {applications.length > 5 && (
                <Link
                  to="/applications"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  View All ({applications.length}) →
                </Link>
              )}
            </div>

            {recentApplications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                No job applications found yet.{' '}
                <Link to="/applications/new" className="text-indigo-600 font-medium hover:underline">
                  Create your first application
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3">Company</th>
                      <th className="px-6 py-3">Job Title</th>
                      <th className="px-6 py-3">Applied Date</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentApplications.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50/80 transition">
                        <td className="px-6 py-4 font-semibold text-gray-900">{app.company}</td>
                        <td className="px-6 py-4 text-gray-700">{app.jobTitle}</td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {app.appliedDate
                            ? new Date(app.appliedDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/applications/${app._id}/edit`}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

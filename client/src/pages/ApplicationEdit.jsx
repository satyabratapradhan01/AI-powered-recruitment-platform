import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getApplicationByIdApi, updateApplicationApi } from '../services/api';
import ApplicationForm from '../components/ApplicationForm';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const ApplicationEdit = () => {
  const { id } = useParams();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getApplicationByIdApi(id);
        setInitialData(response.data.data);
      } catch (err) {
        console.error('Failed to load application for edit:', err);
        setError(err.response?.data?.message || 'Job application not found');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchApplication();
    }
  }, [id]);

  const handleUpdate = async (formData) => {
    await updateApplicationApi(id, formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <Link
          to="/applications"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          ← Back to Applications
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Job Application</h1>
        <p className="text-sm text-gray-500 mt-1">
          Update application status or job details
        </p>
      </div>

      {loading ? (
        <Loading message="Loading application details..." />
      ) : error ? (
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <ErrorMessage message={error} />
        </div>
      ) : (
        <ApplicationForm
          initialValues={initialData}
          onSubmit={handleUpdate}
          submitButtonText="Update Application"
          isEditing={true}
        />
      )}
    </div>
  );
};

export default ApplicationEdit;

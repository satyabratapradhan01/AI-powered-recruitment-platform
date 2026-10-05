import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getApplicationByIdApi, updateApplicationApi } from '../services/api';
import ApplicationForm from '../components/ApplicationForm';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import Button from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { ArrowLeft } from 'lucide-react';

const ApplicationEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      setIsSubmitting(true);
      await updateApplicationApi(id, formData);
      toast.success('Application updated successfully!');
      navigate('/applications');
    } catch (err) {
      console.error('Failed to update application:', err);
      toast.error(
        err.response?.data?.message || 'Failed to update application. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <Link to="/applications">
          <Button variant="ghost" size="xs" leftIcon={ArrowLeft} className="mb-2">
            Back to Applications
          </Button>
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Edit Job Application
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Update application status, company info, or job parameters
        </p>
      </div>

      {loading ? (
        <LoadingState message="Loading application record..." />
      ) : error ? (
        <ErrorState
          title="Application Not Found"
          message={error}
          onRetry={fetchApplication}
        />
      ) : (
        <ApplicationForm
          initialValues={initialData}
          onSubmit={handleUpdate}
          isSubmitting={isSubmitting}
          submitButtonText="Update Application"
          formTitle="Edit Application Information"
        />
      )}
    </div>
  );
};

export default ApplicationEdit;

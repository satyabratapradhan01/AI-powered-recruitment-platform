import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createApplicationApi } from '../services/api';
import ApplicationForm from '../components/ApplicationForm';
import { useToast } from '../context/ToastContext';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const ApplicationNew = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (formData) => {
    try {
      setIsSubmitting(true);
      await createApplicationApi(formData);
      toast.success('Job application created successfully!');
      navigate('/applications');
    } catch (err) {
      console.error('Failed to create application:', err);
      toast.error(
        err.response?.data?.message || 'Failed to create application. Please check input values.'
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
          Add New Job Application
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Record details for a new job opportunity you applied for
        </p>
      </div>

      <ApplicationForm
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
        submitButtonText="Create Application"
        formTitle="New Application Information"
      />
    </div>
  );
};

export default ApplicationNew;

import React from 'react';
import { Link } from 'react-router-dom';
import { createApplicationApi } from '../services/api';
import ApplicationForm from '../components/ApplicationForm';

const ApplicationNew = () => {
  const handleCreate = async (formData) => {
    await createApplicationApi(formData);
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
        <h1 className="text-2xl font-bold text-gray-900">Add New Job Application</h1>
        <p className="text-sm text-gray-500 mt-1">
          Record details for a new job opportunity you applied for
        </p>
      </div>

      <ApplicationForm
        onSubmit={handleCreate}
        submitButtonText="Create Application"
      />
    </div>
  );
};

export default ApplicationNew;

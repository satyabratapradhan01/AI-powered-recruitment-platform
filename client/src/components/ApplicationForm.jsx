import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';

const ApplicationForm = ({
  initialValues = {},
  onSubmit,
  submitButtonText = 'Save Application',
  isEditing = false,
}) => {
  const navigate = useNavigate();

  // Helper to format ISO date or timestamp to YYYY-MM-DD format for date input
  const formatDateForInput = (dateVal) => {
    if (!dateVal) return new Date().toISOString().split('T')[0];
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
    return d.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    company: initialValues.company || '',
    jobTitle: initialValues.jobTitle || '',
    location: initialValues.location || '',
    jobUrl: initialValues.jobUrl || '',
    status: initialValues.status || 'Applied',
    appliedDate: formatDateForInput(initialValues.appliedDate),
  });

  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync form state if initialValues load asynchronously (e.g. edit mode)
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFormData({
        company: initialValues.company || '',
        jobTitle: initialValues.jobTitle || '',
        location: initialValues.location || '',
        jobUrl: initialValues.jobUrl || '',
        status: initialValues.status || 'Applied',
        appliedDate: formatDateForInput(initialValues.appliedDate),
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (validationError) setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');

    // Validate required fields
    if (!formData.company.trim() || !formData.jobTitle.trim()) {
      setValidationError('Company name and Job title are required fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        company: formData.company.trim(),
        jobTitle: formData.jobTitle.trim(),
        location: formData.location.trim(),
        jobUrl: formData.jobUrl.trim(),
        status: formData.status,
        appliedDate: formData.appliedDate,
      });

      setSuccessMessage(
        isEditing
          ? 'Job application updated successfully!'
          : 'Job application created successfully!'
      );

      // Redirect to applications list after brief delay to show feedback
      setTimeout(() => {
        navigate('/applications');
      }, 700);
    } catch (err) {
      console.error('Form submission error:', err);
      setValidationError(
        err.response?.data?.message || err.message || 'Failed to submit application'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-5">
      {validationError && <ErrorMessage message={validationError} />}

      {successMessage && (
        <div className="p-4 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
          <p className="font-medium">{successMessage}</p>
        </div>
      )}

      {/* Grid Layout for Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="company"
            required
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g. Google, Microsoft"
            className="mt-1 w-full px-3.5 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="jobTitle"
            required
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="e.g. Software Engineer, Product Manager"
            className="mt-1 w-full px-3.5 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Remote, Bangalore, New York"
            className="mt-1 w-full px-3.5 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Application Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 w-full px-3.5 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Job URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Job Posting URL</label>
          <input
            type="url"
            name="jobUrl"
            value={formData.jobUrl}
            onChange={handleChange}
            placeholder="https://company.com/careers/job-123"
            className="mt-1 w-full px-3.5 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Applied Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Applied Date</label>
          <input
            type="date"
            name="appliedDate"
            value={formData.appliedDate}
            onChange={handleChange}
            className="mt-1 w-full px-3.5 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="pt-4 border-t border-gray-100 flex items-center justify-end space-x-3">
        <button
          type="button"
          onClick={() => navigate('/applications')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition disabled:opacity-60 flex items-center space-x-2"
        >
          {isSubmitting && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          <span>{isSubmitting ? 'Saving...' : submitButtonText}</span>
        </button>
      </div>
    </form>
  );
};

export default ApplicationForm;

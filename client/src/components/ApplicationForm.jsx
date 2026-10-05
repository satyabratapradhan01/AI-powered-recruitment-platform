import React, { useState, useEffect } from 'react';
import { Building2, Briefcase, MapPin, Link as LinkIcon, Calendar, CheckCircle2 } from 'lucide-react';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from './ui/Card';

const ApplicationForm = ({
  initialValues = {
    company: '',
    jobTitle: '',
    location: '',
    jobUrl: '',
    status: 'Applied',
    appliedDate: new Date().toISOString().split('T')[0],
  },
  onSubmit,
  isSubmitting = false,
  submitButtonText = 'Save Application',
  formTitle = 'Application Details',
}) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setFormData({
        company: initialValues.company || '',
        jobTitle: initialValues.jobTitle || '',
        location: initialValues.location || '',
        jobUrl: initialValues.jobUrl || '',
        status: initialValues.status || 'Applied',
        appliedDate: initialValues.appliedDate
          ? new Date(initialValues.appliedDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      });
    }
  }, [initialValues]);

  const validate = () => {
    const newErrors = {};
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }
    if (formData.jobUrl && !/^https?:\/\/.+/.test(formData.jobUrl)) {
      newErrors.jobUrl = 'URL must start with http:// or https://';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const statusOptions = [
    { value: 'Applied', label: 'Applied' },
    { value: 'Interview', label: 'Interview Scheduled' },
    { value: 'Offer', label: 'Offer Received' },
    { value: 'Rejected', label: 'Rejected' },
  ];

  return (
    <Card variant="default" className="max-w-2xl mx-auto shadow-md">
      <CardHeader>
        <CardTitle>{formTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Company Name *"
              name="company"
              placeholder="e.g. Google, Stripe, Microsoft"
              value={formData.company}
              onChange={handleChange}
              error={errors.company}
              leftIcon={Building2}
            />

            <Input
              label="Job Title *"
              name="jobTitle"
              placeholder="e.g. Senior Frontend Engineer"
              value={formData.jobTitle}
              onChange={handleChange}
              error={errors.jobTitle}
              leftIcon={Briefcase}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Location"
              name="location"
              placeholder="e.g. Remote, San Francisco, CA"
              value={formData.location}
              onChange={handleChange}
              leftIcon={MapPin}
            />

            <Select
              label="Application Status *"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Applied Date"
              name="appliedDate"
              type="date"
              value={formData.appliedDate}
              onChange={handleChange}
              leftIcon={Calendar}
            />

            <Input
              label="Job URL"
              name="jobUrl"
              type="url"
              placeholder="https://careers.company.com/job/123"
              value={formData.jobUrl}
              onChange={handleChange}
              error={errors.jobUrl}
              leftIcon={LinkIcon}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              leftIcon={CheckCircle2}
            >
              {submitButtonText}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ApplicationForm;

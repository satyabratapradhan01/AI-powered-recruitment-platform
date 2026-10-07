import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createJobApi, getJobByIdApi, updateJobApi } from '../../services/api';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Briefcase, Building2, MapPin, DollarSign, CheckCircle2, Clock } from 'lucide-react';

const HRJobCreate = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const isHRPending = user?.role === 'hr' && user?.accountStatus === 'pending';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingJob, setLoadingJob] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    company: 'TechCorp AI Solutions',
    department: 'Engineering',
    location: 'Remote - US',
    workMode: 'Remote',
    employmentType: 'Full-time',
    status: 'Active',
    salaryMin: 120000,
    salaryMax: 160000,
    experienceRequired: '3-5 years',
    requiredSkills: '',
    preferredSkills: '',
    description: '',
  });

  const fetchJobDetails = async () => {
    try {
      setLoadingJob(true);
      const res = await getJobByIdApi(id);
      const job = res.data?.data;
      if (job) {
        setFormData({
          title: job.title || '',
          company: job.company || 'TechCorp AI Solutions',
          department: job.department || 'Engineering',
          location: job.location || '',
          workMode: job.workMode || 'Remote',
          employmentType: job.employmentType || 'Full-time',
          status: job.status || 'Active',
          salaryMin: job.salaryMin || 100000,
          salaryMax: job.salaryMax || 150000,
          experienceRequired: job.experienceRequired || '3-5 years',
          requiredSkills: Array.isArray(job.requiredSkills) ? job.requiredSkills.join(', ') : job.requiredSkills || '',
          preferredSkills: Array.isArray(job.preferredSkills) ? job.preferredSkills.join(', ') : job.preferredSkills || '',
          description: job.description || '',
        });
      }
    } catch (err) {
      console.error('Error fetching job for edit:', err);
      toast.error('Failed to load job details.');
    } finally {
      setLoadingJob(false);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      fetchJobDetails();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.location.trim()) {
      toast.error('Please fill in required job title and location');
      return;
    }

    const payload = {
      title: formData.title,
      company: formData.company,
      department: formData.department,
      location: formData.location,
      workMode: formData.workMode,
      employmentType: formData.employmentType,
      status: formData.status,
      salaryMin: Number(formData.salaryMin) || 0,
      salaryMax: Number(formData.salaryMax) || 0,
      experienceRequired: formData.experienceRequired,
      requiredSkills: typeof formData.requiredSkills === 'string' ? formData.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean) : formData.requiredSkills,
      preferredSkills: typeof formData.preferredSkills === 'string' ? formData.preferredSkills.split(',').map((s) => s.trim()).filter(Boolean) : formData.preferredSkills,
      description: formData.description,
    };

    try {
      setIsSubmitting(true);
      if (isEditMode) {
        const res = await updateJobApi(id, payload);
        toast.success(res.data?.message || `Job posting "${formData.title}" updated successfully!`);
      } else {
        const res = await createJobApi(payload);
        toast.success(res.data?.message || `Job posting "${formData.title}" published successfully!`);
      }
      navigate('/hr/jobs');
    } catch (err) {
      console.error('Job submission error:', err);
      toast.error(err.response?.data?.message || 'Failed to save job posting');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <Link to="/hr/jobs">
          <Button variant="ghost" size="xs" leftIcon={ArrowLeft} className="mb-2">
            Back to My Posted Jobs
          </Button>
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {isEditMode ? 'Edit Job Posting' : 'Create New Job Opening'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {isEditMode ? 'Update job requirements and technical criteria.' : 'Publish a new position requirement to match candidates with AI ATS scoring.'}
        </p>
      </div>

      {isHRPending && (
        <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl flex items-center gap-3 text-amber-950 text-xs font-semibold shadow-xs">
          <Clock className="w-6 h-6 text-amber-600 shrink-0" />
          <div>
            <p className="font-extrabold text-sm text-amber-950">Account Pending Administrator Approval</p>
            <p className="text-amber-800">
              Your HR Recruiter account is currently awaiting Admin approval. You will be able to publish jobs as soon as an Administrator approves your account.
            </p>
          </div>
        </div>
      )}

      <Card variant="default" className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-600" /> Position Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Job Title *"
                name="title"
                placeholder="e.g. Senior AI Engineer"
                value={formData.title}
                onChange={handleChange}
                leftIcon={Briefcase}
                required
              />
              <Input
                label="Company Name *"
                name="company"
                placeholder="e.g. TechCorp AI Solutions"
                value={formData.company}
                onChange={handleChange}
                leftIcon={Building2}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Input
                label="Location *"
                name="location"
                placeholder="e.g. San Francisco, CA"
                value={formData.location}
                onChange={handleChange}
                leftIcon={MapPin}
                required
              />
              <Select
                label="Work Mode *"
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
                options={[
                  { value: 'Remote', label: 'Remote' },
                  { value: 'Hybrid', label: 'Hybrid' },
                  { value: 'Onsite', label: 'Onsite' },
                ]}
              />
              <Select
                label="Employment Type *"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                options={[
                  { value: 'Full-time', label: 'Full-time' },
                  { value: 'Part-time', label: 'Part-time' },
                  { value: 'Contract', label: 'Contract' },
                ]}
              />
              <Select
                label="Job Status *"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: 'Active', label: 'Active Listing' },
                  { value: 'Closed', label: 'Closed / Filled' },
                  { value: 'Draft', label: 'Draft' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Salary Min ($)"
                name="salaryMin"
                type="number"
                value={formData.salaryMin}
                onChange={handleChange}
                leftIcon={DollarSign}
              />
              <Input
                label="Salary Max ($)"
                name="salaryMax"
                type="number"
                value={formData.salaryMax}
                onChange={handleChange}
                leftIcon={DollarSign}
              />
              <Input
                label="Experience Level"
                name="experienceRequired"
                placeholder="e.g. 3-5 years"
                value={formData.experienceRequired}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Required Skills (Comma separated) *"
                name="requiredSkills"
                placeholder="React, Node.js, MongoDB, Express"
                value={formData.requiredSkills}
                onChange={handleChange}
                helperText="AI Candidate Matching evaluates candidate resumes against these skills."
                required
              />
              <Input
                label="Preferred Skills"
                name="preferredSkills"
                placeholder="Docker, Cloudflare, AWS, Python"
                value={formData.preferredSkills}
                onChange={handleChange}
              />
            </div>

            <Textarea
              label="Job Description *"
              name="description"
              rows={5}
              placeholder="Detail the overall team objectives, engineering practices, and position responsibilities..."
              value={formData.description}
              onChange={handleChange}
              required
            />

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                disabled={isHRPending}
                leftIcon={CheckCircle2}
                className={`text-white ${isHRPending ? 'bg-slate-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500'}`}
              >
                {isEditMode ? 'Save Job Changes' : 'Publish Job Posting'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default HRJobCreate;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, Briefcase, Building2, MapPin, DollarSign, Calendar, CheckCircle2, Sparkles } from 'lucide-react';

const HRJobCreate = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    location: '',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    salary: '',
    experience: '3-5 years',
    requiredSkills: '',
    preferredSkills: '',
    description: '',
    responsibilities: '',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.location.trim()) {
      toast.error('Please fill in required job title and location');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Job posting "${formData.title}" published successfully!`);
      navigate('/hr/jobs');
    }, 800);
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
          Create New Job Opening
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Publish a new position requirement to match candidates with AI ATS scoring.
        </p>
      </div>

      <Card variant="default" className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-600" /> Position Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Job Title *"
                name="title"
                placeholder="e.g. Senior Full-Stack Developer"
                value={formData.title}
                onChange={handleChange}
                leftIcon={Briefcase}
                required
              />
              <Input
                label="Department"
                name="department"
                placeholder="e.g. Engineering, Product Design"
                value={formData.department}
                onChange={handleChange}
                leftIcon={Building2}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  { value: 'Hybrid', label: 'Hybrid' },
                  { value: 'Remote', label: 'Remote' },
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Salary Range"
                name="salary"
                placeholder="e.g. $150,000 - $180,000 / yr"
                value={formData.salary}
                onChange={handleChange}
                leftIcon={DollarSign}
              />
              <Input
                label="Experience Level"
                name="experience"
                placeholder="e.g. 3-5 years"
                value={formData.experience}
                onChange={handleChange}
              />
              <Input
                label="Application Deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                leftIcon={Calendar}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Required Skills (Comma separated) *"
                name="requiredSkills"
                placeholder="React, Node.js, MongoDB, TypeScript"
                value={formData.requiredSkills}
                onChange={handleChange}
                helperText="AI ATS Engine matches candidates against these skills."
                required
              />
              <Input
                label="Preferred Skills"
                name="preferredSkills"
                placeholder="Tailwind CSS, Docker, AWS"
                value={formData.preferredSkills}
                onChange={handleChange}
              />
            </div>

            <Textarea
              label="Job Description *"
              name="description"
              rows={4}
              placeholder="Detail the overall team objectives, candidate profile, and technical vision..."
              value={formData.description}
              onChange={handleChange}
              required
            />

            <Textarea
              label="Key Responsibilities *"
              name="responsibilities"
              rows={3}
              placeholder="List daily tasks, engineering practices, and cross-functional duties..."
              value={formData.responsibilities}
              onChange={handleChange}
              required
            />

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                leftIcon={CheckCircle2}
                className="bg-purple-600 hover:bg-purple-500 text-white"
              >
                Publish Job Posting
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default HRJobCreate;

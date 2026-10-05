import React, { useState } from 'react';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { Building2, Globe, MapPin, Users, Mail, Save } from 'lucide-react';

const HRCompanyProfile = () => {
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    companyName: 'Stripe',
    industry: 'Financial Technology / Payments',
    website: 'https://stripe.com',
    location: 'San Francisco, CA',
    teamSize: '5,000+ Employees',
    recruiterEmail: 'sarah.jenkins@stripe.com',
    description:
      'Stripe is a financial infrastructure platform for businesses. Millions of companies—from the world’s largest enterprises to the most ambitious startups—use Stripe to accept payments, grow their revenue, and accelerate new business opportunities.',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Company profile updated successfully!');
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Employer Company Profile
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your organization brand profile displayed on published job postings and candidate invites.
        </p>
      </div>

      <Card variant="default" className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-600" /> Organization Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Name *"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              leftIcon={Building2}
            />
            <Input
              label="Industry / Domain"
              name="industry"
              value={form.industry}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Website"
              name="website"
              value={form.website}
              onChange={handleChange}
              leftIcon={Globe}
            />
            <Input
              label="Headquarters Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              leftIcon={MapPin}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Team Size"
              name="teamSize"
              value={form.teamSize}
              onChange={handleChange}
              leftIcon={Users}
            />
            <Input
              label="Recruiter Admin Email"
              name="recruiterEmail"
              value={form.recruiterEmail}
              onChange={handleChange}
              leftIcon={Mail}
            />
          </div>

          <Textarea
            label="About Company"
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
          />

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              variant="primary"
              size="md"
              isLoading={isSaving}
              leftIcon={Save}
              onClick={handleSave}
              className="bg-purple-600 hover:bg-purple-500 text-white"
            >
              Save Company Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HRCompanyProfile;

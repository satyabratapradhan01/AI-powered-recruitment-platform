import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfileApi, uploadResumeApi, deleteResumeApi, getMyResumeApi } from '../services/api';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import { useToast } from '../context/ToastContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Upload,
  Globe,
  Link2,
  Plus,
  X,
  Sparkles,
  GraduationCap,
  Briefcase,
  Save,
  Trash2,
  ExternalLink,
} from 'lucide-react';

const Profile = () => {
  const toast = useToast();
  const { user, refreshUser, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: [],
    portfolio: '',
    linkedin: '',
    github: '',
    education: [],
    experience: [],
  });

  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [resumeSignedUrl, setResumeSignedUrl] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        headline: user.profile?.headline || user.headline || '',
        email: user.email || '',
        phone: user.profile?.phone || user.phone || '',
        location: user.profile?.location || user.location || '',
        bio: user.profile?.bio || user.bio || '',
        skills: user.skills || [],
        portfolio: user.profile?.website || user.profile?.portfolio || user.portfolio || '',
        linkedin: user.profile?.linkedin || user.linkedin || '',
        github: user.profile?.github || user.github || '',
        education: user.education || [],
        experience: user.experience || [],
      });
      if (user.resume && (user.resume.fileKey || user.resume.fileName)) {
        setResumeData(user.resume);
        if (user.resume.fileUrl) {
          setResumeSignedUrl(user.resume.fileUrl);
        }
      }
    }
    fetchMyResume();
  }, [user]);

  const fetchMyResume = async () => {
    try {
      const res = await getMyResumeApi();
      const resData = res.data?.data;
      if (resData) {
        const resumeObj = resData.resume || resData;
        const signedUrl = resData.signedUrl || resData.fileUrl;
        setResumeData(resumeObj);
        setResumeSignedUrl(signedUrl);
      }
    } catch (err) {
      // resume may not be uploaded yet
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (formData.skills.includes(newSkill.trim())) {
      toast.info('Skill already added to profile');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill.trim()],
    }));
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleResumeFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds maximum 5 MB limit.');
      return;
    }

    try {
      setUploadingResume(true);
      const data = new FormData();
      data.append('resume', file);

      const res = await uploadResumeApi(data);
      toast.success(res.data?.message || 'Resume uploaded successfully!');
      const resData = res.data?.data;
      if (resData) {
        const resumeObj = resData.resume || resData;
        const signedUrl = resData.signedUrl || resData.fileUrl;
        setResumeData(resumeObj);
        setResumeSignedUrl(signedUrl);
      }
      await refreshUser();
    } catch (err) {
      console.error('Resume upload error:', err);
      toast.error(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploadingResume(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteResume = async () => {
    if (!window.confirm('Are you sure you want to delete your stored resume?')) return;
    try {
      await deleteResumeApi();
      setResumeData(null);
      setResumeSignedUrl(null);
      toast.success('Resume deleted successfully.');
      await refreshUser();
    } catch (err) {
      console.error('Delete resume error:', err);
      toast.error(err.response?.data?.message || 'Failed to delete resume');
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const payload = {
        name: formData.name,
        headline: formData.headline,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        skills: formData.skills,
        portfolio: formData.portfolio,
        website: formData.portfolio,
        linkedin: formData.linkedin,
        github: formData.github,
        education: formData.education,
        experience: formData.experience,
        profile: {
          headline: formData.headline,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          website: formData.portfolio,
          portfolio: formData.portfolio,
          linkedin: formData.linkedin,
          github: formData.github,
        },
      };

      const res = await updateProfileApi(payload);
      toast.success(res.data?.message || 'Profile updated successfully!');
      if (res.data?.data) {
        updateUser(res.data.data);
      }
      await refreshUser();
    } catch (err) {
      console.error('Error saving profile:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Profile Header Card */}
      <Card variant="default" className="shadow-md">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar name={formData.name || 'Candidate'} size="xl" status="online" className="shadow-md" />
            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    {formData.name || 'Candidate Profile'}
                  </h1>
                  <p className="text-xs font-bold text-indigo-600 mt-0.5">
                    {formData.headline || 'Job Seeker'}
                  </p>
                </div>
                <Badge variant="purple" showDot size="sm">
                  {resumeData ? 'Resume Uploaded' : 'No Resume'}
                </Badge>
              </div>

              <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                {formData.bio || 'No bio provided. Edit your profile to add a summary.'}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {formData.email}
                </span>
                {formData.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {formData.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 1. Personal Information */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" /> Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              leftIcon={User}
            />
            <Input
              label="Professional Headline"
              name="headline"
              value={formData.headline}
              onChange={handleInputChange}
              leftIcon={Briefcase}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              name="email"
              value={formData.email}
              disabled
              leftIcon={Mail}
              helperText="Email address cannot be changed."
            />
            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              leftIcon={Phone}
            />
          </div>

          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            leftIcon={MapPin}
          />

          <Textarea
            label="Bio / Summary"
            name="bio"
            rows={3}
            value={formData.bio}
            onChange={handleInputChange}
          />
        </CardContent>
      </Card>

      {/* 2. Resume Storage Card */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" /> Resume & Cloud Storage (Cloudflare R2)
          </CardTitle>
          <CardDescription>
            Upload your resume (PDF/DOCX, max 5MB). Stored securely in Cloudflare R2 bucket.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                PDF
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {resumeData?.originalName || resumeData?.fileName || 'No resume uploaded yet'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {resumeData?.uploadedAt
                    ? `Uploaded ${new Date(resumeData.uploadedAt).toLocaleDateString()}`
                    : 'Select a PDF/DOCX file below'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleResumeFileUpload}
                className="hidden"
                disabled={uploadingResume}
              />
              <Button
                variant="outline"
                size="xs"
                isLoading={uploadingResume}
                leftIcon={Upload}
                onClick={() => fileInputRef.current?.click()}
              >
                {resumeData ? 'Replace Resume' : 'Upload Resume'}
              </Button>

              {resumeSignedUrl && (
                <a href={resumeSignedUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="xs" rightIcon={ExternalLink}>
                    View
                  </Button>
                </a>
              )}

              {resumeData && (
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-red-600 hover:bg-red-50"
                  onClick={handleDeleteResume}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {resumeData?.parsedText && (
            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-1">
              <p className="text-[11px] font-bold text-indigo-900">Extracted Resume Text Snippet:</p>
              <p className="text-[11px] text-slate-600 italic line-clamp-3">
                "{resumeData.parsedText}"
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Skills */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" /> Skills & Technical Stack
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add skill (e.g. React, Node.js, Docker)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <Button variant="primary" size="md" leftIcon={Plus} onClick={handleAddSkill}>
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-indigo-900 rounded-md p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 4. Portfolio, LinkedIn, GitHub */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600" /> Online Profiles & Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Portfolio Website"
            name="portfolio"
            value={formData.portfolio}
            onChange={handleInputChange}
            leftIcon={Globe}
          />
          <Input
            label="LinkedIn URL"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleInputChange}
            leftIcon={Link2}
          />
          <Input
            label="GitHub URL"
            name="github"
            value={formData.github}
            onChange={handleInputChange}
            leftIcon={Link2}
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <Button
          variant="primary"
          size="lg"
          isLoading={isSaving}
          leftIcon={Save}
          onClick={handleSaveProfile}
          className="px-8"
        >
          Save Profile Changes
        </Button>
      </div>
    </div>
  );
};

export default Profile;

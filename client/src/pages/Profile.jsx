import React, { useState } from 'react';
import { mockProfile } from '../data/seekerMockData';
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
} from 'lucide-react';

const Profile = () => {
  const toast = useToast();
  const [profile, setProfile] = useState(mockProfile);
  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (profile.skills.includes(newSkill.trim())) {
      toast.info('Skill already added');
      return;
    }
    setProfile((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill.trim()],
    }));
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Candidate profile updated successfully!');
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Profile Header Card */}
      <Card variant="default" className="shadow-md">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar name={profile.name} size="xl" status="online" className="shadow-md" />
            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    {profile.name}
                  </h1>
                  <p className="text-xs font-bold text-indigo-600 mt-0.5">{profile.headline}</p>
                </div>
                <Badge variant="purple" showDot size="sm">
                  {profile.atsScore}% ATS Resume Rating
                </Badge>
              </div>

              <p className="text-xs text-slate-500 max-w-xl leading-relaxed">{profile.bio}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {profile.email}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {profile.location}
                </span>
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
              value={profile.name}
              onChange={handleInputChange}
              leftIcon={User}
            />
            <Input
              label="Professional Headline"
              name="headline"
              value={profile.headline}
              onChange={handleInputChange}
              leftIcon={Briefcase}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              leftIcon={Mail}
            />
            <Input
              label="Phone Number"
              name="phone"
              value={profile.phone}
              onChange={handleInputChange}
              leftIcon={Phone}
            />
          </div>

          <Input
            label="Location"
            name="location"
            value={profile.location}
            onChange={handleInputChange}
            leftIcon={MapPin}
          />

          <Textarea
            label="Bio / Summary"
            name="bio"
            rows={3}
            value={profile.bio}
            onChange={handleInputChange}
          />
        </CardContent>
      </Card>

      {/* 2. Resume Storage Card */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" /> Resume & Cloud Storage (R2)
          </CardTitle>
          <CardDescription>
            Your active resume stored privately in Cloudflare R2 bucket.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                PDF
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">{profile.resumeFilename}</p>
                <p className="text-[11px] text-slate-400">Uploaded on {profile.resumeUploadedDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button variant="outline" size="xs" leftIcon={Upload}>
                Upload New Resume
              </Button>
              <Badge variant="purple" size="xs">
                {profile.atsScore}% ATS Score
              </Badge>
            </div>
          </div>
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
            {profile.skills.map((skill) => (
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

      {/* 4. Education */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" /> Education
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.education.map((edu) => (
            <div key={edu.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">{edu.degree}</h4>
                <span className="text-xs text-slate-400">{edu.year}</span>
              </div>
              <p className="text-xs font-semibold text-slate-600">{edu.institution}</p>
              <p className="text-[11px] text-emerald-600 font-bold">{edu.grade}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 5. Experience */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" /> Work Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.experience.map((exp) => (
            <div key={exp.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">{exp.title}</h4>
                <span className="text-xs text-slate-400">{exp.period}</span>
              </div>
              <p className="text-xs font-bold text-indigo-600">{exp.company}</p>
              <p className="text-xs text-slate-600 pt-1 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 6. Portfolio, LinkedIn, GitHub */}
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
            value={profile.portfolio}
            onChange={handleInputChange}
            leftIcon={Globe}
          />
          <Input
            label="LinkedIn URL"
            name="linkedin"
            value={profile.linkedin}
            onChange={handleInputChange}
            leftIcon={Link2}
          />
          <Input
            label="GitHub URL"
            name="github"
            value={profile.github}
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

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getApplicationsApi,
  updateApplicationApi,
  getCandidateMatchesApi,
  getJobsApi,
  getCandidateResumeApi,
} from '../../services/api';
import Card, { CardContent } from '../../components/ui/Card';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Avatar from '../../components/ui/Avatar';
import Textarea from '../../components/ui/Textarea';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { SkeletonTable } from '../../components/ui/SkeletonLoader';
import { useToast } from '../../context/ToastContext';
import {
  Search,
  Sparkles,
  FileText,
  Eye,
  Save,
  ExternalLink,
  Award,
  Mail,
  Phone,
  MapPin,
  Globe,
  Link2,
  GraduationCap,
  Briefcase,
} from 'lucide-react';

const HRApplicants = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobFilter, setSelectedJobFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortByMatch, setSortByMatch] = useState(false);

  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [recruiterNote, setRecruiterNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [resumeSignedUrl, setResumeSignedUrl] = useState(null);

  const [matchingLoading, setMatchingLoading] = useState(false);
  const [candidateMatches, setCandidateMatches] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [appRes, jobsRes] = await Promise.all([
        getApplicationsApi(),
        getJobsApi(),
      ]);

      setApplications(appRes.data?.data || []);
      setJobs(jobsRes.data?.data || []);
    } catch (err) {
      console.error('Error fetching HR applicants:', err);
      setError(err.response?.data?.message || 'Failed to load applicant pipeline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRunAICandidateMatching = async (jobId) => {
    if (!jobId || jobId === 'All') return;
    try {
      setMatchingLoading(true);
      const res = await getCandidateMatchesApi(jobId);
      const matches = res.data?.data || [];
      setCandidateMatches(matches);
      setSortByMatch(true);
      toast.success(`AI Candidate Matching complete for job! (${matches.length} candidates analyzed)`);
    } catch (err) {
      console.error('Error running candidate matching:', err);
      toast.error(err.response?.data?.message || 'Failed to run AI Candidate Matching');
    } finally {
      setMatchingLoading(false);
    }
  };

  const handleUpdateStatus = async (applicantId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const res = await updateApplicationApi(applicantId, {
        status: newStatus,
        recruiterNotes: recruiterNote || undefined,
      });

      const updatedApp = res.data?.data;
      setApplications((prev) =>
        prev.map((a) => (a._id === applicantId ? updatedApp || { ...a, status: newStatus } : a))
      );

      if (selectedApplicant && selectedApplicant._id === applicantId) {
        setSelectedApplicant((prev) => ({ ...prev, status: newStatus }));
      }
      toast.success(`Applicant status updated to "${newStatus}"!`);
    } catch (err) {
      console.error('Update status error:', err);
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedApplicant) return;
    try {
      await updateApplicationApi(selectedApplicant._id, {
        recruiterNotes: recruiterNote,
      });
      setApplications((prev) =>
        prev.map((a) =>
          a._id === selectedApplicant._id ? { ...a, recruiterNotes: recruiterNote } : a
        )
      );
      toast.success('Recruiter notes saved successfully!');
    } catch (err) {
      console.error('Save notes error:', err);
      toast.error('Failed to save recruiter notes');
    }
  };

  const openApplicantDetails = async (app) => {
    setSelectedApplicant(app);
    setRecruiterNote(app.recruiterNotes || '');
    setDetailModalOpen(true);
    setResumeSignedUrl(null);

    const candidateId = app.candidateId?._id || app.candidateId;
    if (candidateId) {
      try {
        const res = await getCandidateResumeApi(candidateId);
        if (res.data?.data?.signedUrl) {
          setResumeSignedUrl(res.data.data.signedUrl);
        }
      } catch (_) {
        // resume may not exist
      }
    }
  };

  // Filter
  const filteredApplicants = applications.filter((app) => {
    const candidate = app.candidateId || {};
    const candidateName = candidate.name || app.candidateName || 'Applicant';
    const candidateEmail = candidate.email || app.email || '';
    const jobTitle = app.jobTitle || app.jobId?.title || '';

    const matchesJob = selectedJobFilter === 'All' || app.jobId?._id === selectedJobFilter || app.jobId === selectedJobFilter;
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      candidateName.toLowerCase().includes(query) ||
      jobTitle.toLowerCase().includes(query) ||
      candidateEmail.toLowerCase().includes(query);

    return matchesJob && matchesStatus && matchesQuery;
  });

  // Sort by AI Candidate Matching Score if available
  const sortedApplicants = sortByMatch
    ? [...filteredApplicants].sort((a, b) => {
        const matchA = candidateMatches.find((m) => String(m.applicationId) === String(a._id));
        const matchB = candidateMatches.find((m) => String(m.applicationId) === String(b._id));
        const scoreA = matchA?.matchScore ?? a.atsScore ?? 0;
        const scoreB = matchB?.matchScore ?? b.atsScore ?? 0;
        return scoreB - scoreA;
      })
    : filteredApplicants;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Applicant Pipeline & AI Candidates
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review submitted candidate profiles, evaluate AI candidate match scores, update status, and manage hiring pipeline.
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search candidate name, position, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={Search}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Select
            value={selectedJobFilter}
            onChange={(e) => {
              const jobId = e.target.value;
              setSelectedJobFilter(jobId);
              if (jobId !== 'All') {
                handleRunAICandidateMatching(jobId);
              }
            }}
            options={[
              { value: 'All', label: 'All Posted Jobs' },
              ...jobs.map((j) => ({ value: j._id, label: j.title })),
            ]}
          />

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Applied', label: 'Applied' },
              { value: 'Under Review', label: 'Under Review' },
              { value: 'Shortlisted', label: 'Shortlisted' },
              { value: 'Interview Scheduled', label: 'Interview Scheduled' },
              { value: 'Selected', label: 'Selected' },
              { value: 'Rejected', label: 'Rejected' },
            ]}
          />

          {selectedJobFilter !== 'All' && (
            <Button
              variant="outline"
              size="xs"
              isLoading={matchingLoading}
              leftIcon={Sparkles}
              onClick={() => handleRunAICandidateMatching(selectedJobFilter)}
            >
              Run AI Match
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <Card variant="default">
        <CardContent className="p-0">
          {loading ? (
            <SkeletonTable rows={5} />
          ) : error ? (
            <ErrorState title="Error Loading Applicants" message={error} onRetry={fetchData} />
          ) : sortedApplicants.length === 0 ? (
            <EmptyState
              title="No candidates found in pipeline"
              description="No applications match your selected job or status filter."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Applied Position</TableHead>
                  <TableHead>Skills & Background</TableHead>
                  <TableHead>AI Match Score</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedApplicants.map((app) => {
                  const candidate = app.candidateId || {};
                  const candName = candidate.name || app.candidateName || 'Applicant';
                  const candEmail = candidate.email || app.email || '';
                  const skills = candidate.skills || app.skills || [];
                  const jobTitle = app.jobTitle || app.jobId?.title || 'Role';

                  const aiMatchObj = candidateMatches.find((m) => String(m.applicationId) === String(app._id));
                  const matchScore = aiMatchObj?.matchScore ?? app.atsScore ?? 75;

                  let statusVariant = 'info';
                  if (app.status === 'Shortlisted') statusVariant = 'purple';
                  if (app.status === 'Selected') statusVariant = 'success';
                  if (app.status === 'Rejected') statusVariant = 'danger';

                  return (
                    <TableRow key={app._id}>
                      <TableCell className="font-bold text-slate-900 flex items-center gap-2.5">
                        <Avatar name={candName} size="xs" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{candName}</p>
                          <p className="text-[10px] text-slate-400">{candEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-slate-700">{jobTitle}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {skills.slice(0, 3).map((s, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-semibold">
                              {s}
                            </span>
                          ))}
                          {skills.length > 3 && (
                            <span className="text-[10px] text-slate-400 font-bold">+{skills.length - 3}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="purple" showDot size="xs">
                          {matchScore}% Match
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant} showDot size="xs">
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="xs" leftIcon={Eye} onClick={() => openApplicantDetails(app)}>
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Candidate Details Modal */}
      {selectedApplicant && (() => {
        const cand = selectedApplicant.candidateId || {};
        const candName = cand.name || selectedApplicant.candidateName || 'Applicant';
        const candEmail = cand.email || selectedApplicant.email || 'N/A';
        const candPhone = cand.profile?.phone || cand.phone || 'Not provided';
        const candLocation = cand.profile?.location || cand.location || 'Not specified';
        const candHeadline = cand.profile?.headline || cand.headline || 'Job Seeker';
        const candBio = cand.profile?.bio || cand.bio || '';
        const candSkills = cand.skills || selectedApplicant.skills || [];
        const candEducation = cand.education || [];
        const candExperience = cand.experience || [];
        const candLinkedin = cand.profile?.linkedin || cand.linkedin;
        const candGithub = cand.profile?.github || cand.github;
        const candWebsite = cand.profile?.website || cand.profile?.portfolio || cand.website;

        return (
          <Modal
            isOpen={detailModalOpen}
            onClose={() => setDetailModalOpen(false)}
            title={`Candidate Profile — ${candName}`}
            description={`Applied for ${selectedApplicant.jobTitle || 'Role'}`}
            size="lg"
          >
            <div className="space-y-6 py-2 text-xs text-slate-700">
              {/* Action Bar */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-slate-800">Pipeline Status Action:</span>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="primary"
                    size="xs"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    leftIcon={Award}
                    onClick={() => {
                      setDetailModalOpen(false);
                      navigate('/hr/offers', { state: { preselectAppId: selectedApplicant._id } });
                    }}
                  >
                    Provide Offer Letter
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    isLoading={updatingStatus}
                    onClick={() => handleUpdateStatus(selectedApplicant._id, 'Shortlisted')}
                  >
                    Shortlist
                  </Button>
                  <Button
                    variant="success"
                    size="xs"
                    isLoading={updatingStatus}
                    onClick={() => handleUpdateStatus(selectedApplicant._id, 'Selected')}
                  >
                    Select Candidate
                  </Button>
                  <Button
                    variant="danger"
                    size="xs"
                    isLoading={updatingStatus}
                    onClick={() => handleUpdateStatus(selectedApplicant._id, 'Rejected')}
                  >
                    Reject
                  </Button>
                </div>
              </div>

              {/* Comprehensive Candidate Profile Card */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
                  <div className="flex items-center gap-3.5">
                    <Avatar name={candName} size="md" status="online" className="shrink-0 shadow-xs" />
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 leading-snug">{candName}</h3>
                      <p className="text-xs font-semibold text-purple-600">{candHeadline}</p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1">
                        <span className="flex items-center gap-1 font-medium text-slate-600">
                          <Mail className="w-3.5 h-3.5 text-slate-400" /> {candEmail}
                        </span>
                        {candPhone !== 'Not provided' && (
                          <span className="flex items-center gap-1 font-medium text-slate-600">
                            <Phone className="w-3.5 h-3.5 text-slate-400" /> {candPhone}
                          </span>
                        )}
                        {candLocation !== 'Not specified' && (
                          <span className="flex items-center gap-1 font-medium text-slate-600">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {candLocation}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={selectedApplicant.atsScore >= 75 ? 'purple' : 'info'} showDot size="sm">
                      {selectedApplicant.atsScore ? `${selectedApplicant.atsScore}% AI ATS Match` : 'Candidate Profile'}
                    </Badge>
                  </div>
                </div>

                {/* Candidate Bio / Summary */}
                {candBio && (
                  <div className="space-y-1">
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Candidate Summary / Bio</h4>
                    <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/60 italic">
                      "{candBio}"
                    </p>
                  </div>
                )}

                {/* Technical Skills Stack */}
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Technical Skills & Expertise
                  </h4>
                  {candSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {candSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No technical skills listed on candidate profile.</p>
                  )}
                </div>

                {/* Online Profiles & Portfolio */}
                {(candLinkedin || candGithub || candWebsite) && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Online Profiles & Links</h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      {candLinkedin && (
                        <a href={candLinkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-semibold text-indigo-600 hover:underline">
                          <Link2 className="w-3.5 h-3.5" /> LinkedIn Profile
                        </a>
                      )}
                      {candGithub && (
                        <a href={candGithub} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-semibold text-slate-700 hover:underline">
                          <Link2 className="w-3.5 h-3.5" /> GitHub Profile
                        </a>
                      )}
                      {candWebsite && (
                        <a href={candWebsite} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-semibold text-purple-600 hover:underline">
                          <Globe className="w-3.5 h-3.5" /> Personal Portfolio
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Work Experience */}
                {candExperience.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-200/60">
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-500" /> Work Experience History
                    </h4>
                    <div className="space-y-2">
                      {candExperience.map((exp, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200/60 text-xs space-y-1">
                          <div className="flex items-center justify-between font-bold text-slate-900">
                            <span>{exp.title} {exp.company ? `at ${exp.company}` : ''}</span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {exp.startDate ? new Date(exp.startDate).getFullYear() : ''} - {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).getFullYear() : ''}
                            </span>
                          </div>
                          {exp.description && <p className="text-slate-600 text-[11px]">{exp.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education History */}
                {candEducation.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-200/60">
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-500" /> Education History
                    </h4>
                    <div className="space-y-2">
                      {candEducation.map((edu, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200/60 text-xs flex items-center justify-between">
                          <div>
                            <p className="font-bold text-slate-900">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</p>
                            <p className="text-[11px] text-slate-500">{edu.institution}</p>
                          </div>
                          {(edu.startYear || edu.endYear) && (
                            <span className="text-[10px] font-semibold text-slate-400">
                              {edu.startYear} - {edu.endYear || 'Present'}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Candidate Cover Letter */}
                {selectedApplicant.coverLetter && (
                  <div className="space-y-1 pt-2 border-t border-slate-200/60">
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Candidate Cover Letter</h4>
                    <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/60 leading-relaxed">
                      {selectedApplicant.coverLetter}
                    </p>
                  </div>
                )}
              </div>

              {/* Resume Preview Card */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-indigo-600" />
                  <div>
                    <p className="font-bold text-slate-900">
                      {selectedApplicant.resume?.fileName || selectedApplicant.resume?.originalName || 'Candidate Resume'}
                    </p>
                    <p className="text-[10px] text-slate-400">Stored in Cloudflare R2 Bucket</p>
                  </div>
                </div>
                {resumeSignedUrl ? (
                  <a href={resumeSignedUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="xs" rightIcon={ExternalLink}>
                      View Resume PDF
                    </Button>
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-400 italic">No resume attached</span>
                )}
              </div>

              {/* Recruiter Notes */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">Recruiter Evaluation Notes</h4>
                <Textarea
                  rows={3}
                  value={recruiterNote}
                  onChange={(e) => setRecruiterNote(e.target.value)}
                  placeholder="Add private evaluation notes, screening observations, or team feedback..."
                />
                <div className="flex justify-end">
                  <Button variant="primary" size="xs" leftIcon={Save} onClick={handleSaveNotes}>
                    Save Notes
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        );
      })()}
    </div>
  );
};

export default HRApplicants;

import React, { useState } from 'react';
import { mockApplicants, mockPostedJobs } from '../../data/hrMockData';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Avatar from '../../components/ui/Avatar';
import Textarea from '../../components/ui/Textarea';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Search,
  Sparkles,
  CheckCircle2,
  XCircle,
  Calendar,
  UserCheck,
  FileText,
  Clock,
  Eye,
  GraduationCap,
  Briefcase,
  Save,
} from 'lucide-react';

const HRApplicants = () => {
  const toast = useToast();
  const [applicants, setApplicants] = useState(mockApplicants);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [recruiterNote, setRecruiterNote] = useState('');

  // Filter
  const filteredApplicants = applicants.filter((app) => {
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      app.candidateName.toLowerCase().includes(query) ||
      app.jobTitle.toLowerCase().includes(query) ||
      app.email.toLowerCase().includes(query);
    return matchesStatus && matchesQuery;
  });

  const handleUpdateStatus = (applicantId, newStatus) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === applicantId ? { ...a, status: newStatus } : a))
    );
    if (selectedApplicant && selectedApplicant.id === applicantId) {
      setSelectedApplicant((prev) => ({ ...prev, status: newStatus }));
    }
    toast.success(`Updated applicant status to "${newStatus}"`);
  };

  const handleSaveNotes = () => {
    if (!selectedApplicant) return;
    setApplicants((prev) =>
      prev.map((a) =>
        a.id === selectedApplicant.id ? { ...a, recruiterNotes: recruiterNote } : a
      )
    );
    toast.success('Recruiter evaluation notes saved');
  };

  const openApplicantDetails = (app) => {
    setSelectedApplicant(app);
    setRecruiterNote(app.recruiterNotes || '');
    setDetailModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Applicant Pipeline & AI Candidates
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review submitted candidate profiles, evaluate ATS match scores, shortlist talent, and issue interview invites.
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search candidate name, job position, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={Search}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Screening', label: 'Screening' },
              { value: 'Shortlisted', label: 'Shortlisted' },
              { value: 'Interview Scheduled', label: 'Interview Scheduled' },
              { value: 'Selected', label: 'Selected' },
              { value: 'Rejected', label: 'Rejected' },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <Card variant="default">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Applied Position</TableHead>
                <TableHead>Matched Skills</TableHead>
                <TableHead>AI Match Score</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplicants.map((cand) => (
                <TableRow key={cand.id}>
                  <TableCell className="font-bold text-slate-900 flex items-center gap-2.5">
                    <Avatar name={cand.candidateName} size="xs" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{cand.candidateName}</p>
                      <p className="text-[10px] text-slate-400">{cand.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-slate-700">{cand.jobTitle}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {cand.skills.slice(0, 3).map((s) => (
                        <span key={s} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-semibold">
                          {s}
                        </span>
                      ))}
                      {cand.skills.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-bold">+{cand.skills.length - 3}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="purple" showDot size="xs">{cand.matchScore}% Match</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">{cand.appliedDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        cand.status === 'Shortlisted'
                          ? 'primary'
                          : cand.status === 'Selected'
                          ? 'success'
                          : cand.status === 'Rejected'
                          ? 'danger'
                          : 'info'
                      }
                      showDot
                      size="xs"
                    >
                      {cand.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="xs" leftIcon={Eye} onClick={() => openApplicantDetails(cand)}>
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Candidate Details Modal */}
      {selectedApplicant && (
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title={`Candidate Profile — ${selectedApplicant.candidateName}`}
          description={`Applied for ${selectedApplicant.jobTitle} on ${selectedApplicant.appliedDate}`}
          size="lg"
        >
          <div className="space-y-6 py-2 text-xs text-slate-700">
            {/* Action Bar */}
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-slate-800">Pipeline Action:</span>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="primary"
                  size="xs"
                  onClick={() => handleUpdateStatus(selectedApplicant.id, 'Shortlisted')}
                >
                  Shortlist
                </Button>
                <Button
                  variant="success"
                  size="xs"
                  onClick={() => handleUpdateStatus(selectedApplicant.id, 'Selected')}
                >
                  Select Candidate
                </Button>
                <Button
                  variant="danger"
                  size="xs"
                  onClick={() => handleUpdateStatus(selectedApplicant.id, 'Rejected')}
                >
                  Reject
                </Button>
              </div>
            </div>

            {/* ATS Score & Strengths */}
            <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" /> AI ATS Resume Analysis
                </h4>
                <Badge variant="purple" size="xs">{selectedApplicant.atsAnalysis.score}% Match</Badge>
              </div>
              <div className="space-y-1 pt-1">
                <p className="font-bold text-indigo-900">Strengths:</p>
                <ul className="list-disc list-inside text-indigo-800 space-y-0.5">
                  {selectedApplicant.atsAnalysis.strengths.map((str, idx) => (
                    <li key={idx}>{str}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Candidate Resume Preview Card */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-indigo-600" />
                <div>
                  <p className="font-bold text-slate-900">{selectedApplicant.resumeFilename}</p>
                  <p className="text-[10px] text-slate-400">Stored in Cloudflare R2 Bucket</p>
                </div>
              </div>
              <Button variant="outline" size="xs">
                Download PDF
              </Button>
            </div>

            {/* Education & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600" /> Education
                </h4>
                {selectedApplicant.education.map((edu, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="font-bold text-slate-800">{edu.degree}</p>
                    <p className="text-[11px] text-slate-500">{edu.institution} ({edu.year})</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-indigo-600" /> Work Experience
                </h4>
                {selectedApplicant.experience.map((exp, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="font-bold text-slate-800">{exp.title}</p>
                    <p className="text-[11px] text-indigo-600 font-bold">{exp.company} ({exp.period})</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recruiter Notes */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900">Recruiter Evaluation Notes</h4>
              <Textarea
                rows={3}
                value={recruiterNote}
                onChange={(e) => setRecruiterNote(e.target.value)}
                placeholder="Add private feedback, interviewer comments, or screening notes..."
              />
              <div className="flex justify-end">
                <Button variant="primary" size="xs" leftIcon={Save} onClick={handleSaveNotes}>
                  Save Notes
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HRApplicants;

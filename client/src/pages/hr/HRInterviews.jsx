import React, { useState } from 'react';
import { mockHRInterviews, mockApplicants } from '../../data/hrMockData';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Tabs from '../../components/ui/Tabs';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import EmptyState from '../../components/ui/EmptyState';
import { useToast } from '../../context/ToastContext';
import { Calendar, Clock, Video, User, Plus, ExternalLink, RefreshCw, XCircle } from 'lucide-react';

const HRInterviews = () => {
  const toast = useToast();
  const [interviews, setInterviews] = useState(mockHRInterviews);
  const [activeTab, setActiveTab] = useState('Upcoming');

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  const [scheduleForm, setScheduleForm] = useState({
    candidateName: mockApplicants[0]?.candidateName || '',
    jobTitle: mockApplicants[0]?.jobTitle || '',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '11:00 AM EST',
    format: 'Video Call (Google Meet)',
    interviewer: 'Recruiting Team Lead',
  });

  const filteredInterviews = interviews.filter((i) => i.status === activeTab);

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    const newInt = {
      id: `hr-int-${Date.now()}`,
      ...scheduleForm,
      status: 'Upcoming',
      joinUrl: 'https://meet.google.com/new-interview-room',
      notes: 'Scheduled by HR Recruiter.',
    };

    setInterviews((prev) => [newInt, ...prev]);
    toast.success(`Interview scheduled for ${scheduleForm.candidateName}!`);
    setScheduleModalOpen(false);
  };

  const handleCancelConfirm = () => {
    if (!selectedInterview) return;
    setInterviews((prev) =>
      prev.map((i) => (i.id === selectedInterview.id ? { ...i, status: 'Cancelled' } : i))
    );
    toast.success(`Cancelled interview with ${selectedInterview.candidateName}`);
    setCancelModalOpen(false);
    setSelectedInterview(null);
  };

  const tabs = [
    { id: 'Upcoming', label: 'Upcoming', count: interviews.filter((i) => i.status === 'Upcoming').length },
    { id: 'Completed', label: 'Completed', count: interviews.filter((i) => i.status === 'Completed').length },
    { id: 'Cancelled', label: 'Cancelled', count: interviews.filter((i) => i.status === 'Cancelled').length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Recruiter Interview Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Schedule candidate discussions, assign hiring managers, and issue meeting room links.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={Plus}
          onClick={() => setScheduleModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white shadow-md"
        >
          Schedule New Interview
        </Button>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={(t) => setActiveTab(t)} variant="pills" />
      </div>

      {/* Content */}
      {filteredInterviews.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={`No ${activeTab.toLowerCase()} HR interviews`}
          description={`There are currently no ${activeTab.toLowerCase()} recruiter interviews scheduled.`}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInterviews.map((item) => (
            <Card
              key={item.id}
              variant="default"
              className="p-6 flex flex-col justify-between space-y-4 border-slate-200/90 shadow-sm hover:shadow-md transition"
            >
              <CardContent className="p-0 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{item.candidateName}</h3>
                    <p className="text-xs font-bold text-purple-600 mt-0.5">{item.jobTitle}</p>
                  </div>
                  <Badge
                    variant={
                      item.status === 'Upcoming'
                        ? 'warning'
                        : item.status === 'Completed'
                        ? 'success'
                        : 'danger'
                    }
                    showDot
                    size="xs"
                  >
                    {item.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs text-slate-600 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.date}</span>
                    <Clock className="w-3.5 h-3.5 text-slate-400 ml-2" />
                    <span>{item.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.format}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Hiring Manager: {item.interviewer}</span>
                  </div>
                </div>
              </CardContent>

              {item.status === 'Upcoming' && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Button
                    variant="ghost"
                    size="xs"
                    className="text-rose-600 hover:bg-rose-50"
                    onClick={() => {
                      setSelectedInterview(item);
                      setCancelModalOpen(true);
                    }}
                  >
                    Cancel
                  </Button>
                  {item.joinUrl && (
                    <a href={item.joinUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="primary" size="xs" rightIcon={ExternalLink}>
                        Launch Meeting Room
                      </Button>
                    </a>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        title="Schedule Candidate Interview"
        description="Select applicant, date, time slot, and assigned hiring manager."
        size="md"
      >
        <form onSubmit={handleScheduleSubmit} className="space-y-4 py-2">
          <Select
            label="Select Applicant *"
            value={scheduleForm.candidateName}
            onChange={(e) => {
              const name = e.target.value;
              const cand = mockApplicants.find((a) => a.candidateName === name);
              setScheduleForm((prev) => ({
                ...prev,
                candidateName: name,
                jobTitle: cand ? cand.jobTitle : prev.jobTitle,
              }));
            }}
            options={mockApplicants.map((a) => ({
              value: a.candidateName,
              label: `${a.candidateName} (${a.jobTitle})`,
            }))}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Interview Date *"
              type="date"
              value={scheduleForm.date}
              onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
              required
            />
            <Input
              label="Time Slot *"
              placeholder="e.g. 11:00 AM EST"
              value={scheduleForm.time}
              onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
              required
            />
          </div>

          <Input
            label="Assigned Hiring Manager *"
            placeholder="e.g. David Chen (Engineering Manager)"
            value={scheduleForm.interviewer}
            onChange={(e) => setScheduleForm({ ...scheduleForm, interviewer: e.target.value })}
            required
          />

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" className="bg-purple-600 hover:bg-purple-500 text-white">
              Schedule Interview
            </Button>
          </div>
        </form>
      </Modal>

      {/* Cancel Confirmation Dialog */}
      {selectedInterview && (
        <ConfirmationDialog
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          onConfirm={handleCancelConfirm}
          title="Cancel Candidate Interview"
          description={`Are you sure you want to cancel the scheduled interview for ${selectedInterview.candidateName}?`}
          confirmLabel="Cancel Interview"
          variant="danger"
        />
      )}
    </div>
  );
};

export default HRInterviews;

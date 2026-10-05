import React, { useState, useEffect } from 'react';
import {
  getInterviewsApi,
  scheduleInterviewApi,
  completeInterviewApi,
  cancelInterviewApi,
  getApplicationsApi,
} from '../../services/api';
import Card, { CardContent } from '../../components/ui/Card';
import Tabs from '../../components/ui/Tabs';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { SkeletonCard } from '../../components/ui/SkeletonLoader';
import { useToast } from '../../context/ToastContext';
import { Calendar, Clock, Video, User, Plus, ExternalLink, CheckCircle2, XCircle } from 'lucide-react';

const HRInterviews = () => {
  const toast = useToast();
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Scheduled');

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [scheduleForm, setScheduleForm] = useState({
    applicationId: '',
    interviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    interviewTime: '11:00 AM EST',
    duration: 60,
    interviewType: 'System Design & Technical Screen',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    interviewerName: 'Technical Lead & HR Manager',
    notes: 'Focus on technical architecture and cultural fit.',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [intRes, appRes] = await Promise.all([
        getInterviewsApi(),
        getApplicationsApi(),
      ]);

      const intList = intRes.data?.data || [];
      const appList = appRes.data?.data || [];

      setInterviews(intList);
      setApplications(appList);

      if (appList.length > 0) {
        setScheduleForm((prev) => ({
          ...prev,
          applicationId: appList[0]._id,
        }));
      }
    } catch (err) {
      console.error('Error fetching HR interviews:', err);
      setError(err.response?.data?.message || 'Failed to load interview schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleForm.applicationId) {
      toast.error('Please select a candidate application.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await scheduleInterviewApi(scheduleForm);
      toast.success(res.data?.message || 'Interview scheduled successfully!');
      setScheduleModalOpen(false);
      await fetchData();
    } catch (err) {
      console.error('Schedule interview error:', err);
      toast.error(err.response?.data?.message || 'Failed to schedule interview');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteInterview = async (id) => {
    try {
      await completeInterviewApi(id);
      toast.success('Interview marked as Completed!');
      await fetchData();
    } catch (err) {
      console.error('Complete interview error:', err);
      toast.error(err.response?.data?.message || 'Failed to complete interview');
    }
  };

  const handleCancelInterview = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this interview? Candidate will be notified via email and in-app alert.')) return;
    try {
      await cancelInterviewApi(id);
      toast.success('Interview cancelled.');
      await fetchData();
    } catch (err) {
      console.error('Cancel interview error:', err);
      toast.error(err.response?.data?.message || 'Failed to cancel interview');
    }
  };

  const scheduledList = interviews.filter((i) => i.status === 'Scheduled' || i.status === 'Rescheduled');
  const completedList = interviews.filter((i) => i.status === 'Completed');
  const cancelledList = interviews.filter((i) => i.status === 'Cancelled');

  const filteredInterviews =
    activeTab === 'Scheduled'
      ? scheduledList
      : activeTab === 'Completed'
      ? completedList
      : cancelledList;

  const tabs = [
    { id: 'Scheduled', label: 'Upcoming / Scheduled', count: scheduledList.length },
    { id: 'Completed', label: 'Completed', count: completedList.length },
    { id: 'Cancelled', label: 'Cancelled', count: cancelledList.length },
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
            Schedule candidate discussions, assign hiring managers, and dispatch video meeting room links.
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
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : error ? (
        <ErrorState title="Error Loading Interviews" message={error} onRetry={fetchData} />
      ) : filteredInterviews.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={`No ${activeTab.toLowerCase()} HR interviews`}
          description={`There are currently no ${activeTab.toLowerCase()} recruiter interviews in the database.`}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInterviews.map((item) => {
            const candUser = item.candidateId || {};
            const app = item.applicationId || {};
            const candidateName = candUser.name || app.candidateName || 'Candidate';
            const jobTitle = app.jobTitle || item.interviewType || 'Position';

            let badgeVariant = 'warning';
            if (item.status === 'Completed') badgeVariant = 'success';
            if (item.status === 'Cancelled') badgeVariant = 'danger';

            return (
              <Card
                key={item._id}
                variant="default"
                className="p-6 flex flex-col justify-between space-y-4 border-slate-200/90 shadow-sm hover:shadow-md transition"
              >
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{candidateName}</h3>
                      <p className="text-xs font-bold text-purple-600 mt-0.5">{jobTitle}</p>
                    </div>
                    <Badge variant={badgeVariant} showDot size="xs">
                      {item.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.interviewDate}</span>
                      <Clock className="w-3.5 h-3.5 text-slate-400 ml-2" />
                      <span>{item.interviewTime} ({item.duration || 60} mins)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.interviewType || 'Technical Screen'}</span>
                    </div>
                    {item.interviewerName && (
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Hiring Manager: {item.interviewerName}</span>
                      </div>
                    )}
                  </div>

                  {item.notes && (
                    <p className="text-xs text-slate-500 italic bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                      "{item.notes}"
                    </p>
                  )}
                </CardContent>

                {(item.status === 'Scheduled' || item.status === 'Rescheduled') && (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="xs"
                        className="text-rose-600 hover:bg-rose-50"
                        onClick={() => handleCancelInterview(item._id)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="outline"
                        size="xs"
                        className="text-emerald-700 hover:bg-emerald-50"
                        onClick={() => handleCompleteInterview(item._id)}
                      >
                        Mark Complete
                      </Button>
                    </div>

                    {item.meetingLink && (
                      <a href={item.meetingLink} target="_blank" rel="noopener noreferrer">
                        <Button variant="primary" size="xs" rightIcon={ExternalLink}>
                          Join Call
                        </Button>
                      </a>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        title="Schedule Candidate Interview"
        description="Select applicant, date, time slot, and assigned interviewer."
        size="md"
      >
        <form onSubmit={handleScheduleSubmit} className="space-y-4 py-2">
          <Select
            label="Select Candidate Application *"
            value={scheduleForm.applicationId}
            onChange={(e) => setScheduleForm({ ...scheduleForm, applicationId: e.target.value })}
            options={applications.map((app) => ({
              value: app._id,
              label: `${app.candidateId?.name || app.company} — ${app.jobTitle}`,
            }))}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Interview Date *"
              type="date"
              value={scheduleForm.interviewDate}
              onChange={(e) => setScheduleForm({ ...scheduleForm, interviewDate: e.target.value })}
              required
            />
            <Input
              label="Time Slot *"
              placeholder="e.g. 11:00 AM EST"
              value={scheduleForm.interviewTime}
              onChange={(e) => setScheduleForm({ ...scheduleForm, interviewTime: e.target.value })}
              required
            />
          </div>

          <Input
            label="Interview Format / Type"
            placeholder="e.g. System Design / Technical Screening"
            value={scheduleForm.interviewType}
            onChange={(e) => setScheduleForm({ ...scheduleForm, interviewType: e.target.value })}
          />

          <Input
            label="Meeting Room Link"
            placeholder="https://meet.google.com/..."
            value={scheduleForm.meetingLink}
            onChange={(e) => setScheduleForm({ ...scheduleForm, meetingLink: e.target.value })}
          />

          <Input
            label="Assigned Hiring Manager / Interviewer"
            placeholder="e.g. Sarah Recruiter & Tech Lead"
            value={scheduleForm.interviewerName}
            onChange={(e) => setScheduleForm({ ...scheduleForm, interviewerName: e.target.value })}
          />

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              isLoading={submitting}
              className="bg-purple-600 hover:bg-purple-500 text-white"
            >
              Schedule & Send Notifications
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HRInterviews;

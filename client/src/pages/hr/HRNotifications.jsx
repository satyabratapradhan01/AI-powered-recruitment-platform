import React, { useState } from 'react';
import Card, { CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import EmptyState from '../../components/ui/EmptyState';
import { useToast } from '../../context/ToastContext';
import { Bell, CheckCheck, UserCheck, Calendar, Briefcase } from 'lucide-react';

const HRNotifications = () => {
  const toast = useToast();
  const [notifications, setNotifications] = useState([
    {
      id: 'hr-notif-1',
      title: 'New Applicant Submission',
      message: 'Alex Morgan submitted an application for Senior Full-Stack Engineer with 96% AI ATS Match.',
      timestamp: '1 hour ago',
      type: 'applicant',
      isRead: false,
    },
    {
      id: 'hr-notif-2',
      title: 'Interview Confirmed',
      message: 'Elena Rostova confirmed the technical interview scheduled for Oct 9 at 10:00 AM EST.',
      timestamp: '3 hours ago',
      type: 'interview',
      isRead: false,
    },
    {
      id: 'hr-notif-3',
      title: 'Job Opening Status',
      message: 'Position "AI Product UI/UX Designer" was marked as Closed after successful hire.',
      timestamp: '2 days ago',
      type: 'job',
      isRead: true,
    },
  ]);

  const [activeTab, setActiveTab] = useState('All');

  const filtered = notifications.filter((n) => {
    if (activeTab === 'Unread') return !n.isRead;
    return true;
  });

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success('All recruiter alerts marked as read');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Recruiter Alerts & Activity
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time candidate submissions, interview confirmations, and hiring milestones.
          </p>
        </div>
        <Button variant="outline" size="xs" leftIcon={CheckCheck} onClick={markAllRead}>
          Mark All Read
        </Button>
      </div>

      <Card variant="default" className="divide-y divide-slate-100">
        {filtered.map((n) => (
          <div
            key={n.id}
            className={`p-4 flex items-start justify-between gap-4 transition ${
              !n.isRead ? 'bg-purple-50/40' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white border border-slate-200/80 shadow-xs shrink-0 mt-0.5">
                <Bell className="w-4 h-4 text-purple-600" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                <p className="text-xs text-slate-600">{n.message}</p>
                <p className="text-[10px] text-slate-400">{n.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default HRNotifications;

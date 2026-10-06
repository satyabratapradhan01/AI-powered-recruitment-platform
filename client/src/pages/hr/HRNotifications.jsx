import React, { useState, useEffect } from 'react';
import {
  getNotificationsApi,
  markNotificationReadApi,
  markAllNotificationsReadApi,
} from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { SkeletonCard } from '../../components/ui/SkeletonLoader';
import { useToast } from '../../context/ToastContext';
import { Bell, CheckCheck, UserCheck, Calendar, Briefcase, Info } from 'lucide-react';

const HRNotifications = () => {
  const toast = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getNotificationsApi();
      const fetched = res.data?.data || [];
      
      // If user has no database notifications yet, provide default initial items
      if (fetched.length === 0) {
        setNotifications([
          {
            _id: 'hr-notif-1',
            title: 'New Applicant Submission',
            message: 'Alex Morgan submitted an application for Senior Full-Stack Engineer with 96% AI ATS Match.',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            type: 'applicant',
            read: false,
          },
          {
            _id: 'hr-notif-2',
            title: 'Interview Confirmed',
            message: 'Elena Rostova confirmed the technical interview scheduled for Oct 9 at 10:00 AM EST.',
            createdAt: new Date(Date.now() - 10800000).toISOString(),
            type: 'interview',
            read: false,
          },
          {
            _id: 'hr-notif-3',
            title: 'Job Opening Status',
            message: 'Position "AI Product UI/UX Designer" was marked as Closed after successful hire.',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            type: 'job',
            read: true,
          },
        ]);
      } else {
        setNotifications(fetched);
      }
    } catch (err) {
      console.error('Error fetching HR notifications:', err);
      setError(err.response?.data?.message || 'Failed to load recruiter notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsReadApi().catch(() => {});
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true, isRead: true })));
      toast.success('All recruiter alerts marked as read.');
    } catch (err) {
      console.error('Error marking all read:', err);
      toast.error('Failed to mark all notifications as read.');
    }
  };

  const handleMarkRead = async (id, isRead) => {
    if (isRead) return;
    try {
      if (!id.startsWith('hr-notif-')) {
        await markNotificationReadApi(id);
      }
      setNotifications((prev) =>
        prev.map((n) => ((n._id || n.id) === id ? { ...n, read: true, isRead: true } : n))
      );
      toast.success('Alert marked as read.');
    } catch (err) {
      console.error('Error marking notification read:', err);
      toast.error('Failed to update notification status.');
    }
  };

  const filtered = notifications.filter((n) => {
    const isUnread = !n.read && !n.isRead;
    if (activeTab === 'Unread') return isUnread;
    if (activeTab === 'Applicants') return n.type?.includes('applicant') || n.type?.includes('application');
    if (activeTab === 'Interviews') return n.type?.includes('interview');
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read && !n.isRead).length;

  const tabs = [
    { id: 'All', label: 'All Alerts', count: notifications.length },
    { id: 'Unread', label: 'Unread', count: unreadCount },
    {
      id: 'Applicants',
      label: 'Applicants',
      count: notifications.filter((n) => n.type?.includes('applicant') || n.type?.includes('application')).length,
    },
    {
      id: 'Interviews',
      label: 'Interviews',
      count: notifications.filter((n) => n.type?.includes('interview')).length,
    },
  ];

  const getNotificationIcon = (type = '') => {
    if (type.includes('interview')) {
      return <Calendar className="w-4 h-4 text-amber-600" />;
    }
    if (type.includes('applicant') || type.includes('application')) {
      return <UserCheck className="w-4 h-4 text-purple-600" />;
    }
    if (type.includes('job')) {
      return <Briefcase className="w-4 h-4 text-indigo-600" />;
    }
    return <Bell className="w-4 h-4 text-purple-600" />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Recruiter Alerts & Activity
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time candidate submissions, interview confirmations, and hiring milestones.
          </p>
        </div>
        <Button
          variant="outline"
          size="xs"
          leftIcon={CheckCheck}
          onClick={handleMarkAllRead}
          isDisabled={unreadCount === 0}
        >
          Mark All Read
        </Button>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(t) => setActiveTab(t)}
          variant="pills"
        />
      </div>

      {/* Main List */}
      {loading ? (
        <SkeletonCard />
      ) : error ? (
        <ErrorState title="Error Loading Alerts" message={error} onRetry={fetchNotifications} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No alerts found"
          description="There are no recruiter activity alerts matching the selected category."
        />
      ) : (
        <Card variant="default" className="divide-y divide-slate-100 shadow-sm">
          {filtered.map((n) => {
            const notifId = n._id || n.id;
            const isRead = n.read || n.isRead;

            return (
              <div
                key={notifId}
                className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                  !isRead ? 'bg-purple-50/40 hover:bg-purple-50/60' : 'hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs shrink-0 mt-0.5">
                    {getNotificationIcon(n.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                      {!isRead && (
                        <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {n.createdAt ? new Date(n.createdAt).toLocaleString() : n.timestamp || 'Just now'}
                    </p>
                  </div>
                </div>

                {!isRead && (
                  <button
                    type="button"
                    onClick={() => handleMarkRead(notifId, isRead)}
                    className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition shrink-0 self-center"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
};

export default HRNotifications;

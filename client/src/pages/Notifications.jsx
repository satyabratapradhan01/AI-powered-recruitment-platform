import React, { useState, useEffect } from 'react';
import {
  getNotificationsApi,
  markNotificationReadApi,
  markAllNotificationsReadApi,
} from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { SkeletonCard } from '../components/ui/SkeletonLoader';
import { useToast } from '../context/ToastContext';
import { Bell, CheckCheck, Calendar, Briefcase, Info } from 'lucide-react';

const Notifications = () => {
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
      setNotifications(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsReadApi();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true, isRead: true })));
      toast.success('All notifications marked as read.');
    } catch (err) {
      console.error('Error marking all as read:', err);
      toast.error('Failed to mark all notifications as read.');
    }
  };

  const handleToggleReadStatus = async (id, isRead) => {
    if (isRead) return;
    try {
      await markNotificationReadApi(id);
      setNotifications((prev) =>
        prev.map((n) => ((n._id || n.id) === id ? { ...n, read: true, isRead: true } : n))
      );
      toast.success('Notification marked as read.');
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    const isUnread = !n.read && !n.isRead;
    if (activeTab === 'Unread') return isUnread;
    if (activeTab === 'Interviews') return n.type?.includes('interview');
    if (activeTab === 'Applications') return n.type?.includes('application') || n.type?.includes('status');
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read && !n.isRead).length;

  const tabs = [
    { id: 'All', label: 'All Notifications', count: notifications.length },
    { id: 'Unread', label: 'Unread', count: unreadCount },
    {
      id: 'Interviews',
      label: 'Interviews',
      count: notifications.filter((n) => n.type?.includes('interview')).length,
    },
    {
      id: 'Applications',
      label: 'Applications',
      count: notifications.filter((n) => n.type?.includes('application') || n.type?.includes('status')).length,
    },
  ];

  const getNotificationIcon = (type = '') => {
    if (type.includes('interview')) {
      return <Calendar className="w-5 h-5 text-amber-600" />;
    }
    if (type.includes('application') || type.includes('job')) {
      return <Briefcase className="w-5 h-5 text-indigo-600" />;
    }
    return <Info className="w-5 h-5 text-sky-600" />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Notification Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time updates on application status changes, interview schedules, and AI match notifications.
          </p>
        </div>

        <Button
          variant="outline"
          size="xs"
          leftIcon={CheckCheck}
          onClick={handleMarkAllRead}
          isDisabled={unreadCount === 0}
        >
          Mark All as Read
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

      {/* Content */}
      {loading ? (
        <SkeletonCard />
      ) : error ? (
        <ErrorState title="Error Loading Notifications" message={error} onRetry={fetchNotifications} />
      ) : filteredNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications found"
          description="You have no notifications matching the selected tab category."
        />
      ) : (
        <Card variant="default" className="divide-y divide-slate-100 shadow-sm">
          {filteredNotifications.map((notif) => {
            const notifId = notif._id || notif.id;
            const isRead = notif.read || notif.isRead;

            return (
              <div
                key={notifId}
                className={`p-5 flex items-start justify-between gap-4 transition-colors ${
                  !isRead ? 'bg-indigo-50/40' : 'hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs shrink-0 mt-0.5">
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{notif.title}</h4>
                      {!isRead && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : 'Just now'}
                    </p>
                  </div>
                </div>

                {!isRead && (
                  <button
                    type="button"
                    onClick={() => handleToggleReadStatus(notifId, isRead)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition shrink-0"
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

export default Notifications;

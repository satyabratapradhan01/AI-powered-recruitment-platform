import React, { useState } from 'react';
import { mockNotifications } from '../data/seekerMockData';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Tabs from '../components/ui/Tabs';
import EmptyState from '../components/ui/EmptyState';
import { useToast } from '../context/ToastContext';
import { Bell, CheckCheck, Calendar, Briefcase, Info, AlertCircle } from 'lucide-react';

const Notifications = () => {
  const toast = useToast();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState('All');

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'Unread') return !n.isRead;
    if (activeTab === 'Interviews') return n.type === 'interview';
    if (activeTab === 'Jobs') return n.type === 'job';
    return true;
  });

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success('All notifications marked as read');
  };

  const toggleReadStatus = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const tabs = [
    { id: 'All', label: 'All Notifications', count: notifications.length },
    {
      id: 'Unread',
      label: 'Unread',
      count: notifications.filter((n) => !n.isRead).length,
    },
    {
      id: 'Interviews',
      label: 'Interviews',
      count: notifications.filter((n) => n.type === 'interview').length,
    },
    {
      id: 'Jobs',
      label: 'Jobs & ATS',
      count: notifications.filter((n) => n.type === 'job' || n.type === 'status').length,
    },
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'interview':
        return <Calendar className="w-5 h-5 text-amber-600" />;
      case 'job':
        return <Briefcase className="w-5 h-5 text-indigo-600" />;
      case 'status':
        return <CheckCheck className="w-5 h-5 text-emerald-600" />;
      default:
        return <Info className="w-5 h-5 text-sky-600" />;
    }
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
            Real-time updates on application status changes, interview schedules, and AI job recommendations.
          </p>
        </div>

        <Button
          variant="outline"
          size="xs"
          leftIcon={CheckCheck}
          onClick={markAllAsRead}
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
      {filteredNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications found"
          description="You have no notifications matching the selected tab category."
        />
      ) : (
        <Card variant="default" className="divide-y divide-slate-100 shadow-sm">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 flex items-start justify-between gap-4 transition-colors ${
                !notif.isRead ? 'bg-indigo-50/40' : 'hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs shrink-0 mt-0.5">
                  {getNotificationIcon(notif.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{notif.title}</h4>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{notif.timestamp}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleReadStatus(notif.id)}
                className="text-xs font-semibold text-slate-400 hover:text-indigo-600 transition shrink-0"
              >
                {notif.isRead ? 'Mark Unread' : 'Mark Read'}
              </button>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

export default Notifications;

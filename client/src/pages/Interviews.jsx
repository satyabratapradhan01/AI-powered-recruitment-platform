import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getInterviewsApi } from '../services/api';
import Card, { CardContent } from '../components/ui/Card';
import Tabs from '../components/ui/Tabs';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { SkeletonCard } from '../components/ui/SkeletonLoader';
import { Calendar, Clock, Video, User, ExternalLink, Sparkles, HelpCircle } from 'lucide-react';

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Upcoming');

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getInterviewsApi();
      setInterviews(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching interviews:', err);
      setError(err.response?.data?.message || 'Failed to load interview schedule');
    } finally {
      setLoading(false);
    }
  };

  const upcomingList = interviews.filter((i) => i.status === 'Scheduled' || i.status === 'Rescheduled');
  const completedList = interviews.filter((i) => i.status === 'Completed');
  const cancelledList = interviews.filter((i) => i.status === 'Cancelled');

  const filteredInterviews =
    activeTab === 'Upcoming'
      ? upcomingList
      : activeTab === 'Completed'
      ? completedList
      : cancelledList;

  const tabs = [
    { id: 'Upcoming', label: 'Upcoming', count: upcomingList.length },
    { id: 'Completed', label: 'Completed', count: completedList.length },
    { id: 'Cancelled', label: 'Cancelled', count: cancelledList.length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Interview Schedule
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track hiring manager discussions, video meeting links, and access AI prep guidance.
          </p>
        </div>
        <Link to="/interview-preparation">
          <Button variant="primary" size="md" leftIcon={HelpCircle} className="bg-indigo-600 shadow-sm">
            AI Interview Preparation
          </Button>
        </Link>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : error ? (
        <ErrorState title="Error Loading Interviews" message={error} onRetry={fetchInterviews} />
      ) : filteredInterviews.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={`No ${activeTab.toLowerCase()} interviews`}
          description={`You currently have no ${activeTab.toLowerCase()} interview schedules in your calendar.`}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInterviews.map((item) => {
            const app = item.applicationId || {};
            const jobTitle = app.jobTitle || item.interviewType || 'Interview Session';
            const company = app.company || 'Recruiter Company';

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
                      <h3 className="font-bold text-slate-900 text-base">{jobTitle}</h3>
                      <p className="text-xs font-bold text-indigo-600 mt-0.5">{company}</p>
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
                      <span>{item.interviewType || 'Technical Discussion'}</span>
                    </div>
                    {item.interviewerName && (
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Interviewer: {item.interviewerName}</span>
                      </div>
                    )}
                  </div>

                  {item.notes && (
                    <p className="text-xs text-slate-500 italic bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                      "{item.notes}"
                    </p>
                  )}
                </CardContent>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <Link to="/interview-preparation">
                    <Button variant="outline" size="xs" leftIcon={Sparkles}>
                      AI Practice Questions
                    </Button>
                  </Link>
                  {item.meetingLink && item.status !== 'Cancelled' && (
                    <a href={item.meetingLink} target="_blank" rel="noopener noreferrer">
                      <Button variant="primary" size="xs" rightIcon={ExternalLink}>
                        Join Meeting Call
                      </Button>
                    </a>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Interviews;

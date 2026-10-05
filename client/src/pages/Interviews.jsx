import React, { useState } from 'react';
import { mockInterviews } from '../data/seekerMockData';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Tabs from '../components/ui/Tabs';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { Calendar, Clock, Video, User, FileText, ExternalLink, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

const Interviews = () => {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [prepModalOpen, setPrepModalOpen] = useState(false);

  const filteredInterviews = mockInterviews.filter((int) => int.type === activeTab);

  const tabs = [
    {
      id: 'Upcoming',
      label: 'Upcoming Interviews',
      count: mockInterviews.filter((i) => i.type === 'Upcoming').length,
    },
    {
      id: 'Completed',
      label: 'Completed',
      count: mockInterviews.filter((i) => i.type === 'Completed').length,
    },
    {
      id: 'Cancelled',
      label: 'Cancelled',
      count: mockInterviews.filter((i) => i.type === 'Cancelled').length,
    },
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
            Manage upcoming hiring manager discussions, video calls, and access AI prep guidance.
          </p>
        </div>
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
      {filteredInterviews.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={`No ${activeTab.toLowerCase()} interviews`}
          description={`You currently have no ${activeTab.toLowerCase()} interview schedules in your calendar.`}
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
                    <h3 className="font-bold text-slate-900 text-base">{item.jobTitle}</h3>
                    <p className="text-xs font-bold text-indigo-600 mt-0.5">{item.company}</p>
                  </div>
                  <Badge
                    variant={
                      item.type === 'Upcoming'
                        ? 'warning'
                        : item.type === 'Completed'
                        ? 'success'
                        : 'danger'
                    }
                    showDot
                    size="xs"
                  >
                    {item.type}
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
                    <span>Interviewer: {item.interviewer}</span>
                  </div>
                </div>

                {item.notes && (
                  <p className="text-xs text-slate-500 italic bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                    "{item.notes}"
                  </p>
                )}
              </CardContent>

              {item.type === 'Upcoming' && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    size="xs"
                    leftIcon={Sparkles}
                    onClick={() => {
                      setSelectedInterview(item);
                      setPrepModalOpen(true);
                    }}
                  >
                    AI Interview Prep
                  </Button>
                  {item.joinUrl && (
                    <a href={item.joinUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="primary" size="xs" rightIcon={ExternalLink}>
                        Join Video Call
                      </Button>
                    </a>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* AI Prep Modal */}
      {selectedInterview && (
        <Modal
          isOpen={prepModalOpen}
          onClose={() => setPrepModalOpen(false)}
          title={`AI Interview Prep — ${selectedInterview.company}`}
          description={`Custom prep insights generated for ${selectedInterview.jobTitle}.`}
          size="md"
        >
          <div className="space-y-4 py-2 text-xs text-slate-700">
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl space-y-1">
              <p className="font-bold text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" /> Key Topics to Expect
              </p>
              <p className="text-indigo-800 leading-relaxed">
                {selectedInterview.prepNotes}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Suggested Responses & Tips</h4>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Highlight your MongoDB indexing & React performance optimization projects.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Use the STAR method (Situation, Task, Action, Result) for behavioral questions.</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button variant="primary" size="sm" onClick={() => setPrepModalOpen(false)}>
                Got It
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Interviews;

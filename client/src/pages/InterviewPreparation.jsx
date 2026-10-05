import React, { useState, useEffect } from 'react';
import {
  getApplicationsApi,
  generateInterviewPrepApi,
  evaluateInterviewAnswerApi,
} from '../services/api';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import { SkeletonCard } from '../components/ui/SkeletonLoader';
import {
  Sparkles,
  BookOpen,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  Award,
  RefreshCw,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Brain,
  Layers,
} from 'lucide-react';

const InterviewPreparation = () => {
  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState('');
  const [appLoading, setAppLoading] = useState(true);

  const [prepData, setPrepData] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [prepError, setPrepError] = useState(null);

  const [activeTab, setActiveTab] = useState('technical');
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const [feedbackState, setFeedbackState] = useState({});
  const [evaluatingQuestionId, setEvaluatingQuestionId] = useState(null);

  const [expandedHints, setExpandedHints] = useState({});

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setAppLoading(true);
      const res = await getApplicationsApi();
      const list = res.data?.data || [];
      setApplications(list);
      if (list.length > 0) {
        setSelectedAppId(list[0]._id);
      }
    } catch (err) {
      console.error('Error fetching applications for prep:', err);
    } finally {
      setAppLoading(false);
    }
  };

  const handleGeneratePrep = async () => {
    try {
      setGenerating(true);
      setPrepError(null);
      setFeedbackState({});
      setPracticeAnswers({});

      const response = await generateInterviewPrepApi({
        applicationId: selectedAppId || undefined,
      });

      setPrepData(response.data?.data?.questions || null);
    } catch (err) {
      console.error('Error generating AI interview prep:', err);
      setPrepError(err.response?.data?.message || 'Failed to generate interview preparation questions.');
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleHint = (qId) => {
    setExpandedHints((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handleAnswerChange = (qId, text) => {
    setPracticeAnswers((prev) => ({
      ...prev,
      [qId]: text,
    }));
  };

  const handleEvaluateAnswer = async (questionObj) => {
    const qId = questionObj.id;
    const answerText = practiceAnswers[qId] || '';

    try {
      setEvaluatingQuestionId(qId);

      const response = await evaluateInterviewAnswerApi({
        question: questionObj.question,
        candidateAnswer: answerText,
        suggestedAnswerPoints: questionObj.suggestedAnswerPoints || [],
        jobTitle: prepData?.jobTitle || '',
      });

      setFeedbackState((prev) => ({
        ...prev,
        [qId]: response.data?.data || null,
      }));
    } catch (err) {
      console.error('Error evaluating practice answer:', err);
    } finally {
      setEvaluatingQuestionId(null);
    }
  };

  const selectedApp = applications.find((a) => a._id === selectedAppId);

  const categoryTabs = [
    { id: 'technical', label: 'Technical Questions', key: 'technicalQuestions', count: prepData?.technicalQuestions?.length || 0 },
    { id: 'hr', label: 'HR / Behavioral', key: 'hrQuestions', count: prepData?.hrQuestions?.length || 0 },
    { id: 'project', label: 'Project Deep-Dives', key: 'projectQuestions', count: prepData?.projectQuestions?.length || 0 },
    { id: 'role', label: 'Role-Specific', key: 'roleSpecificQuestions', count: prepData?.roleSpecificQuestions?.length || 0 },
  ];

  const currentTabObj = categoryTabs.find((t) => t.id === activeTab) || categoryTabs[0];
  const currentQuestions = prepData ? prepData[currentTabObj.key] || [] : [];

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200">
          <Brain className="w-3.5 h-3.5 text-indigo-300" /> AI Interview Simulator
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          AI Interview Preparation & Practice
        </h1>
        <p className="text-xs sm:text-sm text-indigo-200/90 max-w-2xl">
          Select an applied job to generate custom technical, HR, project, and role-specific interview questions. Practice your answers and receive constructive AI feedback.
        </p>
      </div>

      {/* 2. Job Selector Card */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" /> Target Position Selection
          </CardTitle>
          <CardDescription>Choose from your submitted applications to generate customized interview prep</CardDescription>
        </CardHeader>
        <CardContent>
          {appLoading ? (
            <SkeletonCard />
          ) : applications.length === 0 ? (
            <EmptyState
              title="No submitted applications found"
              description="You need to submit at least one job application before generating AI interview preparation."
              actionLabel="Submit First Application"
              actionLink="/applications/new"
            />
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <select
                value={selectedAppId}
                onChange={(e) => setSelectedAppId(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {applications.map((app) => (
                  <option key={app._id} value={app._id}>
                    {app.jobTitle} at {app.company} ({app.location || 'Remote'}) — Applied {new Date(app.appliedDate || app.createdAt).toLocaleDateString()}
                  </option>
                ))}
              </select>

              <Button
                variant="primary"
                size="md"
                onClick={handleGeneratePrep}
                isLoading={generating}
                leftIcon={Sparkles}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
              >
                Generate AI Questions
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Main Questions & Practice Section */}
      {prepError && (
        <ErrorState title="Generation Failed" message={prepError} onRetry={handleGeneratePrep} />
      )}

      {generating && (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {!generating && prepData && (
        <div className="space-y-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                    activeTab === tab.id ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Question List */}
          {currentQuestions.length === 0 ? (
            <EmptyState title="No questions generated for this category" description="Select another category tab or re-generate prep questions." />
          ) : (
            <div className="space-y-6">
              {currentQuestions.map((q, qIndex) => {
                const qId = q.id || `q-${qIndex}`;
                const answerText = practiceAnswers[qId] || '';
                const feedback = feedbackState[qId];
                const isEvaluating = evaluatingQuestionId === qId;
                const showHint = expandedHints[qId];

                return (
                  <Card key={qId} variant="default" className="p-5 sm:p-6 border-slate-200 space-y-4">
                    {/* Question Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="purple" size="xs">
                            {q.category || currentTabObj.label}
                          </Badge>
                          <span className="text-xs font-semibold text-slate-400">Question #{qIndex + 1}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base leading-snug">
                          {q.question}
                        </h3>
                      </div>
                    </div>

                    {/* Suggested Answer Hints Accordion */}
                    {q.suggestedAnswerPoints && q.suggestedAnswerPoints.length > 0 && (
                      <div className="border border-indigo-100 rounded-xl bg-indigo-50/50 overflow-hidden">
                        <button
                          onClick={() => handleToggleHint(qId)}
                          className="w-full px-4 py-2.5 text-xs font-bold text-indigo-700 flex items-center justify-between hover:bg-indigo-100/50 transition"
                        >
                          <span className="flex items-center gap-1.5">
                            <Lightbulb className="w-4 h-4 text-amber-500" /> Suggested Answer Structure & Hints
                          </span>
                          {showHint ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {showHint && (
                          <div className="px-4 py-3 border-t border-indigo-100 text-xs text-slate-700 space-y-1.5">
                            <ul className="list-disc list-inside space-y-1 text-slate-600">
                              {q.suggestedAnswerPoints.map((pt, pIdx) => (
                                <li key={pIdx}>{pt}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Practice Answer Area */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700">
                        Practice Your Answer (Type your response below):
                      </label>
                      <textarea
                        rows={4}
                        value={answerText}
                        onChange={(e) => handleAnswerChange(qId, e.target.value)}
                        placeholder="Type your response here to receive constructive AI feedback..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        variant="primary"
                        size="xs"
                        onClick={() => handleEvaluateAnswer(q)}
                        isLoading={isEvaluating}
                        disabled={!answerText.trim() || isEvaluating}
                        leftIcon={Sparkles}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        Get AI Feedback
                      </Button>
                    </div>

                    {/* Feedback Results Panel */}
                    {feedback && (
                      <div className="mt-4 p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-3 animate-fade-in">
                        <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                          <div className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-emerald-600" />
                            <h4 className="font-bold text-emerald-900 text-sm">AI Evaluation Feedback</h4>
                          </div>
                          <Badge variant={feedback.score >= 80 ? 'success' : 'warning'} size="xs" className="font-bold">
                            {feedback.score}% Quality Score
                          </Badge>
                        </div>

                        {/* Feedback Overview */}
                        <p className="text-xs text-emerald-800 leading-snug font-medium">
                          "{feedback.feedback}"
                        </p>

                        {/* Strengths & Improvements */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          {feedback.strengths && feedback.strengths.length > 0 && (
                            <div className="p-2.5 rounded-lg bg-white/80 border border-emerald-100 space-y-1">
                              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Key Strengths
                              </span>
                              <ul className="text-[11px] text-slate-700 space-y-0.5 list-disc list-inside">
                                {feedback.strengths.map((s, idx) => (
                                  <li key={idx}>{s}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {feedback.areasForImprovement && feedback.areasForImprovement.length > 0 && (
                            <div className="p-2.5 rounded-lg bg-white/80 border border-amber-100 space-y-1">
                              <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Areas for Growth
                              </span>
                              <ul className="text-[11px] text-slate-700 space-y-0.5 list-disc list-inside">
                                {feedback.areasForImprovement.map((imp, idx) => (
                                  <li key={idx}>{imp}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Sample Improved Answer */}
                        {feedback.sampleImprovedAnswer && (
                          <div className="pt-2 border-t border-emerald-200/80">
                            <span className="text-[11px] font-bold text-emerald-900 block mb-1">
                              Exemplary Model Answer:
                            </span>
                            <p className="text-xs text-slate-800 italic bg-white p-3 rounded-lg border border-emerald-100 leading-relaxed">
                              "{feedback.sampleImprovedAnswer}"
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InterviewPreparation;

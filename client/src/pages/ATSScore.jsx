import React, { useState, useEffect } from 'react';
import {
  getApplicationsApi,
  triggerATSAnalysisApi,
  getMyResumeApi,
} from '../services/api';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonCard } from '../components/ui/SkeletonLoader';
import { useToast } from '../context/ToastContext';
import {
  FileText,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Check,
  ExternalLink,
} from 'lucide-react';

const ATSScore = () => {
  const toast = useToast();
  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState('');
  const [loading, setLoading] = useState(true);

  const [selectedApp, setSelectedApp] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeInfo, setResumeInfo] = useState(null);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const appRes = await getApplicationsApi();
      const list = appRes.data?.data || [];
      setApplications(list);
      if (list.length > 0) {
        setSelectedAppId(list[0]._id);
        setSelectedApp(list[0]);
      }
      const resumeRes = await getMyResumeApi();
      setResumeInfo(resumeRes.data?.data || null);
    } catch (err) {
      console.error('Error loading ATS page data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleSelectApplication = (appId) => {
    setSelectedAppId(appId);
    const found = applications.find((a) => a._id === appId);
    setSelectedApp(found || null);
  };

  const handleRunAnalysis = async () => {
    if (!selectedAppId) {
      toast.info('Please select an application to run ATS analysis');
      return;
    }

    try {
      setAnalyzing(true);
      const res = await triggerATSAnalysisApi(selectedAppId);
      toast.success('AI ATS Compatibility Analysis complete!');
      
      const updatedApp = res.data?.data;
      if (updatedApp) {
        setSelectedApp(updatedApp);
        setApplications((prev) =>
          prev.map((app) => (app._id === updatedApp._id ? updatedApp : app))
        );
      }
    } catch (err) {
      console.error('ATS Analysis error:', err);
      toast.error(err.response?.data?.message || 'Failed to complete ATS Analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  const atsAnalysis = selectedApp?.atsAnalysis || {};
  const atsScore = selectedApp?.atsScore ?? atsAnalysis.score ?? 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            AI Resume & ATS Optimization
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Evaluate resume compatibility, matched keywords, and AI feedback for your job applications.
          </p>
        </div>
      </div>

      {/* Application Selector */}
      <Card variant="default">
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-80">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Select Applied Job Position:
            </label>
            <Select
              value={selectedAppId}
              onChange={(e) => handleSelectApplication(e.target.value)}
              options={applications.map((app) => ({
                value: app._id,
                label: `${app.jobTitle} - ${app.company}`,
              }))}
              fullWidth
            />
          </div>

          <Button
            variant="primary"
            size="md"
            isLoading={analyzing}
            leftIcon={RefreshCw}
            onClick={handleRunAnalysis}
            className="w-full sm:w-auto"
          >
            Run AI ATS Scan
          </Button>
        </CardContent>
      </Card>

      {/* Active Resume Status Card */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" /> Active Resume File
          </CardTitle>
          <CardDescription>Source file evaluated against target job description</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                PDF
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">
                  {resumeInfo?.resume?.originalName || resumeInfo?.resume?.fileName || 'Satya_Pradhan_Resume.pdf'}
                </p>
                <p className="text-xs text-slate-500">
                  Cloudflare R2 Bucket • Private Storage
                </p>
              </div>
            </div>
            {resumeInfo?.signedUrl && (
              <a href={resumeInfo.signedUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="xs" rightIcon={ExternalLink}>
                  View File
                </Button>
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Analysis Card */}
      {loading ? (
        <SkeletonCard />
      ) : !selectedApp ? (
        <EmptyState
          icon={Sparkles}
          title="No job application selected"
          description="Submit an application or select an existing role to view AI ATS analysis."
        />
      ) : (
        <Card variant="default" className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" /> ATS Match Intelligence
              </CardTitle>
              <CardDescription>
                Evaluated for {selectedApp.jobTitle} at {selectedApp.company}
              </CardDescription>
            </div>
            <Badge variant={atsScore >= 75 ? 'success' : atsScore >= 50 ? 'info' : 'warning'} size="md">
              {atsScore}% Compatibility Estimate
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">Estimated Match Quality</span>
                <span className="text-indigo-600">{atsScore} / 100</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${atsScore}%` }}
                />
              </div>
            </div>

            {/* Summary */}
            {atsAnalysis.summary && (
              <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl space-y-1">
                <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                  AI Summary Overview
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {atsAnalysis.summary}
                </p>
              </div>
            )}

            {/* Matched vs Missing Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Matched Skills */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <Check className="w-4 h-4 text-emerald-600" /> Matched Skills ({(atsAnalysis.matchedSkills || []).length})
                </h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(atsAnalysis.matchedSkills || []).length === 0 ? (
                    <span className="text-xs text-slate-400 italic">No direct skill matches detected</span>
                  ) : (
                    (atsAnalysis.matchedSkills || []).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-emerald-700 border border-emerald-200/80 shadow-2xs"
                      >
                        {skill}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4 text-amber-600" /> Missing / Target Skills ({(atsAnalysis.missingSkills || []).length})
                </h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(atsAnalysis.missingSkills || []).length === 0 ? (
                    <span className="text-xs text-emerald-600 font-medium">All key skills matched!</span>
                  ) : (
                    (atsAnalysis.missingSkills || []).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-amber-800 border border-amber-200/80 shadow-2xs"
                      >
                        {skill}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Optimization Suggestions */}
            {Array.isArray(atsAnalysis.suggestions) && atsAnalysis.suggestions.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-slate-900 text-sm">Optimization Suggestions</h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  {atsAnalysis.suggestions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ATSScore;

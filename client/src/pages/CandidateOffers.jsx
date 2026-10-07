import React, { useState, useEffect } from 'react';
import { getApplicationsApi, respondToOfferLetterApi } from '../services/api';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Textarea from '../components/ui/Textarea';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import { useToast } from '../context/ToastContext';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  FileCheck2,
  PartyPopper,
  Printer,
  Sparkles,
  Send,
} from 'lucide-react';

import PrintableOfferLetter from '../components/PrintableOfferLetter';

const CandidateOffers = () => {
  const toast = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Response Modal State
  const [selectedOfferApp, setSelectedOfferApp] = useState(null);
  const [responseType, setResponseType] = useState('Accepted'); // 'Accepted' | 'Rejected'
  const [responseComment, setResponseComment] = useState('');
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Printable Document Modal State
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [activePrintApp, setActivePrintApp] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getApplicationsApi();
      const allApps = res.data?.data || [];
      setApplications(allApps);
    } catch (err) {
      console.error('Error fetching candidate offer letters:', err);
      setError(err.response?.data?.message || 'Failed to load offer letters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openResponseModal = (app, action) => {
    setSelectedOfferApp(app);
    setResponseType(action);
    setResponseComment('');
    setResponseModalOpen(true);
  };

  const handleRespondToOffer = async (e) => {
    e.preventDefault();
    if (!selectedOfferApp) return;

    try {
      setSubmitting(true);
      await respondToOfferLetterApi(selectedOfferApp._id, {
        response: responseType,
        comment: responseComment,
      });

      toast.success(
        responseType === 'Accepted'
          ? '🎉 Offer Accepted! HR Recruiter has been notified.'
          : 'Offer declined. HR Recruiter has been updated.'
      );

      setResponseModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error responding to offer:', err);
      toast.error(err.response?.data?.message || 'Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrintOffer = (app) => {
    setActivePrintApp(app);
    setPrintModalOpen(true);
  };

  const triggerBrowserPrint = () => {
    window.print();
  };

  // Filter only applications where HR has sent an offer letter
  const offerApplications = applications.filter(
    (app) => app.offerDetails && app.offerDetails.offerStatus !== 'None'
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Award className="w-7 h-7 text-purple-600" />
            My Offer Letters
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review official employment offer letters sent to you by employers, check compensation details, and respond directly.
          </p>
        </div>
      </div>

      {loading ? (
        <SkeletonLoader count={2} />
      ) : error ? (
        <ErrorState title="Error Loading Offer Letters" message={error} onRetry={fetchData} />
      ) : offerApplications.length === 0 ? (
        <EmptyState
          title="No offer letters received yet"
          description="When an employer selects you and issues an offer letter, it will appear here in real-time."
          icon={Award}
        />
      ) : (
        <div className="space-y-6">
          {offerApplications.map((app) => {
            const offer = app.offerDetails || {};
            const isPending = offer.offerStatus === 'Sent';
            const isAccepted = offer.offerStatus === 'Accepted';
            const isRejected = offer.offerStatus === 'Rejected';

            return (
              <Card
                key={app._id}
                variant="default"
                className={`overflow-hidden border-2 transition-all ${
                  isPending
                    ? 'border-purple-300 ring-2 ring-purple-500/10 shadow-lg'
                    : isAccepted
                    ? 'border-emerald-200 bg-emerald-50/10'
                    : 'border-slate-200'
                }`}
              >
                {/* Banner Status Top Bar */}
                <div
                  className={`px-6 py-3 text-xs font-bold flex items-center justify-between ${
                    isPending
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                      : isAccepted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-700 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isPending && <PartyPopper className="w-4 h-4 animate-bounce" />}
                    {isAccepted && <CheckCircle2 className="w-4 h-4" />}
                    {isRejected && <XCircle className="w-4 h-4" />}
                    <span>
                      {isPending
                        ? '🎉 ACTION REQUIRED: Official Offer Letter Received!'
                        : isAccepted
                        ? '✅ OFFER ACCEPTED — Congratulations on your new role!'
                        : '❌ Offer Declined'}
                    </span>
                  </div>
                  {offer.sentAt && (
                    <span className="text-[11px] opacity-90 font-medium">
                      Received {new Date(offer.sentAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <CardContent className="p-6 space-y-6">
                  {/* Company & Job Title Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl">
                        <Building2 className="w-7 h-7" />
                      </div>
                      <div>
                        <h2 className="text-xl font-extrabold text-slate-900">
                          {offer.designation || app.jobTitle}
                        </h2>
                        <p className="text-sm font-bold text-slate-600">{app.company}</p>
                        {offer.location && (
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5" /> {offer.location}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="xs"
                        leftIcon={Printer}
                        onClick={() => handlePrintOffer(app)}
                      >
                        Print / Save PDF
                      </Button>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Offered CTC / Salary
                      </span>
                      <p className="text-lg font-black text-emerald-600">{offer.salary || 'As per Discussion'}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Expected Joining Date
                      </span>
                      <p className="text-sm font-bold text-slate-800">
                        {offer.joiningDate
                          ? new Date(offer.joiningDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'To be agreed'}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" /> Offer Valid Until
                      </span>
                      <p className="text-sm font-bold text-slate-800">
                        {offer.expiryDate
                          ? new Date(offer.expiryDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'No strict deadline'}
                      </p>
                    </div>
                  </div>

                  {/* Offer Letter Text Content & Terms */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-purple-600" /> Official Offer Statement & Terms
                    </h3>
                    <div className="p-4 bg-purple-50/40 border border-purple-100 rounded-2xl text-slate-700 text-xs leading-relaxed space-y-2">
                      <p>
                        We are thrilled to offer you the position of <strong>{offer.designation || app.jobTitle}</strong> at <strong>{app.company}</strong>. We were extremely impressed by your experience, technical expertise, and performance during the interview process.
                      </p>
                      {offer.additionalTerms && (
                        <div className="pt-2 border-t border-purple-200/50">
                          <p className="font-semibold text-purple-950 mb-1">Specific Terms & Employer Notes:</p>
                          <p className="italic text-slate-700">"{offer.additionalTerms}"</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions / Response Section */}
                  {isPending ? (
                    <div className="p-4 bg-purple-100/60 border border-purple-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-xs text-purple-950">
                        <p className="font-bold text-sm">Please respond to this offer letter</p>
                        <p className="text-[11px] text-purple-800">
                          Accepting this offer will notify HR and update your application status to Offer Accepted.
                        </p>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button
                          variant="danger"
                          size="sm"
                          leftIcon={XCircle}
                          onClick={() => openResponseModal(app, 'Rejected')}
                        >
                          Decline Offer
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          leftIcon={CheckCircle2}
                          onClick={() => openResponseModal(app, 'Accepted')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        >
                          Accept Offer
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`p-4 border rounded-2xl text-xs space-y-1 ${
                        isAccepted ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <p className="font-bold text-sm flex items-center gap-1.5">
                        {isAccepted ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-slate-600" />}
                        You {offer.offerStatus.toLowerCase()} this offer on{' '}
                        {offer.candidateResponseAt ? new Date(offer.candidateResponseAt).toLocaleString() : 'recently'}.
                      </p>
                      {offer.candidateComment && (
                        <p className="italic text-slate-600">Your note: "{offer.candidateComment}"</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal: Response Confirmation */}
      {selectedOfferApp && (
        <Modal
          isOpen={responseModalOpen}
          onClose={() => setResponseModalOpen(false)}
          title={`${responseType === 'Accepted' ? 'Confirm Acceptance' : 'Decline Offer Letter'}`}
          description={`Offer for ${selectedOfferApp.offerDetails?.designation || selectedOfferApp.jobTitle} at ${selectedOfferApp.company}`}
          size="md"
        >
          <form onSubmit={handleRespondToOffer} className="space-y-4 py-2 text-xs">
            <div
              className={`p-3.5 border rounded-xl font-medium ${
                responseType === 'Accepted'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              {responseType === 'Accepted' ? (
                <p>
                  🎉 You are about to officially <strong>ACCEPT</strong> the offer from <strong>{selectedOfferApp.company}</strong> for CTC of{' '}
                  <strong>{selectedOfferApp.offerDetails?.salary}</strong>. The hiring manager will be notified immediately.
                </p>
              ) : (
                <p>
                  Are you sure you want to <strong>DECLINE</strong> this offer from <strong>{selectedOfferApp.company}</strong>?
                </p>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Optional Message / Note to HR Recruiter
              </label>
              <Textarea
                rows={3}
                value={responseComment}
                onChange={(e) => setResponseComment(e.target.value)}
                placeholder={
                  responseType === 'Accepted'
                    ? 'Thank you for this opportunity! I am excited to join the team...'
                    : 'Thank you for considering me. Unfortunately, I have decided to pursue another path...'
                }
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setResponseModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant={responseType === 'Accepted' ? 'success' : 'danger'}
                size="sm"
                type="submit"
                isLoading={submitting}
                leftIcon={Send}
              >
                Confirm {responseType === 'Accepted' ? 'Acceptance' : 'Decline'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: View & Download Printable Offer Letter Document */}
      {activePrintApp && (
        <Modal
          isOpen={printModalOpen}
          onClose={() => setPrintModalOpen(false)}
          title="Official Offer Letter Document"
          description="Clean printable format. Click Print / Save PDF to download or save as PDF."
          size="xl"
        >
          <div className="space-y-4 py-2">
            <div className="flex justify-end gap-3 no-print border-b border-slate-100 pb-3">
              <Button
                variant="primary"
                size="sm"
                leftIcon={Printer}
                onClick={triggerBrowserPrint}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Print / Save as PDF
              </Button>
            </div>

            {/* Printable Document Preview Container */}
            <div className="overflow-y-auto max-h-[70vh] p-2 bg-slate-100 rounded-xl border border-slate-200">
              <PrintableOfferLetter application={activePrintApp} />
            </div>
          </div>
        </Modal>
      )}

      {/* Hidden container for print mode fallback */}
      {activePrintApp && (
        <div className="hidden print:block">
          <PrintableOfferLetter application={activePrintApp} />
        </div>
      )}
    </div>
  );
};

export default CandidateOffers;

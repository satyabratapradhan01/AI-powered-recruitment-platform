import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getApplicationsApi,
  sendOfferLetterApi,
  getJobsApi,
} from '../../services/api';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Avatar from '../../components/ui/Avatar';
import Textarea from '../../components/ui/Textarea';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { SkeletonTable } from '../../components/ui/SkeletonLoader';
import { useToast } from '../../context/ToastContext';
import {
  Award,
  PlusCircle,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Send,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  UserCheck,
  Printer,
} from 'lucide-react';
import PrintableOfferLetter from '../../components/PrintableOfferLetter';

const HROfferLetters = () => {
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedJobFilter, setSelectedJobFilter] = useState('All');

  // Modal State for Issuing Offer Letter
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState('');
  
  // Offer Form Fields
  const [offerForm, setOfferForm] = useState({
    designation: '',
    salary: '',
    joiningDate: '',
    expiryDate: '',
    location: '',
    additionalTerms: '',
  });

  // Modal State for Viewing Offer Details
  const [viewOfferModalOpen, setViewOfferModalOpen] = useState(false);
  const [selectedOfferApp, setSelectedOfferApp] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [appRes, jobsRes] = await Promise.all([
        getApplicationsApi(),
        getJobsApi(),
      ]);
      const allApps = appRes.data?.data || [];
      setApplications(allApps);
      setJobs(jobsRes.data?.data || []);

      // Check if candidate pre-selected via navigation state (e.g. from HRApplicants)
      if (location.state?.preselectAppId) {
        const targetApp = allApps.find((a) => a._id === location.state.preselectAppId);
        if (targetApp) {
          openProvideOfferModal(targetApp);
        }
      }
    } catch (err) {
      console.error('Error fetching offer letters:', err);
      setError(err.response?.data?.message || 'Failed to load offer letter management data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openProvideOfferModal = (app = null) => {
    if (app) {
      setSelectedApplicationId(app._id);
      setOfferForm({
        designation: app.jobTitle || app.jobId?.title || '',
        salary: app.offerDetails?.salary || '',
        joiningDate: app.offerDetails?.joiningDate ? app.offerDetails.joiningDate.split('T')[0] : '',
        expiryDate: app.offerDetails?.expiryDate ? app.offerDetails.expiryDate.split('T')[0] : '',
        location: app.location || app.jobId?.location || '',
        additionalTerms: app.offerDetails?.additionalTerms || 'Probation period of 3 months applies. Standard company benefits included.',
      });
    } else {
      setSelectedApplicationId('');
      setOfferForm({
        designation: '',
        salary: '',
        joiningDate: '',
        expiryDate: '',
        location: '',
        additionalTerms: 'Probation period of 3 months applies. Standard company benefits included.',
      });
    }
    setIsModalOpen(true);
  };

  const handleApplicationSelect = (appId) => {
    setSelectedApplicationId(appId);
    const target = applications.find((a) => a._id === appId);
    if (target) {
      setOfferForm((prev) => ({
        ...prev,
        designation: target.jobTitle || target.jobId?.title || '',
        location: target.location || target.jobId?.location || '',
      }));
    }
  };

  const handleSendOfferLetter = async (e) => {
    e.preventDefault();
    if (!selectedApplicationId) {
      toast.error('Please select a candidate application');
      return;
    }
    if (!offerForm.salary.trim()) {
      toast.error('Please specify offered salary / CTC');
      return;
    }

    try {
      setSubmitting(true);
      const res = await sendOfferLetterApi(selectedApplicationId, offerForm);
      toast.success('Offer Letter issued! Candidate notified via in-app & email.');
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Send offer letter error:', err);
      toast.error(err.response?.data?.message || 'Failed to send offer letter');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter Applications having Offer Letters or eligible candidates
  const appsWithOffers = applications.filter(
    (app) => app.offerDetails && app.offerDetails.offerStatus !== 'None'
  );

  const filteredOffers = appsWithOffers.filter((app) => {
    const candidate = app.candidateId || {};
    const candName = candidate.name || app.candidateName || 'Applicant';
    const candEmail = candidate.email || '';
    const jobTitle = app.jobTitle || app.jobId?.title || '';

    const matchesJob = selectedJobFilter === 'All' || app.jobId?._id === selectedJobFilter || app.jobId === selectedJobFilter;
    const matchesStatus = statusFilter === 'All' || app.offerDetails?.offerStatus === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      candName.toLowerCase().includes(query) ||
      candEmail.toLowerCase().includes(query) ||
      jobTitle.toLowerCase().includes(query);

    return matchesJob && matchesStatus && matchesQuery;
  });

  // Calculate Metrics
  const totalOffers = appsWithOffers.length;
  const acceptedOffers = appsWithOffers.filter((a) => a.offerDetails?.offerStatus === 'Accepted').length;
  const pendingOffers = appsWithOffers.filter((a) => a.offerDetails?.offerStatus === 'Sent').length;
  const rejectedOffers = appsWithOffers.filter((a) => a.offerDetails?.offerStatus === 'Rejected').length;

  // Candidates available for issuing new offer
  const eligibleApplicants = applications.filter(
    (a) => a.status !== 'Rejected' && a.status !== 'Withdrawn'
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Award className="w-7 h-7 text-purple-600" />
            HR Offer Letter Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate, issue, and track official offer letters extended to candidates in real-time.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={PlusCircle}
          onClick={() => openProvideOfferModal()}
          className="bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20"
        >
          Provide Offer Letter
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="default">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Offers Sent</p>
              <p className="text-xl font-black text-slate-900">{totalOffers}</p>
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Accepted Offers</p>
              <p className="text-xl font-black text-emerald-600">{acceptedOffers}</p>
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pending Candidate Response</p>
              <p className="text-xl font-black text-amber-600">{pendingOffers}</p>
            </div>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="p-3 bg-red-50 rounded-2xl text-red-600">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Declined Offers</p>
              <p className="text-xl font-black text-red-600">{rejectedOffers}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search offer letters by candidate or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={Search}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Select
            value={selectedJobFilter}
            onChange={(e) => setSelectedJobFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Jobs' },
              ...jobs.map((j) => ({ value: j._id, label: j.title })),
            ]}
          />

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Offer Statuses' },
              { value: 'Sent', label: 'Sent / Pending' },
              { value: 'Accepted', label: 'Accepted' },
              { value: 'Rejected', label: 'Declined' },
            ]}
          />
        </div>
      </div>

      {/* Offer Letters Table */}
      <Card variant="default">
        <CardContent className="p-0">
          {loading ? (
            <SkeletonTable rows={5} />
          ) : error ? (
            <ErrorState title="Error Loading Offers" message={error} onRetry={fetchData} />
          ) : filteredOffers.length === 0 ? (
            <EmptyState
              title="No offer letters issued yet"
              description="Issue an official offer letter to top candidates to manage hiring commitments."
              actionLabel="Provide First Offer Letter"
              onAction={() => openProvideOfferModal()}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Position & Company</TableHead>
                  <TableHead>Offered CTC / Salary</TableHead>
                  <TableHead>Joining Date</TableHead>
                  <TableHead>Issued Date</TableHead>
                  <TableHead>Offer Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOffers.map((app) => {
                  const candidate = app.candidateId || {};
                  const candName = candidate.name || app.candidateName || 'Applicant';
                  const candEmail = candidate.email || '';
                  const offer = app.offerDetails || {};

                  let offerVariant = 'purple';
                  if (offer.offerStatus === 'Accepted') offerVariant = 'success';
                  if (offer.offerStatus === 'Rejected') offerVariant = 'danger';

                  return (
                    <TableRow key={app._id}>
                      <TableCell className="font-bold text-slate-900 flex items-center gap-2.5">
                        <Avatar name={candName} size="xs" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{candName}</p>
                          <p className="text-[10px] text-slate-400">{candEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <p className="font-bold text-slate-800">{offer.designation || app.jobTitle}</p>
                        <p className="text-[10px] text-slate-400">{app.company}</p>
                      </TableCell>
                      <TableCell className="text-xs font-black text-emerald-700">
                        {offer.salary || 'N/A'}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        {offer.joiningDate ? new Date(offer.joiningDate).toLocaleDateString() : 'TBD'}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {offer.sentAt ? new Date(offer.sentAt).toLocaleDateString() : 'Recently'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={offerVariant} showDot size="xs">
                          {offer.offerStatus === 'Sent' ? 'Pending Candidate' : offer.offerStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="xs"
                          leftIcon={Eye}
                          onClick={() => {
                            setSelectedOfferApp(app);
                            setViewOfferModalOpen(true);
                          }}
                        >
                          View Offer
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal: Provide / Issue Offer Letter */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Issue Official Job Offer Letter"
        description="Fills out offer parameters and sends an interactive offer letter directly to candidate."
        size="lg"
      >
        <form onSubmit={handleSendOfferLetter} className="space-y-4 py-1 text-xs">
          {/* Candidate Application Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Select Candidate Application <span className="text-red-500">*</span>
            </label>
            <Select
              value={selectedApplicationId}
              onChange={(e) => handleApplicationSelect(e.target.value)}
              options={[
                { value: '', label: '-- Choose candidate from pipeline --' },
                ...eligibleApplicants.map((app) => {
                  const candidateName = app.candidateId?.name || app.candidateName || 'Candidate';
                  const title = app.jobTitle || app.jobId?.title || 'Position';
                  return {
                    value: app._id,
                    label: `${candidateName} — ${title} (${app.company || 'Platform Job'})`,
                  };
                }),
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Designation / Position Title"
              placeholder="e.g. Senior Full Stack Engineer"
              value={offerForm.designation}
              onChange={(e) => setOfferForm({ ...offerForm, designation: e.target.value })}
              required
            />
            <Input
              label="Offered CTC / Salary"
              placeholder="e.g. $120,000 / year or ₹18,00,000 LPA"
              value={offerForm.salary}
              onChange={(e) => setOfferForm({ ...offerForm, salary: e.target.value })}
              leftIcon={DollarSign}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Work Location"
              placeholder="e.g. Remote / San Francisco"
              value={offerForm.location}
              onChange={(e) => setOfferForm({ ...offerForm, location: e.target.value })}
              leftIcon={Building2}
            />
            <Input
              label="Expected Joining Date"
              type="date"
              value={offerForm.joiningDate}
              onChange={(e) => setOfferForm({ ...offerForm, joiningDate: e.target.value })}
              leftIcon={Calendar}
            />
            <Input
              label="Offer Expiry / Deadline"
              type="date"
              value={offerForm.expiryDate}
              onChange={(e) => setOfferForm({ ...offerForm, expiryDate: e.target.value })}
              leftIcon={Calendar}
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Additional Terms & Offer Message
            </label>
            <Textarea
              rows={3}
              value={offerForm.additionalTerms}
              onChange={(e) => setOfferForm({ ...offerForm, additionalTerms: e.target.value })}
              placeholder="Enter welcome note, probation terms, stock options, health insurance benefits..."
            />
          </div>

          {/* Live Offer Letter Preview Box */}
          {selectedApplicationId && (
            <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between border-b border-purple-200/60 pb-2">
                <span className="font-bold text-purple-950 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-600" /> Live Offer Preview
                </span>
                <span className="text-[10px] font-bold bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">
                  Real-time Delivery
                </span>
              </div>
              <p className="text-xs text-purple-900">
                Dear <strong>{applications.find((a) => a._id === selectedApplicationId)?.candidateId?.name || 'Candidate'}</strong>,
                We are excited to extend an offer for <strong>{offerForm.designation || 'this role'}</strong> with a CTC of{' '}
                <span className="font-bold text-emerald-700">{offerForm.salary || '[Salary]'}</span>.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              isLoading={submitting}
              leftIcon={Send}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Send Offer Letter Now
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: View Sent Offer Letter Details */}
      {selectedOfferApp && (
        <Modal
          isOpen={viewOfferModalOpen}
          onClose={() => setViewOfferModalOpen(false)}
          title={`Offer Letter — ${selectedOfferApp.candidateId?.name || 'Candidate'}`}
          description={`Position: ${selectedOfferApp.offerDetails?.designation || selectedOfferApp.jobTitle}`}
          size="lg"
        >
          <div className="space-y-5 py-2 text-xs">
            {/* Offer Header Card */}
            <div className="p-4 bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-purple-200 font-bold">Official Offer Letter</p>
                <h3 className="text-lg font-black">{selectedOfferApp.offerDetails?.designation || selectedOfferApp.jobTitle}</h3>
                <p className="text-xs text-purple-100">{selectedOfferApp.company}</p>
              </div>
              <Badge variant={selectedOfferApp.offerDetails?.offerStatus === 'Accepted' ? 'success' : selectedOfferApp.offerDetails?.offerStatus === 'Rejected' ? 'danger' : 'purple'} size="sm">
                Status: {selectedOfferApp.offerDetails?.offerStatus}
              </Badge>
            </div>

            {/* Offer Action Bar */}
            <div className="flex justify-end no-print">
              <Button
                variant="primary"
                size="xs"
                leftIcon={Printer}
                onClick={() => window.print()}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Print / Save PDF
              </Button>
            </div>

            {/* Offer Key Fields */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Offered CTC / Salary</p>
                <p className="text-sm font-black text-emerald-600">{selectedOfferApp.offerDetails?.salary || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Expected Joining Date</p>
                <p className="text-xs font-bold text-slate-800">
                  {selectedOfferApp.offerDetails?.joiningDate ? new Date(selectedOfferApp.offerDetails.joiningDate).toLocaleDateString() : 'TBD'}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Offer Expiry Date</p>
                <p className="text-xs font-bold text-slate-800">
                  {selectedOfferApp.offerDetails?.expiryDate ? new Date(selectedOfferApp.offerDetails.expiryDate).toLocaleDateString() : 'No expiry'}
                </p>
              </div>
            </div>

            {/* Additional Terms */}
            {selectedOfferApp.offerDetails?.additionalTerms && (
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Terms & Conditions / Note</h4>
                <p className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-700 leading-relaxed italic">
                  "{selectedOfferApp.offerDetails.additionalTerms}"
                </p>
              </div>
            )}

            {/* Candidate Response Info */}
            {selectedOfferApp.offerDetails?.candidateResponseAt && (
              <div className={`p-3.5 border rounded-xl space-y-1 ${selectedOfferApp.offerDetails.offerStatus === 'Accepted' ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-red-50 border-red-200 text-red-950'}`}>
                <p className="font-bold flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" /> Candidate Response: {selectedOfferApp.offerDetails.offerStatus}
                </p>
                <p className="text-[11px]">
                  Responded on {new Date(selectedOfferApp.offerDetails.candidateResponseAt).toLocaleString()}
                </p>
                {selectedOfferApp.offerDetails.candidateComment && (
                  <p className="text-xs italic mt-1">"{selectedOfferApp.offerDetails.candidateComment}"</p>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Hidden print container for HR print mode */}
      {selectedOfferApp && (
        <div className="hidden print:block">
          <PrintableOfferLetter application={selectedOfferApp} />
        </div>
      )}
    </div>
  );
};

export default HROfferLetters;

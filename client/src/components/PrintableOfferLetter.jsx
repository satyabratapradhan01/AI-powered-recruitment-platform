import React from 'react';
import { Building2, Award, CheckCircle2, Calendar, DollarSign, MapPin, ShieldCheck } from 'lucide-react';

/**
 * Clean Corporate Printable Offer Letter Document Component
 * Formatted for A4 / PDF print standard.
 */
const PrintableOfferLetter = ({ application, candidateUser }) => {
  if (!application) return null;

  const offer = application.offerDetails || {};
  const candidate = application.candidateId || candidateUser || {};
  const candidateName = candidate.name || application.candidateName || 'Candidate';
  const candidateEmail = candidate.email || application.email || '';

  const issueDate = offer.sentAt
    ? new Date(offer.sentAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  const joiningDateFormatted = offer.joiningDate
    ? new Date(offer.joiningDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'To be agreed upon onboarding';

  const expiryDateFormatted = offer.expiryDate
    ? new Date(offer.expiryDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  const isAccepted = offer.offerStatus === 'Accepted';

  return (
    <div className="printable-offer-document bg-white text-slate-900 p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-8 font-sans">
      {/* 1. Corporate Letterhead Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b-2 border-slate-900 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-xl shadow-md">
            {application.company ? application.company.charAt(0).toUpperCase() : 'T'}
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
              {application.company || 'NovaTech AI Platform'}
            </h1>
            <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
              Human Resources & Talent Acquisition Department
            </p>
          </div>
        </div>
        <div className="text-left sm:text-right text-xs space-y-1 text-slate-600">
          <p className="font-bold text-slate-900">REF NO: OFF/{new Date().getFullYear()}/{application._id ? application._id.slice(-6).toUpperCase() : '0098'}</p>
          <p>Date of Issue: <strong>{issueDate}</strong></p>
          <p className="text-[11px] text-purple-700 font-semibold">Official Confidential Document</p>
        </div>
      </div>

      {/* 2. Recipient Information */}
      <div className="space-y-1 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
        <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Offer Extended To:</p>
        <h2 className="text-base font-extrabold text-slate-900">{candidateName}</h2>
        {candidateEmail && <p className="text-slate-600">{candidateEmail}</p>}
        {offer.location && <p className="text-slate-500">Location: {offer.location}</p>}
      </div>

      {/* 3. Offer Subject Line */}
      <div className="text-center py-2 bg-purple-50 border-y border-purple-200 rounded-lg">
        <h3 className="text-sm font-black text-purple-950 uppercase tracking-wider">
          Subject: Formal Employment Offer for {offer.designation || application.jobTitle}
        </h3>
      </div>

      {/* 4. Formal Salutation & Body Content */}
      <div className="space-y-4 text-xs leading-relaxed text-slate-800">
        <p>Dear <strong>{candidateName}</strong>,</p>
        <p>
          On behalf of <strong>{application.company || 'our organization'}</strong>, we are thrilled to extend this formal offer of employment for the position of <strong>{offer.designation || application.jobTitle}</strong>. Following our evaluation of your background and technical capabilities, we believe your skills will make a significant contribution to our team.
        </p>
        <p>
          This letter summarizes the key terms and conditions of your employment offer:
        </p>
      </div>

      {/* 5. Key Employment Terms Table */}
      <div className="overflow-hidden border border-slate-300 rounded-xl">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold uppercase text-[10px]">
              <th className="p-3">Employment Parameter</th>
              <th className="p-3">Details & Structure</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-900">
            <tr>
              <td className="p-3 font-bold bg-slate-50 w-1/3">Designation / Role Title</td>
              <td className="p-3 font-extrabold text-purple-900">{offer.designation || application.jobTitle}</td>
            </tr>
            <tr>
              <td className="p-3 font-bold bg-slate-50">Offered CTC / Compensation</td>
              <td className="p-3 font-black text-emerald-700 text-sm">{offer.salary || 'As per Discussion'}</td>
            </tr>
            <tr>
              <td className="p-3 font-bold bg-slate-50">Expected Date of Joining</td>
              <td className="p-3 font-semibold">{joiningDateFormatted}</td>
            </tr>
            <tr>
              <td className="p-3 font-bold bg-slate-50">Work Location</td>
              <td className="p-3 font-semibold">{offer.location || application.location || 'Company Headquarters / Remote'}</td>
            </tr>
            {offer.expiryDate && (
              <tr>
                <td className="p-3 font-bold bg-slate-50">Offer Acceptance Deadline</td>
                <td className="p-3 font-semibold text-amber-700">{expiryDateFormatted}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 6. Additional Terms & Notes */}
      {offer.additionalTerms && (
        <div className="space-y-1.5 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
          <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Specific Terms & Employer Notes:</h4>
          <p className="italic text-slate-700 leading-relaxed">"{offer.additionalTerms}"</p>
        </div>
      )}

      {/* 7. Standard Terms Summary */}
      <div className="space-y-2 text-[11px] text-slate-600 leading-normal border-t border-slate-200 pt-4">
        <p className="font-bold text-slate-800">Employment Requirements & Confidentiality:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>This offer is subject to background verification and successful submission of educational & experience documentation.</li>
          <li>You will be required to sign the standard Non-Disclosure Agreement (NDA) and Company Code of Conduct upon joining.</li>
          <li>Standard company benefits including health coverage and paid leave will be detailed in your employment contract.</li>
        </ul>
      </div>

      {/* 8. Signatures Block */}
      <div className="pt-8 grid grid-cols-2 gap-8 text-xs border-t-2 border-slate-900">
        {/* Employer Signature */}
        <div className="space-y-4">
          <p className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">For & On Behalf of {application.company}:</p>
          <div className="h-12 flex items-end">
            <div className="font-serif text-lg italic text-purple-900 border-b border-slate-400 pb-1 w-48">
              Authorized Signatory
            </div>
          </div>
          <div>
            <p className="font-extrabold text-slate-900">Talent Acquisition & HR Team</p>
            <p className="text-slate-500">{application.company}</p>
          </div>
        </div>

        {/* Candidate Acceptance Signature */}
        <div className="space-y-4">
          <p className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Candidate Acceptance & Confirmation:</p>
          <div className="h-12 flex items-end">
            <div className="font-serif text-base italic text-slate-800 border-b border-slate-400 pb-1 w-48">
              {isAccepted ? candidateName : '______________________'}
            </div>
          </div>
          <div>
            <p className="font-extrabold text-slate-900">{candidateName}</p>
            <p className="text-slate-500">
              {isAccepted
                ? `Accepted on ${new Date(offer.candidateResponseAt || Date.now()).toLocaleDateString()}`
                : 'Pending Candidate Signature'}
            </p>
          </div>
        </div>
      </div>

      {/* 9. Footer Footer Watermark */}
      <div className="text-center border-t border-slate-100 pt-4 text-[10px] text-slate-400">
        <p>This is an official document generated via TalentAI Recruitment Platform. Valid without physical stamp when digitally accepted.</p>
      </div>
    </div>
  );
};

export default PrintableOfferLetter;

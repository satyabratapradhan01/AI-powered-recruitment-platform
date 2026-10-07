import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import Card, { CardContent, CardFooter } from './ui/Card';
import Button from './ui/Button';
import ConfirmationDialog from './ui/ConfirmationDialog';
import { MapPin, Calendar, ExternalLink, Trash2 } from 'lucide-react';

const ApplicationCard = ({ application, onDelete, isDeleting = false }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const formattedDate = application.appliedDate
    ? new Date(application.appliedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A';

  const handleDeleteConfirm = () => {
    onDelete(application._id);
    setShowDeleteModal(false);
  };

  return (
    <>
      <Card variant="interactive" className="flex flex-col justify-between h-full group">
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-0.5">
              <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition">
                {application.jobTitle}
              </h3>
              <p className="text-xs font-semibold text-slate-600">{application.company}</p>
            </div>
            <StatusBadge status={application.status} />
          </div>

          <div className="space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
            {application.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{application.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Applied on {formattedDate}</span>
            </div>
            {application.jobUrl && (
              <div className="pt-1">
                <a
                  href={application.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                >
                  <span>Job Posting</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
            {application.offerDetails && application.offerDetails.offerStatus !== 'None' && (
              <div className="pt-2">
                <Link
                  to="/offers"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-xs font-bold hover:bg-purple-100 transition"
                >
                  <span>🎉 View Offer Letter</span>
                </Link>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="justify-end">
          <Button
            variant="ghost"
            size="xs"
            leftIcon={Trash2}
            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            isLoading={isDeleting}
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </Button>
        </CardFooter>
      </Card>

      <ConfirmationDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Application"
        description={`Are you sure you want to delete the application for "${application.jobTitle}" at ${application.company}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
};

export default ApplicationCard;

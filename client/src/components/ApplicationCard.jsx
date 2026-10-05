import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const ApplicationCard = ({ application, onDelete, isDeleting = false }) => {
  const formattedDate = application.appliedDate
    ? new Date(application.appliedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A';

  return (
    <div
      className={`bg-white border rounded-lg p-5 shadow-sm transition flex flex-col justify-between ${
        isDeleting ? 'opacity-60 border-red-200 bg-red-50/20' : 'border-gray-200 hover:shadow-md'
      }`}
    >
      <div>
        <div className="flex items-start justify-between">
          <div className="pr-2">
            <h3 className="font-bold text-gray-900 text-lg leading-snug">{application.jobTitle}</h3>
            <p className="text-indigo-600 font-semibold text-sm mt-0.5">{application.company}</p>
          </div>
          <StatusBadge status={application.status} />
        </div>

        <div className="mt-4 space-y-1.5 text-xs text-gray-600">
          {application.location && (
            <div className="flex items-center space-x-1">
              <span className="font-medium text-gray-500">📍 Location:</span>
              <span>{application.location}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <span className="font-medium text-gray-500">📅 Applied:</span>
            <span>{formattedDate}</span>
          </div>
          {application.jobUrl && (
            <div className="pt-1">
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline inline-flex items-center font-medium"
              >
                View Job Posting ↗
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-end space-x-3">
        <Link
          to={`/applications/${application._id}/edit`}
          className={`px-3 py-1.5 text-xs font-medium border rounded-md transition ${
            isDeleting
              ? 'pointer-events-none opacity-50 text-gray-400 border-gray-200'
              : 'text-indigo-600 hover:bg-indigo-50 border-indigo-200'
          }`}
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(application._id)}
          disabled={isDeleting}
          className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded-md transition disabled:opacity-60 flex items-center space-x-1.5"
        >
          {isDeleting ? (
            <>
              <span className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
              <span>Deleting...</span>
            </>
          ) : (
            <span>Delete</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;

import AppError from '../utils/AppError.js';

/**
 * Request Validation Middleware.
 */

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new AppError('Please provide name, email, and password', 400));
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  next();
};

export const validateApplicationCreate = (req, res, next) => {
  const { jobId, company, jobTitle } = req.body;
  if (!jobId && (!company || !jobTitle)) {
    return next(
      new AppError('Please provide jobId or both company and jobTitle', 400)
    );
  }
  next();
};

export const validateApplicationUpdate = (req, res, next) => {
  const { status } = req.body;
  const allowedStatuses = [
    'Applied',
    'Under Review',
    'Shortlisted',
    'Interview Scheduled',
    'Interview Completed',
    'Selected',
    'Rejected',
    'Withdrawn',
    'Interview',
    'Offer',
    'Offer Extended',
    'Offer Accepted',
    'Offer Rejected',
  ];

  if (status && !allowedStatuses.includes(status)) {
    return next(
      new AppError(`Invalid status. Allowed values are: ${allowedStatuses.join(', ')}`, 400)
    );
  }
  next();
};

export const validateJobCreate = (req, res, next) => {
  const { title, company, description } = req.body;
  if (!title || !company || !description) {
    return next(
      new AppError('Please provide job title, company, and description', 400)
    );
  }
  next();
};

export const validateJobUpdate = (req, res, next) => {
  const { status, workMode, employmentType } = req.body;

  if (status && !['Active', 'Draft', 'Closed'].includes(status)) {
    return next(new AppError('Invalid status. Allowed values: Active, Draft, Closed', 400));
  }

  if (workMode && !['On-site', 'Hybrid', 'Remote'].includes(workMode)) {
    return next(new AppError('Invalid workMode. Allowed values: On-site, Hybrid, Remote', 400));
  }

  if (
    employmentType &&
    !['Full-time', 'Part-time', 'Contract', 'Internship'].includes(employmentType)
  ) {
    return next(
      new AppError(
        'Invalid employmentType. Allowed values: Full-time, Part-time, Contract, Internship',
        400
      )
    );
  }

  next();
};

export const validateInterviewSchedule = (req, res, next) => {
  const { applicationId, interviewDate, interviewTime } = req.body;
  if (!applicationId || !interviewDate || !interviewTime) {
    return next(
      new AppError('Please provide applicationId, interviewDate, and interviewTime', 400)
    );
  }
  next();
};

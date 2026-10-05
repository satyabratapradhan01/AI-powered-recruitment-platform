import Interview from '../models/Interview.js';
import JobApplication from '../models/JobApplication.js';
import AppError from '../utils/AppError.js';

/**
 * Interview Scheduling Business Logic & Database Service.
 */

export const scheduleInterview = async (recruiterId, userRole, data) => {
  const {
    applicationId,
    interviewDate,
    interviewTime,
    duration,
    interviewType,
    meetingLink,
    interviewerName,
    notes,
  } = data;

  const application = await JobApplication.findById(applicationId).populate('jobId');
  if (!application) {
    throw new AppError('Job application not found', 404);
  }

  // RBAC ownership check: HR must own the job posting (or admin)
  if (userRole !== 'admin') {
    if (application.jobId && application.jobId.postedBy) {
      const posterId = application.jobId.postedBy._id
        ? application.jobId.postedBy._id.toString()
        : application.jobId.postedBy.toString();

      if (posterId !== recruiterId.toString()) {
        throw new AppError(
          'Forbidden: You can only schedule interviews for applications on your own job postings',
          403
        );
      }
    }
  }

  const candidateId = application.candidateId || application.userId;
  if (!candidateId) {
    throw new AppError('Candidate user ID missing on this application', 400);
  }

  const interview = await Interview.create({
    applicationId,
    candidateId,
    recruiterId,
    interviewDate: new Date(interviewDate),
    interviewTime,
    duration: duration ? Number(duration) : 45,
    interviewType: interviewType || 'Technical',
    meetingLink: meetingLink || '',
    interviewerName: interviewerName || '',
    notes: notes || '',
    status: 'Scheduled',
  });

  // Synchronize application status
  application.status = 'Interview Scheduled';
  await application.save();

  return await Interview.findById(interview._id)
    .populate({
      path: 'applicationId',
      populate: { path: 'jobId' },
    })
    .populate('candidateId', 'name email profile')
    .populate('recruiterId', 'name email profile.companyName');
};

export const rescheduleInterview = async (interviewId, recruiterId, userRole, data) => {
  const interview = await Interview.findById(interviewId);
  if (!interview) {
    throw new AppError('Interview not found', 404);
  }

  if (userRole !== 'admin' && interview.recruiterId.toString() !== recruiterId.toString()) {
    throw new AppError('Forbidden: You can only reschedule your own interviews', 403);
  }

  const { interviewDate, interviewTime, duration, meetingLink, interviewerName, notes } = data;

  if (interviewDate) interview.interviewDate = new Date(interviewDate);
  if (interviewTime) interview.interviewTime = interviewTime;
  if (duration !== undefined) interview.duration = Number(duration);
  if (meetingLink !== undefined) interview.meetingLink = meetingLink;
  if (interviewerName !== undefined) interview.interviewerName = interviewerName;
  if (notes !== undefined) interview.notes = notes;

  interview.status = 'Rescheduled';
  const updatedInterview = await interview.save();

  // Synchronize application status
  const application = await JobApplication.findById(interview.applicationId);
  if (application) {
    application.status = 'Interview Scheduled';
    await application.save();
  }

  return await Interview.findById(updatedInterview._id)
    .populate({
      path: 'applicationId',
      populate: { path: 'jobId' },
    })
    .populate('candidateId', 'name email profile')
    .populate('recruiterId', 'name email profile.companyName');
};

export const completeInterview = async (interviewId, recruiterId, userRole, data = {}) => {
  const interview = await Interview.findById(interviewId);
  if (!interview) {
    throw new AppError('Interview not found', 404);
  }

  if (userRole !== 'admin' && interview.recruiterId.toString() !== recruiterId.toString()) {
    throw new AppError('Forbidden: You can only complete your own interviews', 403);
  }

  if (data.notes !== undefined) interview.notes = data.notes;
  interview.status = 'Completed';
  await interview.save();

  // Synchronize application status
  const application = await JobApplication.findById(interview.applicationId);
  if (application) {
    application.status = 'Interview Completed';
    await application.save();
  }

  return await Interview.findById(interview._id)
    .populate({
      path: 'applicationId',
      populate: { path: 'jobId' },
    })
    .populate('candidateId', 'name email profile')
    .populate('recruiterId', 'name email profile.companyName');
};

export const cancelInterview = async (interviewId, recruiterId, userRole, data = {}) => {
  const interview = await Interview.findById(interviewId);
  if (!interview) {
    throw new AppError('Interview not found', 404);
  }

  if (userRole !== 'admin' && interview.recruiterId.toString() !== recruiterId.toString()) {
    throw new AppError('Forbidden: You can only cancel your own interviews', 403);
  }

  if (data.notes !== undefined) interview.notes = data.notes;
  interview.status = 'Cancelled';
  await interview.save();

  return await Interview.findById(interview._id)
    .populate({
      path: 'applicationId',
      populate: { path: 'jobId' },
    })
    .populate('candidateId', 'name email profile')
    .populate('recruiterId', 'name email profile.companyName');
};

export const getInterviews = async (userId, userRole, queryParams = {}) => {
  const { status, upcoming } = queryParams;

  const query = {};

  if (userRole === 'hr') {
    query.recruiterId = userId;
  } else if (userRole === 'admin') {
    // Admin sees all
  } else {
    // Candidate sees own interviews
    query.candidateId = userId;
  }

  if (status) {
    query.status = status;
  } else if (upcoming === 'true' || upcoming === true) {
    query.status = { $in: ['Scheduled', 'Rescheduled'] };
  }

  return await Interview.find(query)
    .populate({
      path: 'applicationId',
      populate: { path: 'jobId' },
    })
    .populate('candidateId', 'name email profile skills education experience')
    .populate('recruiterId', 'name email profile.companyName')
    .sort({ interviewDate: 1 });
};

export const getInterviewById = async (interviewId, userId, userRole) => {
  const interview = await Interview.findById(interviewId)
    .populate({
      path: 'applicationId',
      populate: { path: 'jobId' },
    })
    .populate('candidateId', 'name email profile skills education experience')
    .populate('recruiterId', 'name email profile.companyName');

  if (!interview) {
    throw new AppError('Interview not found', 404);
  }

  const isCandidate = interview.candidateId._id.toString() === userId.toString();
  const isRecruiter = interview.recruiterId._id.toString() === userId.toString();
  const isAdmin = userRole === 'admin';

  if (!isCandidate && !isRecruiter && !isAdmin) {
    throw new AppError('Forbidden: Access denied to view this interview', 403);
  }

  return interview;
};

import JobApplication from '../models/JobApplication.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import {
  sendApplicationSubmittedEmail,
  sendApplicationStatusUpdateEmail,
  sendOfferLetterEmail,
  sendOfferResponseEmail,
} from './emailService.js';
import { createNotification } from './notificationService.js';
import { analyzeResumeATS } from './aiService.js';

/**
 * Recruitment Application Business Logic & Database Service.
 */

export const createApplication = async (userId, data) => {
  const { jobId, company, jobTitle, location, jobUrl, coverLetter, resume, status, appliedDate } = data;

  const candidateUser = await User.findById(userId);

  // Use passed resume or pull candidate's default uploaded resume metadata
  let resumeData = resume;
  if ((!resumeData || !resumeData.parsedText) && candidateUser && candidateUser.resume && candidateUser.resume.parsedText) {
    resumeData = {
      fileUrl: candidateUser.resume.fileUrl,
      fileName: candidateUser.resume.fileName,
      fileKey: candidateUser.resume.fileKey,
      parsedText: candidateUser.resume.parsedText,
    };
  }

  let application;

  // 1. If applying for a platform Job Posting (jobId provided)
  if (jobId) {
    const job = await Job.findById(jobId);
    if (!job) {
      throw new AppError('Job posting not found', 404);
    }

    if (job.status === 'Closed') {
      throw new AppError('This job posting is closed and no longer accepting applications', 400);
    }

    // Prevent Duplicate Applications for the same job posting
    const existingApp = await JobApplication.findOne({
      jobId,
      $or: [{ candidateId: userId }, { userId }],
    });

    if (existingApp) {
      throw new AppError('You have already applied for this job posting', 400);
    }

    application = await JobApplication.create({
      jobId,
      candidateId: userId,
      userId,
      company: job.company,
      jobTitle: job.title,
      location: job.location || location || '',
      resume: resumeData || {},
      coverLetter: coverLetter || '',
      status: 'Applied',
      appliedDate: appliedDate ? new Date(appliedDate) : new Date(),
      appliedAt: new Date(),
    });

    // Run AI-powered ATS Analysis
    try {
      const atsResult = await analyzeResumeATS({
        resumeText: resumeData?.parsedText || '',
        jobDescription: job.description || '',
        requiredSkills: job.requiredSkills || [],
        preferredSkills: job.preferredSkills || [],
        experienceRequired: job.experienceRequired || '',
      });
      application.atsScore = atsResult.score;
      application.atsAnalysis = atsResult;
      await application.save();
    } catch (atsErr) {
      console.error('[Application Service] ATS Analysis error during application creation:', atsErr.message);
    }

    // Create in-app notification for candidate
    await createNotification({
      userId,
      type: 'application_status',
      title: 'Application Submitted',
      message: `Your application for ${job.title} at ${job.company} was submitted successfully.`,
      relatedApplicationId: application._id,
    });

    // Create in-app notification for HR recruiter
    if (job.postedBy) {
      await createNotification({
        userId: job.postedBy,
        type: 'new_applicant',
        title: 'New Applicant Submission',
        message: `${candidateUser?.name || 'A candidate'} submitted an application for ${job.title}${application.atsScore ? ` with ${application.atsScore}% AI ATS Match.` : '.'}`,
        relatedApplicationId: application._id,
      });
    }

    // Trigger email notification to candidate
    if (candidateUser && candidateUser.email) {
      sendApplicationSubmittedEmail({
        candidateEmail: candidateUser.email,
        candidateName: candidateUser.name,
        company: job.company,
        jobTitle: job.title,
      }).catch((err) => console.error('Email error:', err.message));
    }

    return application;
  }

  // 2. Custom application entry (no jobId provided)
  application = await JobApplication.create({
    candidateId: userId,
    userId,
    company,
    jobTitle,
    location: location || '',
    jobUrl: jobUrl || '',
    coverLetter: coverLetter || '',
    resume: resumeData || {},
    status: status || 'Applied',
    appliedDate: appliedDate ? new Date(appliedDate) : new Date(),
    appliedAt: new Date(),
  });

  // Automatically run initial ATS analysis for custom entry if resume text is present
  if (resumeData?.parsedText) {
    try {
      const atsResult = await analyzeResumeATS({
        resumeText: resumeData.parsedText,
        jobDescription: `${company} - ${jobTitle} position requirements and responsibilities.`,
        requiredSkills: candidateUser?.skills || [],
        preferredSkills: [],
        experienceRequired: 'Software development experience',
      });
      application.atsScore = atsResult.score;
      application.atsAnalysis = atsResult;
      await application.save();
    } catch (_) {}
  }

  return application;
};

export const getApplications = async (userId, userRole, queryParams = {}) => {
  const { jobId, status, sort, sortBy } = queryParams;

  const sortParam = sort || sortBy || '-createdAt';
  let sortObject = { createdAt: -1 };
  if (sortParam === 'matchScore' || sortParam === '-matchScore' || sortParam === 'atsScore' || sortParam === '-atsScore') {
    sortObject = { atsScore: sortParam.startsWith('-') || sortParam === 'matchScore' || sortParam === 'atsScore' ? -1 : 1 };
  } else if (sortParam === 'createdAt') {
    sortObject = { createdAt: 1 };
  }

  // HR Applications View: List candidates who applied to HR's posted jobs
  if (userRole === 'hr') {
    if (jobId) {
      const job = await Job.findById(jobId);
      if (!job || job.postedBy.toString() !== userId.toString()) {
        throw new AppError('Forbidden: You can only view applicants for your own job postings', 403);
      }
      const query = { jobId };
      if (status) query.status = status;
      return await JobApplication.find(query)
        .populate('jobId')
        .populate('candidateId', 'name email profile skills education experience resume accountStatus')
        .sort(sortObject);
    }

    // Get all jobs posted by this HR
    const hrJobs = await Job.find({ postedBy: userId }).select('_id');
    const hrJobIds = hrJobs.map((j) => j._id);

    const query = { jobId: { $in: hrJobIds } };
    if (status) query.status = status;

    return await JobApplication.find(query)
      .populate('jobId')
      .populate('candidateId', 'name email profile skills education experience resume accountStatus')
      .sort(sortObject);
  }

  // Admin View: All applications
  if (userRole === 'admin') {
    const query = {};
    if (jobId) query.jobId = jobId;
    if (status) query.status = status;

    return await JobApplication.find(query)
      .populate('jobId')
      .populate('candidateId', 'name email profile skills education experience resume accountStatus')
      .sort(sortObject);
  }

  // Candidate / Job Seeker View: Own applications
  const query = {
    $or: [{ candidateId: userId }, { userId }],
  };
  if (jobId) query.jobId = jobId;
  if (status) query.status = status;

  return await JobApplication.find(query)
    .populate('jobId')
    .sort({ createdAt: -1 });
};

export const getApplicationById = async (id, userId, userRole) => {
  const application = await JobApplication.findById(id)
    .populate('jobId')
    .populate('candidateId', 'name email profile skills education experience resume accountStatus');

  if (!application) {
    throw new AppError('Job application not found', 404);
  }

  const isCandidateOwner =
    (application.candidateId && application.candidateId._id.toString() === userId.toString()) ||
    (application.userId && application.userId.toString() === userId.toString());

  let isHROwner = false;
  if (application.jobId && application.jobId.postedBy) {
    const posterId = application.jobId.postedBy._id
      ? application.jobId.postedBy._id.toString()
      : application.jobId.postedBy.toString();
    isHROwner = posterId === userId.toString();
  }

  const isAdmin = userRole === 'admin';

  if (!isCandidateOwner && !isHROwner && !isAdmin) {
    throw new AppError('Forbidden: You do not have permission to view this application', 403);
  }

  return application;
};

export const updateApplication = async (id, userId, userRole, updateData) => {
  const application = await JobApplication.findById(id).populate('jobId');

  if (!application) {
    throw new AppError('Job application not found', 404);
  }

  const isCandidateOwner =
    (application.candidateId && application.candidateId.toString() === userId.toString()) ||
    (application.userId && application.userId.toString() === userId.toString());

  let isHROwner = false;
  if (application.jobId && application.jobId.postedBy) {
    isHROwner = application.jobId.postedBy.toString() === userId.toString();
  }

  const isAdmin = userRole === 'admin';

  if (!isCandidateOwner && !isHROwner && !isAdmin) {
    throw new AppError('Forbidden: Access denied to update this application', 403);
  }

  const oldStatus = application.status;
  const { status, recruiterNotes, company, jobTitle, location, jobUrl, coverLetter } = updateData;

  // Status transition validation
  if (status) {
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
    ];

    if (!allowedStatuses.includes(status)) {
      throw new AppError(
        `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`,
        400
      );
    }

    // For recruitment platform applications (where jobId is present), candidate can only set status to 'Withdrawn'
    if (isCandidateOwner && !isHROwner && !isAdmin) {
      if (application.jobId && status !== 'Withdrawn') {
        throw new AppError('Candidates are only allowed to withdraw platform job applications', 403);
      }
    }

    application.status = status;
  }

  // Recruiter notes update (HR or Admin only)
  if (recruiterNotes !== undefined) {
    if (!isHROwner && !isAdmin) {
      throw new AppError('Only recruiters or admins can add recruiter notes', 403);
    }
    application.recruiterNotes = recruiterNotes;
  }

  if (company !== undefined) application.company = company;
  if (jobTitle !== undefined) application.jobTitle = jobTitle;
  if (location !== undefined) application.location = location;
  if (jobUrl !== undefined) application.jobUrl = jobUrl;
  if (coverLetter !== undefined) application.coverLetter = coverLetter;

  const updatedApplication = await application.save();

  // Trigger status change notification if status changed
  if (oldStatus !== updatedApplication.status) {
    const targetUserId = updatedApplication.candidateId || updatedApplication.userId;

    await createNotification({
      userId: targetUserId,
      type: 'application_status',
      title: `Application Status: ${updatedApplication.status}`,
      message: `Your application for ${updatedApplication.jobTitle} at ${updatedApplication.company} has been updated to ${updatedApplication.status}.`,
      relatedApplicationId: updatedApplication._id,
    });

    const candidateUser = await User.findById(targetUserId);
    if (candidateUser && candidateUser.email) {
      sendApplicationStatusUpdateEmail({
        candidateEmail: candidateUser.email,
        candidateName: candidateUser.name,
        company: updatedApplication.company,
        jobTitle: updatedApplication.jobTitle,
        oldStatus,
        newStatus: updatedApplication.status,
        recruiterNotes: updatedApplication.recruiterNotes,
      }).catch((err) => console.error('Email status error:', err.message));
    }
  }

  return updatedApplication;
};

export const withdrawApplication = async (id, userId) => {
  const application = await JobApplication.findOne({
    _id: id,
    $or: [{ candidateId: userId }, { userId }],
  });

  if (!application) {
    throw new AppError('Job application not found', 404);
  }

  const oldStatus = application.status;
  application.status = 'Withdrawn';
  await application.save();

  if (oldStatus !== 'Withdrawn') {
    await createNotification({
      userId,
      type: 'application_status',
      title: 'Application Withdrawn',
      message: `Your application for ${application.jobTitle} at ${application.company} has been withdrawn.`,
      relatedApplicationId: application._id,
    });

    const candidateUser = await User.findById(userId);
    if (candidateUser && candidateUser.email) {
      sendApplicationStatusUpdateEmail({
        candidateEmail: candidateUser.email,
        candidateName: candidateUser.name,
        company: application.company,
        jobTitle: application.jobTitle,
        oldStatus,
        newStatus: 'Withdrawn',
      }).catch((err) => console.error('Email error:', err.message));
    }
  }

  return application;
};

export const deleteApplication = async (id, userId, userRole) => {
  const application = await JobApplication.findById(id).populate('jobId');

  if (!application) {
    throw new AppError('Job application not found', 404);
  }

  const isCandidateOwner =
    (application.candidateId && application.candidateId.toString() === userId.toString()) ||
    (application.userId && application.userId.toString() === userId.toString());

  let isHROwner = false;
  if (application.jobId && application.jobId.postedBy) {
    isHROwner = application.jobId.postedBy.toString() === userId.toString();
  }

  const isAdmin = userRole === 'admin';

  if (!isCandidateOwner && !isHROwner && !isAdmin) {
    throw new AppError('Forbidden: Access denied to delete this application', 403);
  }

  await application.deleteOne();
  return { _id: id };
};

export const triggerATSAnalysis = async (id, userId, userRole) => {
  const application = await JobApplication.findById(id)
    .populate('jobId')
    .populate('candidateId');

  if (!application) {
    throw new AppError('Job application not found', 404);
  }

  const isCandidateOwner =
    (application.candidateId && application.candidateId._id.toString() === userId.toString()) ||
    (application.userId && application.userId.toString() === userId.toString());

  let isHROwner = false;
  if (application.jobId && application.jobId.postedBy) {
    const posterId = application.jobId.postedBy._id
      ? application.jobId.postedBy._id.toString()
      : application.jobId.postedBy.toString();
    isHROwner = posterId === userId.toString();
  }

  const isAdmin = userRole === 'admin';

  if (!isCandidateOwner && !isHROwner && !isAdmin) {
    throw new AppError('Forbidden: Access denied to trigger ATS analysis on this application', 403);
  }

  const candidateUser = await User.findById(
    application.candidateId?._id || application.candidateId || application.userId || userId
  );

  let resumeText =
    application.resume?.parsedText ||
    candidateUser?.resume?.parsedText ||
    '';

  if ((!application.resume || !application.resume.parsedText) && candidateUser && candidateUser.resume) {
    application.resume = {
      fileUrl: candidateUser.resume.fileUrl,
      fileName: candidateUser.resume.fileName,
      fileKey: candidateUser.resume.fileKey,
      parsedText: candidateUser.resume.parsedText,
    };
    resumeText = candidateUser.resume.parsedText || '';
  }

  const job = application.jobId || {};
  const jobDescription = job.description || `${application.company} ${application.jobTitle} position requirements and responsibilities.`;
  const requiredSkills = job.requiredSkills && job.requiredSkills.length > 0
    ? job.requiredSkills
    : (candidateUser?.skills || []);
  const preferredSkills = job.preferredSkills || [];
  const experienceRequired = job.experienceRequired || 'Software development experience';

  const atsResult = await analyzeResumeATS({
    resumeText,
    jobDescription,
    requiredSkills,
    preferredSkills,
    experienceRequired,
  });

  application.atsScore = atsResult.score;
  application.atsAnalysis = atsResult;
  await application.save();

  return application;
};

/**
 * HR / Admin Issues and Sends Offer Letter to Candidate
 */
export const sendOfferLetter = async (id, userId, userRole, offerData) => {
  const { salary, designation, joiningDate, expiryDate, location, additionalTerms } = offerData;

  if (!salary) {
    throw new AppError('Salary / CTC is required to send an offer letter', 400);
  }

  const application = await JobApplication.findById(id)
    .populate('jobId')
    .populate('candidateId', 'name email profile');

  if (!application) {
    throw new AppError('Job application not found', 404);
  }

  const isHROwner = application.jobId && application.jobId.postedBy && application.jobId.postedBy.toString() === userId.toString();
  const isAdmin = userRole === 'admin';

  if (!isHROwner && !isAdmin) {
    throw new AppError('Forbidden: Only the HR recruiter who posted the job or an admin can send offer letters', 403);
  }

  const candidateUser = await User.findById(application.candidateId?._id || application.candidateId || application.userId);

  if (!candidateUser) {
    throw new AppError('Candidate details not found for this application', 404);
  }

  // Update offerDetails and application status
  application.offerDetails = {
    salary: salary || '',
    designation: designation || application.jobTitle || application.jobId?.title || '',
    joiningDate: joiningDate ? new Date(joiningDate) : null,
    expiryDate: expiryDate ? new Date(expiryDate) : null,
    location: location || application.location || application.jobId?.location || '',
    additionalTerms: additionalTerms || '',
    sentAt: new Date(),
    offerStatus: 'Sent',
    candidateResponseAt: null,
    candidateComment: '',
  };

  application.status = 'Offer';
  const updatedApplication = await application.save();

  // Create real-time in-app notification for Candidate
  await createNotification({
    userId: candidateUser._id,
    type: 'application_status',
    title: '🎉 Job Offer Letter Received!',
    message: `Congratulations! ${application.company || application.jobId?.company} has extended an official Offer Letter for the position of ${designation || application.jobTitle}.`,
    relatedApplicationId: updatedApplication._id,
  });

  // Trigger real-time Email Notification to Candidate
  if (candidateUser.email) {
    sendOfferLetterEmail({
      candidateEmail: candidateUser.email,
      candidateName: candidateUser.name,
      company: application.company || application.jobId?.company || 'Company',
      jobTitle: application.jobTitle || application.jobId?.title || 'Position',
      designation: designation || application.jobTitle || application.jobId?.title,
      salary,
      joiningDate,
      expiryDate,
      additionalTerms,
    }).catch((err) => console.error('Offer Email Error:', err.message));
  }

  return updatedApplication;
};

/**
 * Candidate Responds (Accept / Reject) to Offer Letter
 */
export const respondToOfferLetter = async (id, userId, userRole, responseData) => {
  const { response, comment } = responseData;

  if (!['Accepted', 'Rejected'].includes(response)) {
    throw new AppError('Invalid response. Response must be either "Accepted" or "Rejected"', 400);
  }

  const application = await JobApplication.findById(id)
    .populate('jobId')
    .populate('candidateId', 'name email');

  if (!application) {
    throw new AppError('Job application not found', 404);
  }

  const isCandidateOwner =
    (application.candidateId && application.candidateId._id.toString() === userId.toString()) ||
    (application.userId && application.userId.toString() === userId.toString());

  if (!isCandidateOwner && userRole !== 'admin') {
    throw new AppError('Forbidden: Only the candidate who received this offer can respond', 403);
  }

  if (!application.offerDetails || application.offerDetails.offerStatus === 'None') {
    throw new AppError('No offer letter has been issued for this application yet', 400);
  }

  // Update offerDetails & Application status
  application.offerDetails.offerStatus = response;
  application.offerDetails.candidateResponseAt = new Date();
  application.offerDetails.candidateComment = comment || '';

  const newStatus = response === 'Accepted' ? 'Offer Accepted' : 'Offer Rejected';
  application.status = newStatus;

  const updatedApplication = await application.save();

  // Create real-time in-app notification for HR Recruiter
  const hrUser = application.jobId && application.jobId.postedBy
    ? await User.findById(application.jobId.postedBy)
    : null;

  const candidateName = application.candidateId?.name || 'The candidate';

  if (hrUser) {
    await createNotification({
      userId: hrUser._id,
      type: 'application_status',
      title: `Offer Letter ${response}: ${candidateName}`,
      message: `${candidateName} has ${response.toLowerCase()} the offer letter for ${application.jobTitle}.`,
      relatedApplicationId: updatedApplication._id,
    });

    if (hrUser.email) {
      sendOfferResponseEmail({
        hrEmail: hrUser.email,
        hrName: hrUser.name,
        candidateName,
        company: application.company || application.jobId?.company || 'Company',
        jobTitle: application.jobTitle || application.jobId?.title || 'Position',
        response,
        candidateComment: comment || '',
      }).catch((err) => console.error('Offer Response Email Error:', err.message));
    }
  }

  return updatedApplication;
};


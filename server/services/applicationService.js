import JobApplication from '../models/JobApplication.js';
import AppError from '../utils/AppError.js';

/**
 * Job Application Business Logic & Database Service.
 */

export const createApplication = async (userId, data) => {
  const { company, jobTitle, location, jobUrl, status, appliedDate } = data;

  const application = await JobApplication.create({
    userId,
    company,
    jobTitle,
    location,
    jobUrl,
    status: status || 'Applied',
    appliedDate: appliedDate || Date.now(),
  });

  return application;
};

export const getUserApplications = async (userId) => {
  const applications = await JobApplication.find({ userId }).sort({
    createdAt: -1,
  });
  return applications;
};

export const getApplicationById = async (id, userId) => {
  const application = await JobApplication.findOne({ _id: id, userId });
  if (!application) {
    throw new AppError('Job application not found', 404);
  }
  return application;
};

export const updateApplication = async (id, userId, data) => {
  const { company, jobTitle, location, jobUrl, status, appliedDate } = data;

  const application = await JobApplication.findOne({ _id: id, userId });
  if (!application) {
    throw new AppError('Job application not found', 404);
  }

  if (company !== undefined) application.company = company;
  if (jobTitle !== undefined) application.jobTitle = jobTitle;
  if (location !== undefined) application.location = location;
  if (jobUrl !== undefined) application.jobUrl = jobUrl;
  if (status !== undefined) application.status = status;
  if (appliedDate !== undefined) application.appliedDate = appliedDate;

  const updatedApplication = await application.save();
  return updatedApplication;
};

export const deleteApplication = async (id, userId) => {
  const application = await JobApplication.findOneAndDelete({ _id: id, userId });
  if (!application) {
    throw new AppError('Job application not found', 404);
  }
  return application;
};

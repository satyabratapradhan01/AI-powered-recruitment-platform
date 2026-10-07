import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Candidate ID is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    jobTitle: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    jobUrl: {
      type: String,
      trim: true,
      default: '',
    },
    resume: {
      fileUrl: { type: String, trim: true, default: '' },
      fileName: { type: String, trim: true, default: '' },
      fileKey: { type: String, trim: true, default: '' },
      parsedText: { type: String, default: '' },
    },
    coverLetter: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      required: [true, 'Application status is required'],
      enum: {
        values: [
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
        ],
        message: '{VALUE} is not a valid application status',
      },
      default: 'Applied',
    },
    offerDetails: {
      salary: { type: String, trim: true, default: '' },
      designation: { type: String, trim: true, default: '' },
      joiningDate: { type: Date, default: null },
      expiryDate: { type: Date, default: null },
      location: { type: String, trim: true, default: '' },
      additionalTerms: { type: String, trim: true, default: '' },
      sentAt: { type: Date, default: null },
      offerStatus: {
        type: String,
        enum: ['None', 'Sent', 'Accepted', 'Rejected', 'Revoked'],
        default: 'None',
      },
      candidateResponseAt: { type: Date, default: null },
      candidateComment: { type: String, trim: true, default: '' },
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    recruiterNotes: {
      type: String,
      trim: true,
      default: '',
    },
    atsScore: {
      type: Number,
      default: 0,
    },
    atsAnalysis: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

jobApplicationSchema.index(
  { jobId: 1, candidateId: 1 },
  { unique: true, partialFilterExpression: { jobId: { $exists: true } } }
);

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

export default JobApplication;

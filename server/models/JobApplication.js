import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
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
    status: {
      type: String,
      required: [true, 'Application status is required'],
      enum: {
        values: ['Applied', 'Interview', 'Offer', 'Rejected'],
        message: '{VALUE} is not a valid application status',
      },
      default: 'Applied',
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

export default JobApplication;

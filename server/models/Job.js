import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    responsibilities: [
      {
        type: String,
        trim: true,
      },
    ],
    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    preferredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    experienceRequired: {
      type: String,
      trim: true,
      default: '0-2 years',
    },
    location: {
      type: String,
      trim: true,
      default: 'Remote',
    },
    workMode: {
      type: String,
      enum: ['On-site', 'Hybrid', 'Remote'],
      default: 'Remote',
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      default: 'Full-time',
    },
    salaryMin: {
      type: Number,
      default: 0,
    },
    salaryMax: {
      type: Number,
      default: 0,
    },
    applicationDeadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Active', 'Draft', 'Closed'],
      default: 'Active',
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Job poster user ID is required'],
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ title: 'text', company: 'text', location: 'text', description: 'text' });

const Job = mongoose.model('Job', jobSchema);

export default Job;

import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobApplication',
      required: [true, 'Job application ID is required'],
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Candidate ID is required'],
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recruiter ID is required'],
    },
    interviewDate: {
      type: Date,
      required: [true, 'Interview date is required'],
    },
    interviewTime: {
      type: String,
      required: [true, 'Interview time is required'],
      trim: true,
    },
    duration: {
      type: Number,
      default: 45,
    },
    interviewType: {
      type: String,
      trim: true,
      default: 'Technical',
    },
    meetingLink: {
      type: String,
      trim: true,
      default: '',
    },
    interviewerName: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Rescheduled', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
  },
  {
    timestamps: true,
  }
);

interviewSchema.index({ candidateId: 1, interviewDate: 1 });
interviewSchema.index({ recruiterId: 1, interviewDate: 1 });
interviewSchema.index({ applicationId: 1 });

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;

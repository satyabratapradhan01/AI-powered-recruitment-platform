import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, trim: true, default: '' },
    fieldOfStudy: { type: String, trim: true, default: '' },
    institution: { type: String, trim: true, default: '' },
    startYear: { type: Number },
    endYear: { type: Number },
    isCurrent: { type: Boolean, default: false },
  },
  { _id: true }
);

const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: '' },
    company: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    startDate: { type: Date },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
    description: { type: String, trim: true, default: '' },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['job_seeker', 'seeker', 'hr', 'admin'],
      default: 'job_seeker',
    },
    accountStatus: {
      type: String,
      enum: ['active', 'deactivated', 'suspended'],
      default: 'active',
    },
    profile: {
      headline: { type: String, trim: true, default: '' },
      bio: { type: String, trim: true, default: '' },
      phone: { type: String, trim: true, default: '' },
      location: { type: String, trim: true, default: '' },
      website: { type: String, trim: true, default: '' },
      github: { type: String, trim: true, default: '' },
      linkedin: { type: String, trim: true, default: '' },
      companyName: { type: String, trim: true, default: '' },
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    education: [educationSchema],
    experience: [experienceSchema],
    resume: {
      fileUrl: { type: String, trim: true, default: '' },
      fileName: { type: String, trim: true, default: '' },
      uploadedAt: { type: Date },
      fileKey: { type: String, trim: true, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;

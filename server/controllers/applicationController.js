import JobApplication from '../models/JobApplication.js';

// @desc    Create a new job application
// @route   POST /api/applications
// @access  Private (Protected by JWT)
export const createApplication = async (req, res, next) => {
  try {
    const { company, jobTitle, location, jobUrl, status, appliedDate } = req.body;

    if (!company || !jobTitle) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide both company and jobTitle',
      });
    }

    const userId = req.user._id;

    const application = await JobApplication.create({
      userId,
      company,
      jobTitle,
      location,
      jobUrl,
      status: status || 'Applied',
      appliedDate: appliedDate || Date.now(),
    });

    res.status(201).json({
      status: 'success',
      message: 'Job application created successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all job applications for logged-in user
// @route   GET /api/applications
// @access  Private (Protected by JWT)
export const getApplications = async (req, res, next) => {
  try {
    const applications = await JobApplication.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      status: 'success',
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job application by ID (belonging to logged-in user)
// @route   GET /api/applications/:id
// @access  Private (Protected by JWT)
export const getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const application = await JobApplication.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        status: 'fail',
        message: 'Job application not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job application by ID (belonging to logged-in user)
// @route   PUT /api/applications/:id
// @access  Private (Protected by JWT)
export const updateApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { company, jobTitle, location, jobUrl, status, appliedDate } = req.body;

    const allowedStatuses = ['Applied', 'Interview', 'Offer', 'Rejected'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        status: 'fail',
        message: `Invalid status. Allowed values are: ${allowedStatuses.join(', ')}`,
      });
    }

    const application = await JobApplication.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        status: 'fail',
        message: 'Job application not found',
      });
    }

    if (company !== undefined) application.company = company;
    if (jobTitle !== undefined) application.jobTitle = jobTitle;
    if (location !== undefined) application.location = location;
    if (jobUrl !== undefined) application.jobUrl = jobUrl;
    if (status !== undefined) application.status = status;
    if (appliedDate !== undefined) application.appliedDate = appliedDate;

    const updatedApplication = await application.save();

    res.status(200).json({
      status: 'success',
      message: 'Job application updated successfully',
      data: updatedApplication,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job application by ID (belonging to logged-in user)
// @route   DELETE /api/applications/:id
// @access  Private (Protected by JWT)
export const deleteApplication = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find and delete document only if _id matches AND userId matches logged-in user
    const application = await JobApplication.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        status: 'fail',
        message: 'Job application not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Job application deleted successfully',
      data: {
        _id: application._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

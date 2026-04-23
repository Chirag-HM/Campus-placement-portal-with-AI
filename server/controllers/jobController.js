import Job from '../models/Job.js';
import User from '../models/User.js';
import { getIO, getUserSocket } from '../index.js';
import { awardXP } from '../services/gamificationService.js';
import { fetchAdzunaJobs } from '../services/adzunaService.js';

// Create a new job (recruiter/admin)
export const createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      postedBy: req.user._id,
    });

    // Emit real-time event to all connected students
    const io = getIO();
    if (io) {
      io.emit('job-posted', {
        _id: job._id,
        title: job.title,
        company: job.company,
        type: job.type,
        location: job.location,
        deadline: job.deadline,
      });
    }

    res.status(201).json({ job });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create job', error: error.message });
  }
};

// Get all jobs (with filters)
export const getJobs = async (req, res) => {
  try {
    const { type, location, skills, minCGPA, search, page = 1, limit = 12 } = req.query;

    const filter = { isActive: true };

    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (skills) filter.requiredSkills = { $in: skills.split(',').map(s => s.trim()) };
    if (minCGPA) filter['eligibility.minCGPA'] = { $lte: parseFloat(minCGPA) };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Job.countDocuments(filter);
    const jobs = await Job.find(filter)
      .populate('postedBy', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      jobs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single job
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email avatar')
      .populate('applications.student', 'name email avatar college branch cgpa skills');

    if (!job) return res.status(404).json({ message: 'Job not found' });

    res.json({ job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Apply to job (student)
export const applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (!job.isActive) return res.status(400).json({ message: 'Job is no longer active' });

    if (job.deadline && new Date(job.deadline) < new Date()) {
      return res.status(400).json({ message: 'Application deadline has passed' });
    }

    const alreadyApplied = job.applications.some(
      app => app.student.toString() === req.user._id.toString()
    );
    if (alreadyApplied) return res.status(400).json({ message: 'Already applied' });

    const { coverLetter, portfolioLink, answers } = req.body;
    job.applications.push({ 
      student: req.user._id,
      coverLetter,
      portfolioLink,
      answers
    });
    await job.save();

    // Add to user's appliedJobs
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { appliedJobs: job._id },
    });

    // Award XP for applying
    const xpResult = await awardXP(req.user._id, 10);

    res.json({ message: 'Applied successfully', xpResult });
  } catch (error) {
    res.status(500).json({ message: 'Application failed', error: error.message });
  }
};

// Update application status (recruiter)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { jobId, studentId, status } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const application = job.applications.find(
      app => app.student.toString() === studentId
    );
    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.status = status;
    await job.save();

    // Emit notification to student
    const io = getIO();
    const socketId = getUserSocket(studentId);
    if (io && socketId) {
      io.to(socketId).emit('application-update', {
        jobId: job._id,
        jobTitle: job.title,
        company: job.company,
        status,
      });

      if (status === 'shortlisted') {
        io.to(socketId).emit('notify-shortlisted', {
          jobTitle: job.title,
          company: job.company,
        });
      }
    }

    res.json({ message: 'Application status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

// Toggle save job (student)
export const toggleSaveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const jobId = req.params.id;

    const index = user.savedJobs.indexOf(jobId);
    if (index > -1) {
      user.savedJobs.splice(index, 1);
    } else {
      user.savedJobs.push(jobId);
    }

    await user.save();
    res.json({ savedJobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get recruiter's posted jobs
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate('applications.student', 'name email avatar');

    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get student's applied jobs
export const getAppliedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'appliedJobs',
      populate: { path: 'postedBy', select: 'name email' },
    });

    // Enrich with application status
    const jobs = await Promise.all(
      user.appliedJobs.map(async (job) => {
        const app = job.applications.find(
          a => a.student.toString() === req.user._id.toString()
        );
        return {
          ...job.toObject(),
          applicationStatus: app?.status || 'applied',
          appliedAt: app?.appliedAt,
          matchScore: app?.matchScore || 0,
        };
      })
    );

    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAdzunaJobs = async (req, res) => {
  try {
    const { what, page } = req.query;
    const jobs = await fetchAdzunaJobs(what, page);
    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch Adzuna jobs', error: error.message });
  }
};

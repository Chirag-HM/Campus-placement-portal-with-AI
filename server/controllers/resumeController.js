import pdf from 'pdf-parse/lib/pdf-parse.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import * as claudeService from '../services/claudeService.js';
import { cloudinary } from '../middleware/upload.js';
import https from 'https';
import http from 'http';

// Helper to download PDF buffer from URL
const downloadPDF = (url) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (response) => {
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
};

// Upload resume PDF
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);

    // If user had a previous resume, delete from Cloudinary
    if (user.resume?.publicId) {
      try {
        await cloudinary.uploader.destroy(user.resume.publicId, { resource_type: 'raw' });
      } catch (e) {
        console.warn('Could not delete old resume:', e.message);
      }
    }

    user.resume = {
      ...user.resume,
      url: req.file.path,
      publicId: req.file.filename,
      uploadedAt: new Date(),
      analysisHistory: user.resume?.analysisHistory || [],
    };

    await user.save();

    res.json({
      message: 'Resume uploaded successfully',
      resume: { url: user.resume.url, uploadedAt: user.resume.uploadedAt },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

// Analyse resume against job description
export const analyseResume = async (req, res) => {
  try {
    const { jobDescription, jobId, jobTitle } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.resume?.url) {
      return res.status(400).json({ message: 'Please upload a resume first' });
    }

    if (!jobDescription) {
      return res.status(400).json({ message: 'Job description is required' });
    }

    // Download and parse PDF
    const pdfBuffer = await downloadPDF(user.resume.url);
    const pdfData = await pdf(pdfBuffer);
    const resumeText = pdfData.text;

    // Call Claude AI
    const analysis = await claudeService.analyseResume(resumeText, jobDescription);

    // Save to analysis history
    user.resume.analysisHistory.push({
      jobId: jobId || null,
      jobTitle: jobTitle || 'General Analysis',
      ...analysis,
      analysedAt: new Date(),
    });

    await user.save();

    res.json({ analysis });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ message: 'Analysis failed', error: error.message });
  }
};

// AI Shortlist — recruiter only
export const aiShortlistCandidates = async (req, res) => {
  try {
    const { jobId } = req.body;

    const job = await Job.findById(jobId).populate('applications.student');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only shortlist for your own jobs' });
    }

    const jobDescription = `${job.title} at ${job.company}\n${job.description}\nRequired: ${job.requiredSkills.join(', ')}`;

    const results = [];

    for (const app of job.applications) {
      const student = app.student;
      if (!student?.resume?.url) {
        results.push({ studentId: student?._id, name: student?.name, matchScore: 0, keyStrengths: ['No resume uploaded'] });
        continue;
      }

      try {
        const pdfBuffer = await downloadPDF(student.resume.url);
        const pdfData = await pdf(pdfBuffer);
        const analysis = await claudeService.aiShortlist(pdfData.text, jobDescription);

        app.matchScore = analysis.matchScore;
        results.push({
          studentId: student._id,
          name: student.name,
          email: student.email,
          avatar: student.avatar,
          matchScore: analysis.matchScore,
          keyStrengths: analysis.keyStrengths,
        });
      } catch (e) {
        results.push({ studentId: student._id, name: student.name, matchScore: 0, keyStrengths: ['Analysis failed'] });
      }
    }

    await job.save();

    // Sort by matchScore descending
    results.sort((a, b) => b.matchScore - a.matchScore);

    res.json({ results });
  } catch (error) {
    console.error('Shortlist error:', error);
    res.status(500).json({ message: 'Shortlisting failed', error: error.message });
  }
};

// Get analysis history
export const getAnalysisHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ history: user.resume?.analysisHistory || [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

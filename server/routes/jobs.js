import { Router } from 'express';
import { createJob, getJobs, getJobById, applyToJob, updateApplicationStatus, toggleSaveJob, getMyJobs, getAppliedJobs, getAdzunaJobs } from '../controllers/jobController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', verifyToken, getJobs);
router.get('/my-jobs', verifyToken, requireRole('recruiter', 'admin'), getMyJobs);
router.get('/applied', verifyToken, getAppliedJobs);
router.get('/:id', verifyToken, getJobById);
router.post('/', verifyToken, requireRole('recruiter', 'admin'), createJob);
router.post('/:id/apply', verifyToken, requireRole('student'), applyToJob);
router.post('/:id/save', verifyToken, toggleSaveJob);
router.get('/adzuna', verifyToken, getAdzunaJobs);
router.patch('/application-status', verifyToken, requireRole('recruiter', 'admin'), updateApplicationStatus);

export default router;

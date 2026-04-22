import { Router } from 'express';
import { uploadResume as uploadResumeMiddleware } from '../middleware/upload.js';
import { uploadResume, analyseResume, aiShortlistCandidates, getAnalysisHistory } from '../controllers/resumeController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/upload', verifyToken, uploadResumeMiddleware, uploadResume);
router.post('/analyse', verifyToken, analyseResume);
router.post('/ai-shortlist', verifyToken, requireRole('recruiter', 'admin'), aiShortlistCandidates);
router.get('/history', verifyToken, getAnalysisHistory);

export default router;
